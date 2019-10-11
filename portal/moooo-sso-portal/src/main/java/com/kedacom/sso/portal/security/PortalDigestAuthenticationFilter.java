package com.kedacom.sso.portal.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;

import com.kedacom.moooo.cipher.SMUtils;
import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.utils.CookieUtils;
import com.kedacom.moooo.core.web.AjaxMessage;
import com.kedacom.moooo.core.web.utils.DirectlyRenderUtils;
import com.kedacom.moooo.sso.authentication.DigestAuthenticationFilter;
import com.kedacom.moooo.sso.bean.DigestAuthenticationToken;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.movision.common.Constants;
import com.kedacom.sso.portal.PortalConstants;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.service.CXFService;
import com.kedacom.sso.portal.service.ConfigService;


/**
 * 门户摘要认证登陆拦截器
 * 
 * <pre>
 * 1.增加验证码业务校验
 * 2.兼容旧环境升级，老账号不存在SM密码解决方案
 * 3.支持国密环境强制SM密码方案验证
 * </pre>
 * 
 * @author ranran.ye
 * @date 2019年1月24日
 */
public class PortalDigestAuthenticationFilter extends DigestAuthenticationFilter {

	private static final Log logger = LogFactory.getLog(PortalDigestAuthenticationFilter.class);

	private ConfigService configService;

	private CXFService cxfService;

	public void setConfigService(ConfigService configService) {
		this.configService = configService;
	}

	public void setCxfService(CXFService cxfService) {
		this.cxfService = cxfService;
	}

	/**
	 * 构建摘要认证密码信息
	 * 
	 * <pre>
	 * 说明：
	 *     credentials：1.国密密码摘要（使用SM密码解密后的明文） 2.MD5密码摘要（使用账户的MD5密码，仅在不存在SM密码场景下使用）
	 * </pre>
	 * 
	 */
	@Override
	protected DigestAuthenticationToken createDigestAuthentication(UserDetails userDetail) throws BusinessException {
		String originalPassword = ((SessionUser) userDetail).getEncryptionPassword();// SM密码
		if (!StringUtils.isEmpty(originalPassword)) {
			return new DigestAuthenticationToken(userDetail, SMUtils.decrypt(originalPassword));// 明文密码
		} else {
			return new DigestAuthenticationToken(userDetail, ((SessionUser) userDetail).getPassword());// MD5密码
		}
	}

	/**
	 * 获取SSO登陆验证的明文密码
	 * 
	 * <pre>
	 * 说明：
	 *     账号安全要求，SSO需要根据明文密码判断强度等验证
	 *     摘要认证通过后，传入明文密码进行单点登录
	 *     单点登录使用的明文密码：1.数据库SM密码解密 2.使用前台加密参数反解密（5.1环境不支持SM密码场景，只有MD5密码，后台需要获取到前台填写的明文密码）
	 * </pre>
	 * 
	 */
	@Override
	protected String getDigestOriginalPassword(HttpServletRequest request, UserDetails userDetail,
			DigestAuthenticationToken token) {
		SessionUser sessionUser = (SessionUser) userDetail;
		String originalPassword = ((SessionUser) userDetail).getEncryptionPassword();// SM密码
		if (!StringUtils.isEmpty(originalPassword)) {// 5.2 SM方案
			return SMUtils.decrypt(originalPassword);
		} else {// 兼容MD5方案
			String knonce = request.getParameter("knonce");
			String ciphertext = request.getParameter("ciphertext");
			String hmac = request.getParameter("hmac");
			if (!StringUtils.isEmpty(knonce) && !StringUtils.isEmpty(ciphertext) && !StringUtils.isEmpty(hmac)) {
				try {
					return SMUtils.getMWPassword(knonce, ciphertext, hmac,
							getAuthenticationEntryPoint().getRealmName(), sessionUser.getUsername(),
							sessionUser.getPassword());
				} catch (Exception e) {
					logger.error("账号或密码不正确", e);
					throw new BusinessException("账号或密码不正确！");
				}
			} else {
				logger.error("hmac不正确");
				throw new BusinessException("账号或密码不正确！");
			}
		}
	}

