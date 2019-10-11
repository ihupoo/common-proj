package com.kedacom.sso.portal.aop.interceptor;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;

import ognl.Ognl;
import ognl.OgnlException;

import org.apache.commons.lang.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.kedacom.moooo.cache.CacheRedisUtils;
import com.kedacom.moooo.cache.util.AsmMethodParamNamesScaner;
import com.kedacom.moooo.cipher.SMUtils;
import com.kedacom.moooo.core.dao.BaseRedisDao;
import com.kedacom.moooo.core.utils.DateUtils;
import com.kedacom.moooo.core.utils.JacksonUtils;
import com.kedacom.sso.portal.aop.annotation.LoadFromRedis;

@Component
@Aspect
public class PortalCachesInterceptor {

	private static final String LOAD_FROM_REDIS = "@annotation(com.kedacom.sso.portal.aop.annotation.LoadFromRedis)";

	private static final String MOID_OGNL = "${moid}";

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Resource
	private BaseRedisDao<String, String, Object, Object, Object, Object> baseRedisDao;

	/**
	 * 首先从缓存中加载数据，缓存命中则返回数据，并加入缓存
	 */
	@Around(LOAD_FROM_REDIS)
	public Object get(ProceedingJoinPoint call) throws Throwable {
		MethodSignature joinPointObject = (MethodSignature) call.getSignature();
		Method realMethod = call.getTarget().getClass()
				.getDeclaredMethod(joinPointObject.getName(), joinPointObject.getParameterTypes());
		LoadFromRedis annotation = realMethod.getAnnotation(LoadFromRedis.class);
		String prefix = annotation.prefix();
		String keyName = annotation.key();
		boolean smFlag = true;
		if (MOID_OGNL.equals(keyName)) {
			smFlag = false;
		}
		Long timeout = annotation.timeout();
		String key = executeOgnls(keyName, call, realMethod, timeout);
		String cacheKey = prefix + (smFlag ? SMUtils.sm3Hex(key) : key);
		Object value = CacheRedisUtils.get(cacheKey);
		if (value == null) {
			value = call.proceed();
			if (null != value) {
				if (timeout > 0) {
					CacheRedisUtils.cache(cacheKey, timeout.intValue(), JacksonUtils.getJsonConvertWithoutNull()
							.toJsonString(value));
				} else {
					CacheRedisUtils
							.cacheForever(cacheKey, JacksonUtils.getJsonConvertWithoutNull().toJsonString(value));
				}
				logger.debug("Cache.set('{}', {}, {}, {});", prefix, key, value, timeout);
			}
		} else {
			logger.debug("Cache.get('{}', {}) = {}", prefix, key, value);
			try {
				value = JacksonUtils.getJsonConvertWithoutNull().fromJsonString(value.toString(),
						realMethod.getReturnType());
			} catch (Exception e) {
				logger.error("json转换异常", e);
				value = call.proceed();
			}
		}
		return value;
	}

	private <R> String executeOgnls(String key, ProceedingJoinPoint call, Method method, Long timeout)
			throws OgnlException {
		String value = key;

		if (!key.contains("$")) {
			return key;
		}

		String regexp = "\\$\\{[^\\}]+\\}";
		Pattern pattern = Pattern.compile(regexp);
		Matcher matcher = pattern.matcher(key);
		List<String> ognls = new ArrayList<String>();
		while (matcher.find()) {
			ognls.add(matcher.group());
		}

		if (CollectionUtils.isEmpty(ognls)) {
			return value;
		}

		logger.debug("Method name is {}", method.getName());

		// http://www.tuicool.com/articles/iUfMBr
		// 形参列表
		String[] paramNames = AsmMethodParamNamesScaner.getMethodParamNames(method);
		logger.debug("MethodParamNamesScaner.getParamNames is {}", (Object) paramNames);

		// 参数值
		Object[] paramValues = call.getArgs();

		// 形参与参数值对照Map
		Map<String, Object> paramMap = new HashMap<String, Object>();
		for (int i = 0; i < paramNames.length; i++) {
			paramMap.put(paramNames[i], paramValues[i]);
		}

		// 执行ognl
		for (String ognl : ognls) {
			String temp = ognl.substring(2);
			temp = temp.substring(0, temp.length() - 1);
			Object ognlValue = dataDealWith(ognl, Ognl.getValue(temp, paramMap), timeout);
			value = replace(value, ognl, ognlValue == null ? "" : ognlValue.toString());
		}

		// 返回ognl执行结果
		return value;
	}

	private static String[] timeFields = new String[] {
			"startTime", "endTime", "start_time", "end_time", "dateTime"
	};
	private static final String OGNL_PRX = "${";
	private static final String OGNL_SUFFX = "}";

	private boolean checkTimeField(String ognl) {
		if (null != timeFields && timeFields.length > 0) {
			for (int i = 0; i < timeFields.length; i++) {
				String field = timeFields[i];
				if (StringUtils.isNotBlank(field) && (OGNL_PRX + field + OGNL_SUFFX).equals(ognl)) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 数据处理
	 */
	private Object dataDealWith(String ognl, Object ognlValue, Long timeout) {
		try {
			if (null == ognlValue || StringUtils.isBlank(ognlValue.toString())) {
				return ognlValue;
			}
			if (checkTimeField(ognl)) {
				String datetimeString = ognlValue.toString();
				Date date = null;
				if ((ognlValue instanceof Date)) {
					date = (Date) ognlValue;
				} else {
					date = DateUtils.fromDatetimeString(datetimeString);
				}
				if (null != date) {
					Calendar cal = Calendar.getInstance();
					cal.setTime(date);
					int seconds = cal.get(Calendar.SECOND);
					int unitTime = timeout.intValue();
					cal.set(Calendar.SECOND, (seconds / unitTime * unitTime));
					date = cal.getTime();
					datetimeString = DateUtils.toDatetimeString(date);
					if (StringUtils.isNotBlank(datetimeString) && datetimeString.indexOf(" ") != -1) {
						try {
							ognlValue = URLEncoder.encode(datetimeString, "UTF-8");
						} catch (UnsupportedEncodingException e) {
							logger.error(e.getMessage());
						}
					}
				}
			}
		} catch (Exception e) {
			logger.debug("el数据处理异常", e);
		}
		return ognlValue;
	}

	/*
	 * 不依赖Regex的替换，避免$符号、{}等在String.replaceAll方法中当做Regex处理时候的问题。
	 */
	private static String replace(String src, String from, String to) {
		int index = src.indexOf(from);
		if (index == -1) {
			return src;
		}
		return src.substring(0, index) + to + src.substring(index + from.length());
	}
}
