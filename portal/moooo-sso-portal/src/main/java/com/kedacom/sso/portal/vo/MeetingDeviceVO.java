package com.kedacom.sso.portal.vo;

import java.util.ArrayList;
import java.util.List;

import com.kedacom.sso.portal.util.JsonUtils;

public class MeetingDeviceVO {
	
	private String type;
	private String ip;
	private Integer mixer_count;
	private Integer abas_count;
	private Integer vbas_count;
	private Integer vmp_count;

	public static List<MeetingDeviceVO> toObject(Object[] obj) {
		List<MeetingDeviceVO> mdvs = new ArrayList<MeetingDeviceVO>();
		for (int i = 0; i < obj.length; i++) {
			MeetingDeviceVO mdv = (MeetingDeviceVO) JsonUtils.getDTO(obj[i],
					MeetingDeviceVO.class);
			mdvs.add(mdv);
		}
		return mdvs;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public Integer getMixer_count() {
		return mixer_count;
	}

	public void setMixer_count(Integer mixer_count) {
		this.mixer_count = mixer_count;
	}

	public Integer getAbas_count() {
		return abas_count;
	}

	public void setAbas_count(Integer abas_count) {
		this.abas_count = abas_count;
	}

	public Integer getVbas_count() {
		return vbas_count;
	}

	public void setVbas_count(Integer vbas_count) {
		this.vbas_count = vbas_count;
	}

	public Integer getVmp_count() {
		return vmp_count;
	}

	public void setVmp_count(Integer vmp_count) {
		this.vmp_count = vmp_count;
	}


}
