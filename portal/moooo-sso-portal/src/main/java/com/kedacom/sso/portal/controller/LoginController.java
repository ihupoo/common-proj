package com.kedacom.sso.portal.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.WebAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.utils.CookieUtils;
import com.kedacom.moooo.sso.authentication.DigestAuthenticationEntryPoint;
import com.kedacom.movision.base.constant.Constants;
import com.kedacom.movision.core.model.Message;
import com.kedacom.sso.portal.PortalConstants;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.service.VersionInfo;
import com.kedacom.sso.portal.util.AjaxMessage;
import com.kedacom.sso.portal.util.DirectlyRenderUtils;
import com.kedacom.sso.portal.util.ServerInfo;

/**
 * @author yangxufeng
 * @date 2014-7-9
 */
@Controller
@RequestMapping("")
public class LoginController {

	private static final String SPRING_SECURITY_URL_LOGIN = "/j_spring_security_check";
	private static final String SPRING_SECURITY_URL_LOGOUT = "/logout";
	// private static final String FORCE_MPDIFY_PASSWORD_URL =
	// "/modifypassword/force";

	private final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Resource
	private ServerInfo serverInfo;
	@Resource
	private VersionInfo versionInfo;

	@Resource
	private ConfigService configService;
	@Resource
	private DigestAuthenticationEntryPoint digestAuthenticationEntryPoint;

	/**
	 * 跳转到登录界面
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/login")
	public String login(HttpServletRequest request, ModelMap modelMap, HttpServletResponse response) {
		// Cookie[] cookies = request.getCookies();
		// if (cookies != null) {
		// for (Cookie cookie : cookies) {
		// if ("spring.i18n.locale".equals(cookie.getName())) {
		// String locale = cookie.getValue();
		// portalUtils.setCurLanguage(request, locale);
		// }
		// }
		// }
		String versionYear = versionInfo.getVersionYear();
		modelMap.addAttribute("versionYear", versionYear);
		String version = versionInfo.getVersion();
		modelMap.addAttribute("version", version);
		modelMap.addAttribute("realmName", digestAuthenticationEntryPoint.getRealmName());
		modelMap.addAttribute("nonceValue", digestAuthenticationEntryPoint.getNonceValue());

		/*
		 * String systemModel = ConfigConstants.SYSTEM_MODE;
		 * modelMap.addAttribute("systemModel",systemModel);
		 */

		String outAlter = "0";

