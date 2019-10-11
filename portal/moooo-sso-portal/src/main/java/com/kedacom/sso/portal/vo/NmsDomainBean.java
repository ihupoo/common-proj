package com.kedacom.sso.portal.vo;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 网管域信息
 * 
 * @author ranran.ye
 * @date 2018年10月18日
 */
public class NmsDomainBean {

	/** 域moid */
	private String moid;
	/** 上级域的moid */
	@JsonProperty("parent_moid")
	private String parentMoid;
	/** 域的类型：kernel(核心域), service(服务域), platform(平台域), user(用户域) */
	private String type;
	/** 域的名称 */
	private String name;

	public String getMoid() {
		return moid;
	}

	public void setMoid(String moid) {
		this.moid = moid;
	}

	public String getParentMoid() {
		return parentMoid;
	}

	public void setParentMoid(String parentMoid) {
		this.parentMoid = parentMoid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
