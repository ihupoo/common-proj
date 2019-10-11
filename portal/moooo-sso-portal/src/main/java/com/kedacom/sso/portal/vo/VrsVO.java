package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

/**
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class VrsVO {
	/** vrs资源,录像室资源 **/
	private BigDecimal recroomocp;
	private BigDecimal recroomtotal;
	/** asf直播资源 **/
	private BigDecimal lcastocp;
	private BigDecimal lcasttotal;
	/** html5直播资源 **/
	private BigDecimal html5lcastocp;
	private BigDecimal html5lcasttotal;

	public BigDecimal getRecroomocp() {
		return recroomocp;
	}

	public void setRecroomocp(BigDecimal recroomocp) {
		this.recroomocp = recroomocp;
	}

	public BigDecimal getRecroomtotal() {
		return recroomtotal;
	}

	public void setRecroomtotal(BigDecimal recroomtotal) {
		this.recroomtotal = recroomtotal;
	}

	public BigDecimal getLcastocp() {
		return lcastocp;
	}

	public void setLcastocp(BigDecimal lcastocp) {
		this.lcastocp = lcastocp;
	}

	public BigDecimal getLcasttotal() {
		return lcasttotal;
	}

	public void setLcasttotal(BigDecimal lcasttotal) {
		this.lcasttotal = lcasttotal;
	}

	public BigDecimal getHtml5lcastocp() {
		return html5lcastocp;
	}

	public void setHtml5lcastocp(BigDecimal html5lcastocp) {
		this.html5lcastocp = html5lcastocp;
	}

	public BigDecimal getHtml5lcasttotal() {
		return html5lcasttotal;
	}

	public void setHtml5lcasttotal(BigDecimal html5lcasttotal) {
		this.html5lcasttotal = html5lcasttotal;
	}

}
