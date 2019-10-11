package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;

public class NmsRoomStateVO {
	private String live_name; //直播名
	private String domain_moid; //直播所属用户域moid
	private String domain_name; //直播所属用户域名称
	private String confe164; //会议e164号
	private String start_time; //直播开始时间
	private BigDecimal elapse; //直播持续时长 ，秒
	private BigDecimal livestatnum; //直播统计观看人数
	private Integer encmode;	//2-AES加密 4-国密
	private Integer authmode;	//1-普通 2-强认证
	
	public String getLive_name() {
		return live_name;
	}
	
	public void setLive_name(String live_name) {
		this.live_name = live_name;
	}

	public String getDomain_moid() {
		return domain_moid;
	}

	public void setDomain_moid(String domain_moid) {
		this.domain_moid = domain_moid;
	}

	public String getDomain_name() {
		return domain_name;
	}

	public void setDomain_name(String domain_name) {
		this.domain_name = domain_name;
	}

	public String getConfe164() {
		return confe164;
	}
	
	public void setConfe164(String confe164) {
		this.confe164 = confe164;
	}
	
	public String getStart_time() {
		return start_time;
	}
	
	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}

	public BigDecimal getElapse() {
		return elapse;
	}

	public void setElapse(BigDecimal elapse) {
		this.elapse = elapse;
	}

	public BigDecimal getLivestatnum() {
		return livestatnum;
	}

	public void setLivestatnum(BigDecimal livestatnum) {
		this.livestatnum = livestatnum;
	}
	
	public Integer getEncmode() {
		return encmode;
	}
	
	public void setEncmode(Integer encmode) {
		this.encmode = encmode;
	}
	
	public Integer getAuthmode() {
		return authmode;
	}
	
	public void setAuthmode(Integer authmode) {
		this.authmode = authmode;
	}

}
