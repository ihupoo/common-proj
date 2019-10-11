package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

/**
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class MediaVO {
	/** h264媒体端口 **/
	private BigDecimal used_h264;
	private BigDecimal total_h264;
	/** h265媒体端口 **/
	private BigDecimal used_h265;
	private BigDecimal total_h265;

	public BigDecimal getUsed_h264() {
		return used_h264;
	}

	public void setUsed_h264(BigDecimal used_h264) {
		this.used_h264 = used_h264;
	}

	public BigDecimal getTotal_h264() {
		return total_h264;
	}

	public void setTotal_h264(BigDecimal total_h264) {
		this.total_h264 = total_h264;
	}

	public BigDecimal getUsed_h265() {
		return used_h265;
	}

	public void setUsed_h265(BigDecimal used_h265) {
		this.used_h265 = used_h265;
	}

	public BigDecimal getTotal_h265() {
		return total_h265;
	}

	public void setTotal_h265(BigDecimal total_h265) {
		this.total_h265 = total_h265;
	}

}
