package com.kedacom.sso.portal.vo;

/**
 * 
 * 网管告警信息
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class WarningVO {
	private String device_name; // 名称
	private String device_moid; // moid
	private String device_type; // 服务器类型
	private String device_ip; // 服务器ip
	private String machine_room_moid; // 机房moid
	private String machine_room_name; // 机房名称
	private Integer code; // 告警码
	private String start_time; // 告警产生时间
	private String title; // 描述
	private String description; // 告警描述

	public String getDevice_name() {
		return device_name;
	}
	public void setDevice_name(String device_name) {
		this.device_name = device_name;
	}
	public String getDevice_moid() {
		return device_moid;
	}
	public void setDevice_moid(String device_moid) {
		this.device_moid = device_moid;
	}
	public String getDevice_type() {
		return device_type;
	}
	public void setDevice_type(String device_type) {
		this.device_type = device_type;
	}
	public String getDevice_ip() {
		return device_ip;
	}
	public void setDevice_ip(String device_ip) {
		this.device_ip = device_ip;
	}
	public String getMachine_room_moid() {
		return machine_room_moid;
	}
	public void setMachine_room_moid(String machine_room_moid) {
		this.machine_room_moid = machine_room_moid;
	}
	public String getMachine_room_name() {
		return machine_room_name;
	}
	public void setMachine_room_name(String machine_room_name) {
		this.machine_room_name = machine_room_name;
	}
	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public String getStart_time() {
		return start_time;
	}
	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

}
