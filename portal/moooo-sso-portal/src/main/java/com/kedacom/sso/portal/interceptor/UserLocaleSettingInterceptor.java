package com.kedacom.sso.portal.interceptor;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

public class UserLocaleSettingInterceptor implements HandlerInterceptor {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean en = false;

	private CookieLocaleResolver localeResolver;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		Locale locale = this.getLocaleFromUserContext();
//		logger.debug("user locale is {}", locale);

		localeResolver.setLocale((HttpServletRequest) request, (HttpServletResponse) response, locale);
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}

	private Locale getLocaleFromUserContext() {
		// TODO read locale setting from user context
		if (en) {
			en = false;
			return newLocale("en_US");
		} else {
			en = true;
			return Locale.CHINA;
		}
	}

	private static Locale newLocale(String locale) {
		String[] items = locale.split("_");
		if (items.length == 1) {
			return new Locale(items[0]);
		} else if (items.length == 2) {
			return new Locale(items[0], items[1]);
		} else if (items.length == 3) {
			return new Locale(items[0], items[1], items[2]);
		}
		return null;
	}

	public void setLocaleResolver(CookieLocaleResolver localeResolver) {
		this.localeResolver = localeResolver;
	}

}
