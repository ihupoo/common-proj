package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;
import java.util.List;

/**
 * 
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class StatisticVO {

	private BigDecimal max;
	private BigDecimal min;
	private BigDecimal average; // 内存使用率
	private List<String> time; // 时间序列
	private List<BigDecimal> values; // 对应时间点的cpu使用率序列
	private MultiP2PVO multi;
	private MultiP2PVO p2p;
	private MultiP2PVO sip;
	private MultiP2PVO h323;
	private MultiP2PVO all;

	public BigDecimal getMax() {
		return max;
	}

	public void setMax(BigDecimal max) {
		this.max = max;
	}

	public BigDecimal getMin() {
		return min;
	}

	public void setMin(BigDecimal min) {
		this.min = min;
	}

	public BigDecimal getAverage() {
		return average;
	}

	public void setAverage(BigDecimal average) {
		this.average = average;
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

	public MultiP2PVO getMulti() {
		return multi;
	}

	public void setMulti(MultiP2PVO multi) {
		this.multi = multi;
	}

	public MultiP2PVO getP2p() {
		return p2p;
	}

	public void setP2p(MultiP2PVO p2p) {
		this.p2p = p2p;
	}

	
	public MultiP2PVO getSip() {
		return sip;
	}

	
	public void setSip(MultiP2PVO sip) {
		this.sip = sip;
	}

	
	public MultiP2PVO getH323() {
		return h323;
	}

	
	public void setH323(MultiP2PVO h323) {
		this.h323 = h323;
	}

	
	public MultiP2PVO getAll() {
		return all;
	}

	
	public void setAll(MultiP2PVO all) {
		this.all = all;
	}
	

}
