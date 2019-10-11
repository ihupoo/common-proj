package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

/**
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class AccessVO {
	/** 接入端口数 **/
	private BigDecimal ap_used;
	private BigDecimal g_ap_used;
	private BigDecimal ap_total;
	private BigDecimal g_ap_total;

	public BigDecimal getAp_used() {
		return ap_used;
	}

	public void setAp_used(BigDecimal ap_used) {
		this.ap_used = ap_used;
	}

	public BigDecimal getAp_total() {
		return ap_total;
	}

	public void setAp_total(BigDecimal ap_total) {
		this.ap_total = ap_total;
	}

	public BigDecimal getG_ap_used() {
		return g_ap_used;
	}

	public void setG_ap_used(BigDecimal g_ap_used) {
		this.g_ap_used = g_ap_used;
	}

	public BigDecimal getG_ap_total() {
		return g_ap_total;
	}

	public void setG_ap_total(BigDecimal g_ap_total) {
		this.g_ap_total = g_ap_total;
	}

}
