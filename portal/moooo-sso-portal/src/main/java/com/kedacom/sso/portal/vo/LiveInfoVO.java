package com.kedacom.sso.portal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.kedacom.sso.portal.util.JsonUtils;

/**
 * 
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class LiveInfoVO {
	
	private String confname;
	private String starttime;
	private Integer encmode;	//2-AES加密 4-国密
	
	public static List<LiveInfoVO> toObject(Object[] obj) {
		List<LiveInfoVO> rvs = new ArrayList<LiveInfoVO>();
		for (int i = 0; i < obj.length; i++) {
			LiveInfoVO rv = (LiveInfoVO) JsonUtils.getDTO(obj[i],
					LiveInfoVO.class);
			rvs.add(rv);
		}
		return rvs;
	}

	public String getConfname() {
		return confname;
	}

	public void setConfname(String confname) {
		this.confname = confname;
	}

	public String getStarttime() {
		return starttime;
	}

	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}

	public Integer getEncmode() {
		return encmode;
	}

	public void setEncmode(Integer encmode) {
		this.encmode = encmode;
	}

}
