package com.kedacom.sso.portal.vo;

/**
 * 获取资源 返回虚拟会议资源使用情况、会议并发接入终端数、媒体终端授权数、画面合成数，虚拟会议室等使用情况
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class ResourceVO {
	private AccessVO access;
	private MediaVO media;
	private VrsVO vrs;
	private DcsVO dcs;
	private VmrVO vmr;
	private MediaResourceVO tra_meeting;
	private MediaResourceVO port_meeting;

	public AccessVO getAccess() {
		return access;
	}

	public void setAccess(AccessVO access) {
		this.access = access;
	}

	public MediaVO getMedia() {
		return media;
	}

	public void setMedia(MediaVO media) {
		this.media = media;
	}

	public VrsVO getVrs() {
		return vrs;
	}

	public void setVrs(VrsVO vrs) {
		this.vrs = vrs;
	}

	public DcsVO getDcs() {
		return dcs;
	}

	public void setDcs(DcsVO dcs) {
		this.dcs = dcs;
	}

	public VmrVO getVmr() {
		return vmr;
	}

	public void setVmr(VmrVO vmr) {
		this.vmr = vmr;
	}

	public MediaResourceVO getTra_meeting() {
		return tra_meeting;
	}

	public void setTra_meeting(MediaResourceVO tra_meeting) {
		this.tra_meeting = tra_meeting;
	}

	public MediaResourceVO getPort_meeting() {
		return port_meeting;
	}

	public void setPort_meeting(MediaResourceVO port_meeting) {
		this.port_meeting = port_meeting;
	}
}
