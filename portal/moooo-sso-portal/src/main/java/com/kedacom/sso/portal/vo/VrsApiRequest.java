package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;
import java.util.List;
import com.kedacom.sso.portal.util.JsonUtils;

/**
 * 
 * VrsApiRequest
 * 
 * @author 方斌
 * @date 2018年1月8日
 */
public class VrsApiRequest {
	private String success;
	private String error_code;
	private BigDecimal roomcount;
	private Integer pageid;
	private List<RoomStateVO> roomstate;
	private BigDecimal livecount;
	private List<LiveInfoVO> liveinfo;


	public static VrsApiRequest toObject(String ar) {
		VrsApiRequest request = (VrsApiRequest) JsonUtils.getDTO(ar,
				VrsApiRequest.class);
		if (request.getRoomstate() != null && request.getRoomstate().size() > 0) {
			List<RoomStateVO> rvs = RoomStateVO.toObject(request.getRoomstate()
					.toArray());
			request.setRoomstate(rvs);

		}
		if (request.getLiveinfo() != null && request.getLiveinfo().size() > 0) {
			List<LiveInfoVO> rvs = LiveInfoVO.toObject(request.getLiveinfo()
					.toArray());
			request.setLiveinfo(rvs);
		}
		return request;
	}


	public String getSuccess() {
		return success;
	}


	public void setSuccess(String success) {
		this.success = success;
	}


	public String getError_code() {
		return error_code;
	}


	public void setError_code(String error_code) {
		this.error_code = error_code;
	}

	public BigDecimal getRoomcount() {
		return roomcount;
	}

	public void setRoomcount(BigDecimal roomcount) {
		this.roomcount = roomcount;
	}


	public Integer getPageid() {
		return pageid;
	}


	public void setPageid(Integer pageid) {
		this.pageid = pageid;
	}


	public List<RoomStateVO> getRoomstate() {
		return roomstate;
	}


	public void setRoomstate(List<RoomStateVO> roomstate) {
		this.roomstate = roomstate;
	}

	public BigDecimal getLivecount() {
		return livecount;
	}

	public void setLivecount(BigDecimal livecount) {
		this.livecount = livecount;
	}


	public List<LiveInfoVO> getLiveinfo() {
		return liveinfo;
	}


	public void setLiveinfo(List<LiveInfoVO> liveinfo) {
		this.liveinfo = liveinfo;
	}



}
