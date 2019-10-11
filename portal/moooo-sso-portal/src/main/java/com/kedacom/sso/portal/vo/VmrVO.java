package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

/**
 * @author 方斌
 * @date 2018年4月28日
 */
public class VmrVO {
	private Integer env_type;  //为1，说明是jd_mcu环境，只分大小虚拟会议室
	/** 虚拟会议室资源-大小型会议资源 **/
	private BigDecimal used_large;
	private BigDecimal total_large;
	private BigDecimal used_small;
	private BigDecimal total_small;
	/** 虚拟会议室资源-八方会议资源 **/
	private BigDecimal used_192_1080;
	private BigDecimal total_192_1080;
	private BigDecimal used_192_720;
	private BigDecimal total_192_720;
	private BigDecimal used_64_1080;
	private BigDecimal total_64_1080;
	private BigDecimal used_64_720;
	private BigDecimal total_64_720;
	private BigDecimal used_32_1080;
	private BigDecimal total_32_1080;
	private BigDecimal used_32_720;
	private BigDecimal total_32_720;
	private BigDecimal used_8_1080;
	private BigDecimal total_8_1080;
	private BigDecimal used_8_720;
	private BigDecimal total_8_720;

	public BigDecimal getUsed_192_1080() {
		return used_192_1080;
	}

	public void setUsed_192_1080(BigDecimal used_192_1080) {
		this.used_192_1080 = used_192_1080;
	}

	public BigDecimal getTotal_192_1080() {
		return total_192_1080;
	}

	public void setTotal_192_1080(BigDecimal total_192_1080) {
		this.total_192_1080 = total_192_1080;
	}

	public BigDecimal getUsed_192_720() {
		return used_192_720;
	}

	public void setUsed_192_720(BigDecimal used_192_720) {
		this.used_192_720 = used_192_720;
	}

	public BigDecimal getTotal_192_720() {
		return total_192_720;
	}

	public void setTotal_192_720(BigDecimal total_192_720) {
		this.total_192_720 = total_192_720;
	}

	public BigDecimal getUsed_64_1080() {
		return used_64_1080;
	}

	public void setUsed_64_1080(BigDecimal used_64_1080) {
		this.used_64_1080 = used_64_1080;
	}

	public BigDecimal getTotal_64_1080() {
		return total_64_1080;
	}

	public void setTotal_64_1080(BigDecimal total_64_1080) {
		this.total_64_1080 = total_64_1080;
	}

	public BigDecimal getUsed_64_720() {
		return used_64_720;
	}

	public void setUsed_64_720(BigDecimal used_64_720) {
		this.used_64_720 = used_64_720;
	}

	public BigDecimal getTotal_64_720() {
		return total_64_720;
	}

	public void setTotal_64_720(BigDecimal total_64_720) {
		this.total_64_720 = total_64_720;
	}

	public BigDecimal getUsed_32_1080() {
		return used_32_1080;
	}

	public void setUsed_32_1080(BigDecimal used_32_1080) {
		this.used_32_1080 = used_32_1080;
	}

	public BigDecimal getTotal_32_1080() {
		return total_32_1080;
	}

	public void setTotal_32_1080(BigDecimal total_32_1080) {
		this.total_32_1080 = total_32_1080;
	}

	public BigDecimal getUsed_32_720() {
		return used_32_720;
	}

	public void setUsed_32_720(BigDecimal used_32_720) {
		this.used_32_720 = used_32_720;
	}

	public BigDecimal getTotal_32_720() {
		return total_32_720;
	}

	public void setTotal_32_720(BigDecimal total_32_720) {
		this.total_32_720 = total_32_720;
	}

	public BigDecimal getUsed_8_1080() {
		return used_8_1080;
	}

	public void setUsed_8_1080(BigDecimal used_8_1080) {
		this.used_8_1080 = used_8_1080;
	}

	public BigDecimal getTotal_8_1080() {
		return total_8_1080;
	}

	public void setTotal_8_1080(BigDecimal total_8_1080) {
		this.total_8_1080 = total_8_1080;
	}

	public BigDecimal getUsed_8_720() {
		return used_8_720;
	}

	public void setUsed_8_720(BigDecimal used_8_720) {
		this.used_8_720 = used_8_720;
	}

	public BigDecimal getTotal_8_720() {
		return total_8_720;
	}

	public void setTotal_8_720(BigDecimal total_8_720) {
		this.total_8_720 = total_8_720;
	}
	
	public Integer getEnv_type() {
		return env_type;
	}
	
	public void setEnv_type(Integer env_type) {
		this.env_type = env_type;
	}

	public BigDecimal getUsed_large() {
		return used_large;
	}

	public void setUsed_large(BigDecimal used_large) {
		this.used_large = used_large;
	}

	public BigDecimal getTotal_large() {
		return total_large;
	}

	public void setTotal_large(BigDecimal total_large) {
		this.total_large = total_large;
	}

	public BigDecimal getUsed_small() {
		return used_small;
	}

	public void setUsed_small(BigDecimal used_small) {
		this.used_small = used_small;
	}

	public BigDecimal getTotal_small() {
		return total_small;
	}

	public void setTotal_small(BigDecimal total_small) {
		this.total_small = total_small;
	}


}