		Cookie[] cookies = request.getCookies();
		int countCookiesS = 0;
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("loginUserName".equals(cookie.getName())) {
					try {
						modelMap.addAttribute("loginUserName", URLDecoder.decode(cookie.getValue(), "UTF-8"));
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				if (PortalConstants.COOKIE_NAME_S.equals(cookie.getName())) {
					countCookiesS++;
					try {
						if (cookie.getValue().equals(Constants.ONE)) {
							modelMap.addAttribute("showVerifyCode", Constants.ONE);
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				if (PortalConstants.COOKIE_NAME_OUT.equals(cookie.getName())) {
					outAlter = cookie.getValue();
					cookie.setPath("/");
					cookie.setMaxAge(5);
					response.addCookie(cookie);
				}
			}
		}
		modelMap.addAttribute("outAlter", outAlter);
		if (countCookiesS == 0) {
			try {
				Cookie cookie = new Cookie(PortalConstants.COOKIE_NAME_S, Constants.ZERO);
				String path = configService.getDomainType().equals(Constants.ONE) ? PortalConstants.PORTAL_PATH
						: PortalConstants.PORTALCORE_PATH;
				cookie.setPath(path);
				cookie.setMaxAge(-1);
				response.addCookie(cookie);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		modelMap.addAttribute("SYSTEM_MODE", configService.getSystemMode());

		return "login";
	}

	/**
	 * 登录操作
	 * @param email
	 * @param password
	 * @param remember
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/toLogin")
	public void login(String email, String password, Boolean remember, String verifyCode, HttpServletRequest request,
			HttpServletResponse response) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "");

		boolean isChecked = true;
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (PortalConstants.COOKIE_NAME_S.equals(cookie.getName())) {
					if (cookie.getValue().equals(Constants.ONE)) {
						isChecked = false;
					}
				}
			}
		}

		try {
			if (isChecked) {
				if (StringUtils.isBlank(verifyCode)) {
					message.setSuccess(false);
					message.setDescription("验证码不能为空！");
					DirectlyRenderUtils.renderJson(response, message);
					return;
				} else {
					String vc = (String) request.getSession().getAttribute("verifyCode");
					if (!verifyCode.equalsIgnoreCase(vc)) {
						message.setSuccess(false);
						message.setDescription("验证码错误，请重新输入！");
						DirectlyRenderUtils.renderJson(response, message);
						return;
					}
				}
			}

			login(email, password, remember, false, response, request);
		} catch (BusinessException e) {
			logger.info(e.getMessage());
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (Exception e) {
			logger.info(e.getMessage());
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription("系统异常,请联系管理员联系！");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

	@RequestMapping(value = "/slogin", method = RequestMethod.POST)
	public void loginget(String email, String password, Boolean remember, String isChecked, String verifyCode,
			HttpServletRequest request, HttpServletResponse response) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "");
		try {
			response.sendRedirect(new StringBuilder(request.getContextPath()).append("/login/success").toString());
			return;
		} catch (BusinessException e) {
			logger.info(e.getMessage());
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (Exception e) {
			logger.info(e.getMessage());
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription("系统异常,请联系管理员联系！");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

	/** 退出 */
	@RequestMapping("/loginout")
	public void logout(HttpServletRequest request, HttpServletResponse response) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "退出系统成功！");
		try {
			logout(response, request);
		} catch (Exception e) {
			logger.info(e.getMessage());
			message.setSuccess(false);
			message.setDescription("系统异常，请与管理员联系！");
		}

		DirectlyRenderUtils.renderJson(response, message);
	}

	@RequestMapping(value = "/login/success", method = RequestMethod.GET)
	public void loginSuccess(HttpServletResponse response, HttpServletRequest request) {
		List<Object> parmList = new ArrayList<Object>();
		parmList.add(UserContext.getCurrentUser().getIsCurrentPlatForm());
		if (!UserContext.getCurrentUser().getIsCurrentPlatForm()) {
			// parmList.add(UserContext.getCurrentUser().getPlatformInfo());
			try {
				String url = "http://" + UserContext.getCurrentUser().getPlatformInfo() + "/portal/login?account="
						+ escape(UserContext.getCurrentUser().getUsername());
				parmList.add(url);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		CookieUtils.removeCookie(request, response, Constants.USB_WARN_NOTIFY_STATE);
		CookieUtils.removeCookie(request, response, PortalConstants.COOKIE_NAME_OUT);

		try {
			Cookie cookie = new Cookie(PortalConstants.COOKIE_NAME_S, Constants.ZERO);
			String path = configService.getDomainType().equals(Constants.ONE) ? PortalConstants.PORTAL_PATH
					: PortalConstants.PORTALCORE_PATH;
			cookie.setPath(path);
			cookie.setMaxAge(-1);
			response.addCookie(cookie);
		} catch (Exception e) {
			e.printStackTrace();
		}

		AjaxMessage<Object> message = new AjaxMessage<Object>(true, "登录成功！", parmList);
		DirectlyRenderUtils.renderJson(response, message);
	}

	@RequestMapping(value = "/login/failure", method = RequestMethod.GET)
	public void loginFailure(HttpServletResponse response, HttpServletRequest request) {
		RuntimeException ex = (RuntimeException) request.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);

		String exception = ex.getMessage();
		if (!"您没有使用当前系统的权限！".equals(exception)) {
			exception = "用户名或密码错误！";
		}
		/*
		 * Map<String, Object> data = new HashMap<String, Object>(); boolean
		 * isJump = false; if (ex instanceof SSOException) { String code =
		 * ((SSOException) ex).getCode(); if (skipUrl(code)) { StringBuilder url
		 * = new StringBuilder(request.getContextPath()).append(
		 * FORCE_MPDIFY_PASSWORD_URL )
		 * .append("/").append(request.getParameter("j_username")).append("/").
		 * append(code); isJump = true; data.put("jumpUrl", url.toString()); } }
		 * data.put("isJump", isJump);
		 */
		AjaxMessage<Object> message = new AjaxMessage<Object>(false, exception);
		// message.setData(JSONObject.fromObject(data));
		DirectlyRenderUtils.renderJson(response, message);
	}

	/**
	 * SSO错误码跳转页面
	 */
	/*
	 * private static boolean skipUrl(String code) { if ("test".equals(code) ||
	 * "100004".equals(code) || "100005".equals(code) || "100006".equals(code))
	 * { return true; } return false; }
	 */

	private void login(String userName, String passWord, Boolean rememberMe, Boolean isMD5,
			HttpServletResponse response, HttpServletRequest request) throws IOException {

		StringBuilder url = new StringBuilder(request.getContextPath()).append(SPRING_SECURITY_URL_LOGIN)
				.append("?j_password_encoder=").append(isMD5).append("&j_username=")
				.append(URLEncoder.encode(userName, "UTF-8")).append("&j_password=")
				.append(URLEncoder.encode(passWord, "UTF-8")).append("&_spring_security_remember_me=")
				.append(rememberMe).append("&source=").append("web");
		response.sendRedirect(url.toString());
	}

	/**
	 * 登出调用spring security
	 * @param response
	 * @param request
	 * @throws IOException
	 */
	public void logout(HttpServletResponse response, HttpServletRequest request) throws IOException {
		StringBuilder url = new StringBuilder(request.getContextPath()).append(SPRING_SECURITY_URL_LOGOUT);
		response.sendRedirect(url.toString());
	}

	private String escape(String parm) throws ScriptException {
		ScriptEngineManager sem = new ScriptEngineManager();
		ScriptEngine engine = sem.getEngineByExtension("js");
		return (String) engine.eval("escape('" + parm + "')");
	}

	/** 登录 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public void login(HttpServletRequest request, HttpServletResponse response, Boolean remember, String account,
			String password, String enableVerifyCode, String verifyCode) {
		account = "admin1";
		if (Constants.ONE.equals(enableVerifyCode)) {
			if (StringUtils.isNotEmpty(verifyCode)) {
				String vc = (String) request.getSession().getAttribute("verifyCode");
				if (!verifyCode.equalsIgnoreCase(vc)) {
					Message<String> message = new Message<String>(false, "验证码错误，请重新输入！");
					DirectlyRenderUtils.renderJson(response, message);
					return;
				}
			} else {
				Message<String> message = new Message<String>(false, "验证码不能为空！");
				DirectlyRenderUtils.renderJson(response, message);
				return;
			}
		}

		try {
			login(account, password, remember, false, response, request);
		} catch (Exception e) {
			Message<String> message = new Message<String>(false, "系统异常，请与管理员联系！");
			DirectlyRenderUtils.renderJson(response, message);
		}
	}
}
