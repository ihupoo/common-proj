package com.kedacom.sso.portal.security;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.web.authentication.www.NonceExpiredException;

import com.kedacom.moooo.core.web.AjaxMessage;
import com.kedacom.moooo.core.web.utils.DirectlyRenderUtils;
import com.kedacom.movision.common.Constants;
import com.kedacom.sso.portal.PortalConstants;
import com.kedacom.sso.portal.service.ConfigService;

/**
 * 门户摘要认证异常处理
 * 
 * @author ranran.ye
 * @date 2019年1月24日
 */
public class DigestAuthenticationEntryPoint extends com.kedacom.moooo.sso.authentication.DigestAuthenticationEntryPoint {

	private static final Log logger = LogFactory.getLog(DigestAuthenticationEntryPoint.class);
	@Resource
	private ConfigService configService;
	// 不需要添加验证码的验证错误
	private List<String> noVcodeErrorCode = new ArrayList<String>();

	@Override
	protected void render(HttpServletResponse response, String errorCode, RuntimeException ex) {
		String exception = ex.getMessage();
		if (!("您没有使用当前系统的权限！".equals(exception) || "国密版本，请重置密码！".equals(exception))) {
			exception = "用户名或密码错误！";
		}
		AjaxMessage<Object> message = new AjaxMessage<Object>(false, exception);
		message.setErrorCode(errorCode);
		// 指定SSO错误码处理
		if (getFailureErrorCode().contains(errorCode)) {
			message.setData(ex.getMessage());
		}


		if (!NonceExpiredException.class.isAssignableFrom(ex.getClass())) {
			if (!getNoVcodeErrorCode().contains(errorCode)) {
				// 非Nonce超时，则需要验证码校验
				setVcodeCookie(response);
			}
		}

		DirectlyRenderUtils.renderJson(response, message);
	}

	// 添加错误标记cookie
	private void setVcodeCookie(HttpServletResponse response) {
		try {
			Cookie cookie = new Cookie(PortalConstants.COOKIE_NAME_S, Constants.ONE);
			String path = configService.getDomainType().equals(Constants.ONE) ? PortalConstants.PORTAL_PATH
					: PortalConstants.PORTALCORE_PATH;
			cookie.setPath(path);
			cookie.setMaxAge(-1);
			response.addCookie(cookie);
		} catch (Exception e) {
			logger.error("登录异常，验证码标志写入失败：" + e.getMessage());
		}
	}

	public List<String> getNoVcodeErrorCode() {
		return noVcodeErrorCode;
	}

	public void setNoVcodeErrorCode(List<String> noVcodeErrorCode) {
		this.noVcodeErrorCode = noVcodeErrorCode;
	}

}