package com.kedacom.sso.portal.vo;


import java.util.ArrayList;
import java.util.List;
import com.kedacom.sso.portal.util.JsonUtils;


public class MeetingTerminalsVO {
	
	private String domain_moid;
	private String name;
	private String version;
	private String type;
	private String moid;
	private String e164;
	private String ip;

	public static List<MeetingTerminalsVO> toObject(Object[] obj) {
		List<MeetingTerminalsVO> mtvs = new ArrayList<MeetingTerminalsVO>();
		for (int i = 0; i < obj.length; i++) {
			MeetingTerminalsVO mtv = (MeetingTerminalsVO) JsonUtils.getDTO(
					obj[i], MeetingTerminalsVO.class);
			mtvs.add(mtv);
		}
		return mtvs;
	}

	public String getDomain_moid() {
		return domain_moid;
	}

	public void setDomain_moid(String domain_moid) {
		this.domain_moid = domain_moid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMoid() {
		return moid;
	}

	public void setMoid(String moid) {
		this.moid = moid;
	}

	public String getE164() {
		return e164;
	}

	public void setE164(String e164) {
		this.e164 = e164;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}


	
	
	
}