	/**
	 * 检测当前是否国密环境，国密环境不允许使用MD5方案
	 */
	@Override
	protected void checkCertificateVersion(UserDetails userDetail) throws BusinessException {
		if (Constants.ONE.equals(configService.getDomainType())
				&& StringUtils.isEmpty(((SessionUser) userDetail).getEncryptionPassword())) {
			UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(userDetail.getUsername());
			if (null != userVO && !StringUtils.isEmpty(userVO.getUserDomainMoid())) {
				boolean isCert = false;
				try {
					isCert = cxfService.getAmsCXFService().getCertificateStatus(userVO.getUserDomainMoid());
				} catch (Exception e) {
					logger.error("验证是否国密版本异常:" + e.getMessage());
				}
				if (isCert) {
					throw new BusinessException("国密版本，请重置密码！");
				}
			}
		}
	}

	/**
	 * 验证码校验
	 */
	@Override
	protected boolean checkVerifyCode(HttpServletRequest request, HttpServletResponse response) {
		boolean isChecked = true;
		Cookie cookie = CookieUtils.getCookie(request, PortalConstants.COOKIE_NAME_S);
		if (null != cookie && Constants.ZERO.equals(cookie.getValue())) {
			isChecked = false;
		}
		if (isChecked) {
			String verifyCode = request.getParameter("verifyCode");
			String errMsg = "";
			if (StringUtils.isEmpty(verifyCode)) {
				errMsg = "验证码不能为空！";
			} else {
				String vc = (String) request.getSession().getAttribute("verifyCode");
				if (!verifyCode.equalsIgnoreCase(vc)) {
					errMsg = "验证码错误，请重新输入！";
				}
			}
			if (!StringUtils.isEmpty(errMsg)) {
				AjaxMessage<String> result = new AjaxMessage<String>();
				result.setSuccess(false);
				result.setErrorCode(null);
				result.setDescription(errMsg);
				DirectlyRenderUtils.renderJson(response, result);
				return false;
			}
		}
		return true;
	}

	/**
	 * 系统时间校验
	 */
	@Override
	protected boolean checkSystemTime(HttpServletRequest request, HttpServletResponse response) {
		boolean flag = true;
		String timestamp = request.getParameter("timestamp");
		long now = System.currentTimeMillis();
		long target = now + 864000000;// 14天1209600000,10天864000000
		if (!StringUtils.isEmpty(timestamp)) {
			long time = Long.valueOf(timestamp);
			if (time > target) {
				flag = false;
			}
		}
		if (!flag) {
			String errMsg = "系统时间不正确，请修改后再试！";
			AjaxMessage<String> result = new AjaxMessage<String>();
			result.setSuccess(false);
			result.setErrorCode(null);
			result.setDescription(errMsg);
			try {
				Cookie cookie = new Cookie(PortalConstants.COOKIE_NAME_S, Constants.ONE);
				String path = configService.getDomainType().equals(Constants.ONE) ? PortalConstants.PORTAL_PATH
						: PortalConstants.PORTALCORE_PATH;
				cookie.setPath(path);
				cookie.setMaxAge(-1);
				response.addCookie(cookie);
			} catch (Exception e) {
				e.printStackTrace();
			}
			DirectlyRenderUtils.renderJson(response, result);
		}
		return flag;
	}

	@Override
	protected UserDetails authenticate(boolean isSecurity, String username, String password) throws Exception {
		UserDetails user = null;
		if (isSecurity) {
			user = getUserDetailsService().loadUserByUsername(username, password);
		} else {// 非账号安全登陆方案

		}
		if (user == null) {
			throw new AuthenticationServiceException(
					"AuthenticationDao returned null, which is an interface contract violation");
		}
		return user;
	}

}

