package com.kedacom.sso.portal.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;



public class MyInvocationSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {

	private PathMatcher pathMatcher = new AntPathMatcher();
	private static Map<String, Collection<ConfigAttribute>> resourceMap = null;

	public MyInvocationSecurityMetadataSource() {
		super();
		loadResourceDefine();
	}

	@Override
	public Collection<ConfigAttribute> getAllConfigAttributes() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
		String url = ((FilterInvocation) object).getRequestUrl();
		for (String resUrl : resourceMap.keySet()) {
			// 注：resourceMap为LinkedHashMap，是有顺序的
			// PS：resourceMap所有的资源都是标准的url，这里不需处理，直接匹配即可
			if (pathMatcher.match(resUrl, url)) {
				return resourceMap.get(resUrl);
			}
		}

		return null;
	}

	@Override
	public boolean supports(Class<?> arg0) {
		return true;
	}

	/**
	 * 家族所有角色、菜单和URL的资源映射关系
	 */
	public void loadResourceDefine() {
		resourceMap = new LinkedHashMap<String, Collection<ConfigAttribute>>();

		// 其他权限
		Collection<ConfigAttribute> list = new ArrayList<ConfigAttribute>();
		list.add(new SecurityConfig("0"));
		resourceMap.put("/", list);
		resourceMap.put("/**", list);
	}

}
