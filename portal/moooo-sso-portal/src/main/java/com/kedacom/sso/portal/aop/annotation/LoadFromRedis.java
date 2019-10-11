package com.kedacom.sso.portal.aop.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 业务数据缓存
 * 
 * @author ranran.ye
 * @date 2018年9月5日
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface LoadFromRedis {

	String prefix(); // 缓存key的前缀

	String key(); // 缓存的key，可以是多个字段拼合的key

	long timeout() default 20; // 缓存秒
}
