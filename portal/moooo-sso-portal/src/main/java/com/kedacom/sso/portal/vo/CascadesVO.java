package com.kedacom.sso.portal.vo;

import java.util.ArrayList;
import java.util.List;

import com.kedacom.sso.portal.util.JsonUtils;

public class CascadesVO {
	
	private String name;
	private String type;
	private String e164;

	public static List<CascadesVO> toObject(Object[] obj) {
		List<CascadesVO> cvs = new ArrayList<CascadesVO>();
		for (int i = 0; i < obj.length; i++) {
			CascadesVO cv = (CascadesVO) JsonUtils.getDTO(obj[i],
					CascadesVO.class);
			cvs.add(cv);
		}
		return cvs;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getE164() {
		return e164;
	}

	public void setE164(String e164) {
		this.e164 = e164;
	}

	
}
