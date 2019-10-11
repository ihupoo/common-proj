package com.kedacom.sso.portal.vo;

/**
 * 网管服务器
 * 
 * @author ranran.ye
 * @date 2018年10月18日
 */
public class NmsServerBean {

	/** 物理服务器名称 */
	private String name;

	/** 物理服务器的moid */
	private String moid;

	/** 平台域moid */
	private String domainMoid;

	/** 机房moid */
	private String machineRoomMoid;

	/** 在线状态, online/offline */
	private String online;

	/** 设备类型 */
	private String type;

	/** 服务域moid */
	private String serviceDomainMoid;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMoid() {
		return moid;
	}

	public void setMoid(String moid) {
		this.moid = moid;
	}

	public String getDomainMoid() {
		return domainMoid;
	}

	public void setDomainMoid(String domainMoid) {
		this.domainMoid = domainMoid;
	}

	public String getMachineRoomMoid() {
		return machineRoomMoid;
	}

	public void setMachineRoomMoid(String machineRoomMoid) {
		this.machineRoomMoid = machineRoomMoid;
	}

	public String getOnline() {
		return online;
	}

	public void setOnline(String online) {
		this.online = online;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getServiceDomainMoid() {
		return serviceDomainMoid;
	}

	public void setServiceDomainMoid(String serviceDomainMoid) {
		this.serviceDomainMoid = serviceDomainMoid;
	}

}
