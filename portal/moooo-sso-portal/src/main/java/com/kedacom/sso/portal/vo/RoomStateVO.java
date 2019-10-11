package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.kedacom.sso.portal.util.JsonUtils;

/**
 * 
 * 
 * @author 方斌
 * @date 2018年4月28日
 */
public class RoomStateVO {
	
	private Integer roomid; 
	private String roomidstr;
	private String roomname;
	private String userdomainmoid;
	private String userdomainname;
	private Integer prgid;
	private BigDecimal elapse;
	private String lcastpoint; 
	private String livetime; 
	private String livesnapshotpath;
	private String livestreampath;
	private String mte164;
	private Integer ip;
	private String covername;
	private BigDecimal livestatnum;
	private Integer encmode;	//2-AES加密 4-国密
	private Integer authmode;	//1-普通 2-强认证
	public static List<RoomStateVO> toObject(Object[] obj) {
		List<RoomStateVO> rvs = new ArrayList<RoomStateVO>();
		for (int i = 0; i < obj.length; i++) {
			RoomStateVO rv = (RoomStateVO) JsonUtils.getDTO(obj[i],
					RoomStateVO.class);
			rvs.add(rv);
		}
		return rvs;
	}

	public Integer getRoomid() {
		return roomid;
	}

	public void setRoomid(Integer roomid) {
		this.roomid = roomid;
	}

	public String getRoomname() {
		return roomname;
	}

	public void setRoomname(String roomname) {
		this.roomname = roomname;
	}

	public String getUserdomainmoid() {
		return userdomainmoid;
	}

	public void setUserdomainmoid(String userdomainmoid) {
		this.userdomainmoid = userdomainmoid;
	}

	public String getUserdomainname() {
		return userdomainname;
	}

	public void setUserdomainname(String userdomainname) {
		this.userdomainname = userdomainname;
	}

	public Integer getPrgid() {
		return prgid;
	}

	public void setPrgid(Integer prgid) {
		this.prgid = prgid;
	}

	public BigDecimal getElapse() {
		return elapse;
	}

	public void setElapse(BigDecimal elapse) {
		this.elapse = elapse;
	}

	public String getLcastpoint() {
		return lcastpoint;
	}

	public void setLcastpoint(String lcastpoint) {
		this.lcastpoint = lcastpoint;
	}

	public String getLivetime() {
		return livetime;
	}

	public void setLivetime(String livetime) {
		this.livetime = livetime;
	}

	public String getLivestreampath() {
		return livestreampath;
	}

	public void setLivestreampath(String livestreampath) {
		this.livestreampath = livestreampath;
	}

	public String getMte164() {
		return mte164;
	}

	public void setMte164(String mte164) {
		this.mte164 = mte164;
	}

	public Integer getIp() {
		return ip;
	}

	public void setIp(Integer ip) {
		this.ip = ip;
	}

	public String getCovername() {
		return covername;
	}

	public void setCovername(String covername) {
		this.covername = covername;
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

	
	public String getLivesnapshotpath() {
		return livesnapshotpath;
	}

	
	public void setLivesnapshotpath(String livesnapshotpath) {
		this.livesnapshotpath = livesnapshotpath;
	}

	
	public String getRoomidstr() {
		return roomidstr;
	}

	
	public void setRoomidstr(String roomidstr) {
		this.roomidstr = roomidstr;
	}

	
	

}
