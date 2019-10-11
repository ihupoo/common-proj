package com.kedacom.sso.portal.vo;


/**
 * 
 * 会议并发统计
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class MeetingStatisticVO {
	private MultiP2PVO multi; // 名称
	private MultiP2PVO p2p; // moid
	public MultiP2PVO getP2p() {
		return p2p;
	}
	public void setP2p(MultiP2PVO p2p) {
		this.p2p = p2p;
	}
	public MultiP2PVO getMulti() {
		return multi;
	}
	public void setMulti(MultiP2PVO multi) {
		this.multi = multi;
	}
}
