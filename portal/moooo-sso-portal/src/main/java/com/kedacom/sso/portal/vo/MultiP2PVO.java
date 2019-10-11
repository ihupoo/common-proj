package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;
import java.util.List;

/**
 * 
 * 并发会议统计信息
 * 返回：当前时间至历史24小时内（每隔一小时取值）并发会议统计详情，至少返回多点会议、点对点的最大并发会议数量、最小并发会议会议数量、平均并发会议数量
 * 、时间数组、每个时间点对应的会议数、时间数组及对应的会议数数据
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class MultiP2PVO {

	private BigDecimal max;
	private BigDecimal min;
	private BigDecimal average;
	private List<String> time; // 时间序列
	private List<BigDecimal> values; // 对应时间点的cpu使用率序列

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


}
