package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

/**
 * (用一句话描述类的主要功能)
 * @author wulinli
 * @date 2018年6月29日
 */

public class NmsMeetingResourceVO {

	public Integer id; // 会议室类型/规模id
	/** 名称 */
	private String name;
	/** setting表映射key */
	private String key;
	/** 方数 */
	private Integer multi;
	/** 分辨率 */
	private String resolution;
	private BigDecimal total_count; // 总数

	private BigDecimal used_count; // 已使用数



	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Integer getMulti() {
		return multi;
	}

	public void setMulti(Integer multi) {
		this.multi = multi;
	}

	public String getResolution() {
		return resolution;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution;
	}

	public BigDecimal getTotal_count() {
		return total_count;
	}

	public void setTotal_count(BigDecimal total_count) {
		this.total_count = total_count;
	}

	public BigDecimal getUsed_count() {
		return used_count;
	}

	public void setUsed_count(BigDecimal used_count) {
		this.used_count = used_count;
	}
}
