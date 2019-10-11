package com.kedacom.sso.portal.controller;

import java.net.URLDecoder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.kedacom.moooo.cipher.SMUtils;
import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.web.utils.DirectlyRenderUtils;
import com.kedacom.moooo.sso.authentication.DigestAuthenticationEntryPoint;
import com.kedacom.movision.base.model.SecurityPolicy;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.movision.common.Constants;
import com.kedacom.movision.common.util.SecurityPolicyUtil;
import com.kedacom.sso.portal.service.CXFService;
import com.kedacom.sso.portal.service.PortalService;
import com.kedacom.sso.portal.service.VersionInfo;
import com.kedacom.sso.portal.util.AjaxMessage;


@Controller
@RequestMapping(value = "/modifypassword")
public class ModifyPasswordController {
	
	private final String forceupdatepassword = "/modifypassword/forceupdatepassword";
	
	Logger logger = LoggerFactory.getLogger(ModifyPasswordController.class);
	
	@Resource(name = "CXFService")
	private CXFService cxfService;
	@Resource
	private PortalService portalService;
	@Resource
	private VersionInfo versionInfo;
	@Resource
	private DigestAuthenticationEntryPoint digestAuthenticationEntryPoint;
	
	@RequestMapping("/force/{username}/{code}")
	public String checkResetLink(ModelMap modelMap, @PathVariable("username") String username,
			@PathVariable("code") String code) {
		try {
			if (StringUtils.isEmpty(code) || StringUtils.isEmpty(username)) {
				throw new BusinessException("请求参数不正确。");
			}
			username = URLDecoder.decode(username, "UTF-8");
			UserVO source = cxfService.getAmsCXFService().getAccountInfo(username);
			if (source == null) {
				throw new BusinessException("账号不存在");
			}
			portalService.setPortraitDomain(source, modelMap);
			UserVO userVO = new UserVO();
			userVO.setAccount(username);
			userVO.setPortrait40(source.getPortrait40());
			modelMap.addAttribute("currentuser", userVO);
			modelMap.addAttribute("systemSecurity",
					StringUtils.isBlank(source.getEncryptionPassword()) ? Constants.ZERO : Constants.ONE);

			SecurityPolicy policy = cxfService.getAmsCXFService().getAccountSecurityPolicy(username);
			modelMap.addAttribute("securityPolicy", policy);
			modelMap.addAttribute("umoid", source.getMoid());
			modelMap.addAttribute("realmName", digestAuthenticationEntryPoint.getRealmName());
			String realmName = digestAuthenticationEntryPoint.getRealmName();
			if (StringUtils.isNotEmpty(realmName) && realmName.length() > 16) {
				realmName = realmName.substring(0, 16);
			}
			modelMap.addAttribute("nonce", realmName);
		} catch (Exception e) {
			if (logger.isDebugEnabled()) {
				logger.debug("用户信息获取失败。", e);
			}
			return "redirect:/login";
		}
		modelMap.addAttribute("code", code);
		modelMap.addAttribute("description", getErrorMsg(code));
		modelMap.addAttribute("username", username);
		modelMap.addAttribute("strengthRegular",
				SecurityPolicyUtil.strengthAndRegularJSONStr);
		String versionYear = versionInfo.getVersionYear();
		modelMap.addAttribute("versionYear", versionYear);


		return forceupdatepassword;
	}
	
