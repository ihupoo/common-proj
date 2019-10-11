package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;
import java.util.List;

/**
 * 
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class PhysicalVO {
	private String name; // 名称
	private String moid; // moid
	private BigDecimal cpu; // cpu占用百分比
	private BigDecimal memory; // 内存使用率
	private BigDecimal memtotal; // 总内存，单位KB
	private BigDecimal memused; // 已使用内存，单位KB
	private List<String> time; // 时间序列
	private List<BigDecimal> values; // 对应时间点的cpu使用率序列
	private String type;//设备类型;
	private String ip;//设备ip地址
	private String machine_room_moid;//机房moid
	private String machine_room_name;//机房名称
	private String frame_moid;//机框moid
	private String frame_type;//机框类型

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

	public List<String> getTime() {
		return time;
	}

	public void setTime(List<String> time) {
		this.time = time;
	}

	public List<BigDecimal> getValues() {
		return values;
	}

	public void setValues(List<BigDecimal> values) {
		this.values = values;
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


}
