package com.kedacom.sso.portal.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kedacom.moooo.cipher.SMUtils;
import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.sso.authentication.DigestAuthenticationEntryPoint;
import com.kedacom.movision.base.constant.Constants;
import com.kedacom.movision.base.model.SecurityPolicy;
import com.kedacom.movision.common.util.SecurityPolicyUtil;
import com.kedacom.sso.portal.PortalConstants;
import com.kedacom.sso.portal.service.CXFService;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.service.PasswordService;
import com.kedacom.sso.portal.service.PortalService;
import com.kedacom.sso.portal.service.VersionInfo;
import com.kedacom.sso.portal.util.AjaxMessage;


@Controller
@RequestMapping(value = "/forgetpassword")
public class ForgetPasswordController {
	
	private final String expiredPage = "resetpassword/expiredpage";
	private final String resetpassword = "resetpassword/resetpassword";
	
	Logger logger = LoggerFactory.getLogger(ForgetPasswordController.class);
	
	@Resource
	private DigestAuthenticationEntryPoint digestAuthenticationEntryPoint;
	
	@Resource
	private PasswordService passwordService;
	
	@Resource
	private VersionInfo versionInfo;
	
	@Resource
	private ConfigService configService;
	
	@Resource(name = "CXFService")
	private CXFService cxfService;

	@Resource
	private PortalService portalService;
	
	@RequestMapping(value = "/sendemail",method = RequestMethod.POST)
	@ResponseBody
	public AjaxMessage<String> sendEmail(String email, HttpServletRequest request) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "邮件发送成功");
		try {
			String systemModel = configService.getSystemMode();
			passwordService.sendPortalEmail(email, PortalConstants.emailSource, systemModel, getProxyCarrier(request));
		} catch (BusinessException e) {
			e.printStackTrace();
			logger.info(e.toString());
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			logger.info(e.toString());
			message.setSuccess(false);
			message.setDescription("系统异常，请联系系统管理员");
		}
		return message;
	}
	
	/**
	 * 获取运营商信息
	 */
	private String getProxyCarrier(HttpServletRequest request) {
		String carrier = request.getHeader("proxy_carrier");
		if (!StringUtils.isEmpty(carrier)) {
			try {
				carrier = URLDecoder.decode(carrier, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				logger.debug("运营商URL解码失败");
				logger.debug(e.getMessage());
			}
		}
		return carrier;
	}

	@RequestMapping("/checkresetlink/{email}/{sequenceNum}")
	public String checkResetLink(ModelMap modelMap,
			String url,@PathVariable("email") String email,@PathVariable("sequenceNum") String sequenceNum){
		
		String versionYear = versionInfo.getVersionYear();
		modelMap.addAttribute("versionYear", versionYear);
		String version = versionInfo.getVersion();
		modelMap.addAttribute("version", version);
		modelMap.addAttribute("SYSTEM_MODE", configService.getSystemMode());
		SecurityPolicy policy = cxfService.getAmsCXFService().getAccountSecurityPolicy(email);
		modelMap.addAttribute("securityPolicy", policy);
		modelMap.addAttribute("strengthRegular",
				SecurityPolicyUtil.strengthAndRegularJSONStr);
		try {
			passwordService.checkPasswordLink(email, sequenceNum);
			modelMap.addAttribute("email", email);
			modelMap.addAttribute("sequenceNum", sequenceNum);
			modelMap.addAttribute("realmName", digestAuthenticationEntryPoint.getRealmName());
			String realmName = digestAuthenticationEntryPoint.getRealmName();
			if (StringUtils.isNotEmpty(realmName) && realmName.length() > 16) {
				realmName = realmName.substring(0, 16);
			}
			modelMap.addAttribute("nonce", realmName);
			return resetpassword;
		}catch(BusinessException e){
			modelMap.addAttribute("message", "链接失效，请重新操作或联系客服。");
			e.printStackTrace();
			logger.info(e.toString());
		}catch (Exception e) {
			modelMap.addAttribute("message", "系统异常，请联系系统管理员");
			e.printStackTrace();
			logger.info(e.toString());
		}
		return expiredPage;
	}
	
	@RequestMapping("/resetpassword")
	@ResponseBody
	public AjaxMessage<String> resetPassword(String email, String knonce, String ciphertext, String hmac,
			String sequenceNum) {
		try {
			passwordService.checkPasswordLink(email, sequenceNum);
			String realmName = digestAuthenticationEntryPoint.getRealmName();
			if (StringUtils.isNotEmpty(realmName) && realmName.length() > 16) {
				realmName = realmName.substring(0, 16);
			}
			String newPassword = SMUtils.getNewPassword(knonce, ciphertext, hmac,
					digestAuthenticationEntryPoint.getRealmName(), email,
					SMUtils.encrypt(realmName));
			passwordService.resetPassword(email, SMUtils.decrypt(newPassword));
			// 核心域需要主动对账号进行解锁
			if (Constants.ZERO.equals(configService.getDomainType())) {
				try {
					cxfService.getSSOCXFService().releaseAccountLocking(email);
				} catch (Exception e) {
					logger.error("账号解锁处理失败");
				}
			}
			return new AjaxMessage<String>(true, "密码重置成功");
		}catch(BusinessException e){
			logger.info(e.toString());
			return new AjaxMessage<String>(false, e.getMessage());
		}
		catch (Exception e) {
			logger.info(e.toString());
			return new AjaxMessage<String>(false, "系统错误，请联系系统管理员");
		}
	}

	@RequestMapping(value = "/checkNewPassword", method = RequestMethod.POST)
	@ResponseBody
	public AjaxMessage<String> checkNewPassword(String email, String knonce, String ciphertext, String hmac,
			String sequenceNum) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "");
		try {
			passwordService.checkPasswordLink(email, sequenceNum);
			String realmName = digestAuthenticationEntryPoint.getRealmName();
			if (StringUtils.isNotEmpty(realmName) && realmName.length() > 16) {
				realmName = realmName.substring(0, 16);
			}
			String newPassword = SMUtils.decrypt(SMUtils.getNewPassword(knonce, ciphertext, hmac, digestAuthenticationEntryPoint.getRealmName(), email, SMUtils.encrypt(realmName)));
			Map<String, String> params = new HashMap<String, String>();
			params.put("password", newPassword);
			params.put("email", email);
			Object result = portalService.postToApiCore("/ams/checkUsedPassword", params);
			if (null != result) {
				message.setData(result.toString());
			}
		} catch (BusinessException e) {
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (RuntimeException e) {
			message.setSuccess(false);
			message.setDescription("系统繁忙，请稍后再试！");
			logger.info(e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("操作出现未知错误，请与系统管理员联系！");
			logger.info("操作失败，" + e.getMessage());
			e.printStackTrace();
		}
		return message;
	}
}