	@RequestMapping(value = "/reset", method = RequestMethod.POST)
	public void resetPassword(HttpServletResponse response, String username, String knonce, String ciphertext,
			String hmac, String key) {
		AjaxMessage<String> message = new AjaxMessage<String>(true,
				"密码修改成功，请重新登录。	");
		try {
			UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(username);
			if (null != userVO) {
				String realmName = digestAuthenticationEntryPoint.getRealmName();
				if (StringUtils.isNotEmpty(realmName) && realmName.length() > 16) {
					realmName = realmName.substring(0, 16);
				}
				String oldPassword = null;
				String newPassword = null;
				if (StringUtils.isNotBlank(userVO.getEncryptionPassword())) {
					oldPassword = SMUtils.decrypt(userVO.getEncryptionPassword());
					newPassword = SMUtils.decrypt(SMUtils.getNewPassword(knonce, ciphertext, hmac,
							digestAuthenticationEntryPoint.getRealmName(), userVO.getMoid(),
							userVO.getEncryptionPassword()));
				} else {
					if (StringUtils.isNotBlank(key)) {
						String[] params = key.split(Constants.CHAR_UNDER_LINE);
						if (null == params || params.length < 3) {
							throw new BusinessException("密码修改失败");
						}
						oldPassword = SMUtils.getMWPassword(params[0], params[1], params[2],
								digestAuthenticationEntryPoint.getRealmName(), userVO.getMoid(), userVO.getPassword());
					} else {
						throw new BusinessException("密码修改失败");
					}
					newPassword = SMUtils.getMWPassword(knonce, ciphertext, hmac,
							digestAuthenticationEntryPoint.getRealmName(), userVO.getMoid(), userVO.getPassword());
				}
				boolean result = cxfService.getAmsCXFService().updatePassword(username, oldPassword, newPassword);
				// 首次修改密码后，更新首次登陆状态
				if (null != userVO.getFirstLogin() && userVO.getFirstLogin()) {
					cxfService.getAmsCXFService().updateAccountFirstLogin(userVO.getMoid());
				}
				if (!result) {
					message.setSuccess(false);
					message.setDescription("密码修改失败，请联系系统管理员。");
				}
			} else {
				logger.error("用户信息查询失败：" + username);
				message.setSuccess(false);
				message.setDescription("密码修改失败，请联系系统管理员。");
			}
		}catch(BusinessException e){
			logger.error("密码修改失败", e);
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		}catch (Exception e) {
			logger.error("密码修改失败", e);
			message.setSuccess(false);
			message.setDescription("密码修改失败，请联系系统管理员。");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	/**
	 * 错误码转换
	 */
	private static String getErrorMsg(String code) {
		String errMsg = "";
		if ("100004".equals(code)) {
			errMsg = "首次登陆请修改密码。";
		} else if ("100005".equals(code)) {
			errMsg = "密码已过期，请修改密码。";
		} else if ("100006".equals(code)) {
			errMsg = "密码强度已加强，请修改密码。";
		}
		return errMsg;
	}
	
	@RequestMapping(value = "/checkOldPassword", method = RequestMethod.POST)
	public void checkOldPassword(HttpServletResponse response, String knonce, String ciphertext, String hmac,
			String username) {
		logger.info("校验老密码");
		AjaxMessage<String> message = new AjaxMessage<String>(true, "密码正确");
		if (StringUtils.isNotEmpty(username)) {
			UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(username);
			if (null == userVO) {
				throw new BusinessException("用户信息获取失败");
			}
			try {
				if (StringUtils.isNotBlank(userVO.getEncryptionPassword())) {
					SMUtils.getNewPassword(knonce, ciphertext, hmac, digestAuthenticationEntryPoint.getRealmName(),
							userVO.getMoid(), userVO.getEncryptionPassword());
				} else {
					SMUtils.getMWPassword(knonce, ciphertext, hmac, digestAuthenticationEntryPoint.getRealmName(),
							userVO.getMoid(), userVO.getPassword());
				}
				message.setData("1");
				message.setDescription("密码正确");
			} catch (BusinessException e) {
				message.setData("0");
				message.setDescription("密码错误");
			} catch (Exception e) {
				message.setData("0");
				message.setDescription("请求参数不正确。");
			}
			// if (StringUtils.isNotEmpty(oldPassword)) {
			// boolean checkResult =
			// cxfService.getAmsCXFService().validatePassword(userVO.getMoid(),
			// oldPassword);
			// if (checkResult) {
			// message.setData("1");
			// message.setDescription("密码正确");
			// } else {
			// message.setData("0");
			// message.setDescription("密码错误");
			// }
			// } else {
			// message.setSuccess(false);
			// message.setDescription("请求参数不正确。");
			// }
		} else {
			message.setSuccess(false);
			message.setDescription("请求参数不正确。");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

}
