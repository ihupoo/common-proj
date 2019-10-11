package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

/**
 * 
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class PhysicalsVO {

	private String name; // 名称
	private String moid; // moid
	private BigDecimal cpu; // cpu占用百分比
	private String type; // 设备类型
	private String ip;//设备ip地址
	private String machine_room_moid; // 机房moid
	private String machine_room_name;//机房名称
	private String frame_moid;//机框moid
	private String frame_name;//机框名称
	private String frame_type;//机框类型
	private BigDecimal memory; // 内存使用率
	private BigDecimal memtotal; // 总内存，单位KB
	private BigDecimal memused; // 已使用内存，单位KB
	private String domain_moid;//机房平台域moid
	private String online;//在线状态


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

	public BigDecimal getCpu() {
		return cpu;
	}

	public void setCpu(BigDecimal cpu) {
		this.cpu = cpu;
	}

	public BigDecimal getMemory() {
		return memory;
	}

	public void setMemory(BigDecimal memory) {
		this.memory = memory;
	}

	public BigDecimal getMemtotal() {
		return memtotal;
	}

	public void setMemtotal(BigDecimal memtotal) {
		this.memtotal = memtotal;
	}

	public BigDecimal getMemused() {
		return memused;
	}

	public void setMemused(BigDecimal memused) {
		this.memused = memused;
	}

	public String getMachine_room_moid() {
		return machine_room_moid;
	}

	public void setMachine_room_moid(String machine_room_moid) {
		this.machine_room_moid = machine_room_moid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	
	public String getIp() {
		return ip;
	}

	
	public void setIp(String ip) {
		this.ip = ip;
	}

	
	public String getMachine_room_name() {
		return machine_room_name;
	}

	
	public void setMachine_room_name(String machine_room_name) {
		this.machine_room_name = machine_room_name;
	}

	
	public String getFrame_moid() {
		return frame_moid;
	}

	
	public void setFrame_moid(String frame_moid) {
		this.frame_moid = frame_moid;
	}

	
	public String getFrame_type() {
		return frame_type;
	}

	
	public void setFrame_type(String frame_type) {
		this.frame_type = frame_type;
	}

	
	public String getFrame_name() {
		return frame_name;
	}

	
	public void setFrame_name(String frame_name) {
		this.frame_name = frame_name;
	}

	
	public String getDomain_moid() {
		return domain_moid;
	}

	
	public void setDomain_moid(String domain_moid) {
		this.domain_moid = domain_moid;
	}

	
	public String getOnline() {
		return online;
	}

	
	public void setOnline(String online) {
		this.online = online;
	}

}
