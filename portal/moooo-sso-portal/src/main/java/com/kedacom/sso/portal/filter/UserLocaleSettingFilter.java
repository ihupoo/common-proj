package com.kedacom.sso.portal.filter;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

import com.kedacom.sso.portal.core.SpringContextHelper;

/**
 * 设置用户Locale
 * @author luocanfeng
 * @date 2014-7-7
 */
public class UserLocaleSettingFilter implements Filter {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean en = false;

	private CookieLocaleResolver localeResolver;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		localeResolver = SpringContextHelper.getBean(CookieLocaleResolver.class);
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException,
			ServletException {
		Locale locale = this.getLocaleFromUserContext();
//		logger.debug("user locale is {}", locale);

		localeResolver.setLocale((HttpServletRequest) request, (HttpServletResponse) response, locale);

		filterChain.doFilter(request, response);
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

	@Override
	public void destroy() {
	}

}
