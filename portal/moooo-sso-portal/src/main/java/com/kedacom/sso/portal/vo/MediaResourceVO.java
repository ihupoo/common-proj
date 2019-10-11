package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 会议媒体资源使用情况VO
 *
 * @author 李弘光
 */
public class MediaResourceVO {

	private BigDecimal used; //召开数
	private BigDecimal other; //其他类型会议占用数
	private BigDecimal remainder; //预计可召开数
	private BigDecimal total; //总共可召开数
	@JsonProperty("tra_used")
	private BigDecimal traUsed; // 本用户域传统挤占的端口占用数
	@JsonProperty("port_used")
	private BigDecimal portUsed; // 本用户域端口转换的传统占用数

	public BigDecimal getUsed() {
		return used;
	}

	public void setUsed(BigDecimal used) {
		this.used = used;
	}

	public BigDecimal getOther() {
		return other;
	}

	public void setOther(BigDecimal other) {
		this.other = other;
	}

	public BigDecimal getRemainder() {
		return remainder;
	}

	public void setRemainder(BigDecimal remainder) {
		this.remainder = remainder;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public BigDecimal getTraUsed() {
		return traUsed;
	}

	public void setTraUsed(BigDecimal traUsed) {
		this.traUsed = traUsed;
	}

	public BigDecimal getPortUsed() {
		return portUsed;
	}

	public void setPortUsed(BigDecimal portUsed) {
		this.portUsed = portUsed;
	}

}
