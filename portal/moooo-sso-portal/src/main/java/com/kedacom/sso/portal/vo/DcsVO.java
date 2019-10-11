package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

/**
 * @author 方斌
 * @date 2018年4月28日
 */
public class DcsVO {
	/** dcs数量统计 **/
	private BigDecimal conf_num;// 会议数
	private BigDecimal max_conf_num;// 最大会议数
	private BigDecimal mt_num;// 终端数
	private BigDecimal max_mt_num;// 最大终端数

	public BigDecimal getConf_num() {
		return conf_num;
	}

	public void setConf_num(BigDecimal conf_num) {
		this.conf_num = conf_num;
	}

	public BigDecimal getMax_conf_num() {
		return max_conf_num;
	}

	public void setMax_conf_num(BigDecimal max_conf_num) {
		this.max_conf_num = max_conf_num;
	}

	public BigDecimal getMt_num() {
		return mt_num;
	}

	public void setMt_num(BigDecimal mt_num) {
		this.mt_num = mt_num;
	}

	public BigDecimal getMax_mt_num() {
		return max_mt_num;
	}

	public void setMax_mt_num(BigDecimal max_mt_num) {
		this.max_mt_num = max_mt_num;
	}

}
