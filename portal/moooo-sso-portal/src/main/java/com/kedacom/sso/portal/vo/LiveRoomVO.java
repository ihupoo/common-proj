package com.kedacom.sso.portal.vo;

import java.text.ParseException;
import java.util.Date;

import com.kedacom.sdk.meeting.cxf.model.CXFLiveRoom;
import com.kedacom.sso.portal.util.TimeUtil;

public class LiveRoomVO {
    private String name;
    private String liveStartTime;
    private String liveStopTime;
    private Integer state;
    private String liveUrl;
    
    public LiveRoomVO(){};
	
	public LiveRoomVO(String name, String liveStartTime,String liveStopTime,String liveUrl,Integer state) {
		this.name = name;
		this.liveStartTime = liveStartTime;
		this.liveStopTime = liveStopTime;
		this.liveUrl = liveUrl;
		this.state = state;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLiveStartTime() {
		return liveStartTime;
	}
	public void setLiveStartTime(String liveStartTime) {
		this.liveStartTime = liveStartTime;
	}
	public String getLiveStopTime() {
		return liveStopTime;
	}
	public void setLiveStopTime(String liveStopTime) {
		this.liveStopTime = liveStopTime;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public String getLiveUrl() {
		return liveUrl;
	}
	public void setLiveUrl(String liveUrl) {
		this.liveUrl = liveUrl;
	} 
	
	public static LiveRoomVO toLiveRoomVO(CXFLiveRoom cxfLiveRoom) throws ParseException{
		LiveRoomVO liveRoomVO = new LiveRoomVO();
		liveRoomVO.setLiveStartTime(cxfLiveRoom.getLiveStartTime());
		Date startTime = TimeUtil.string2DateTime(cxfLiveRoom.getLiveStartTime(),null);
		liveRoomVO.setLiveStopTime(cxfLiveRoom.getLiveStopTime());
		liveRoomVO.setLiveUrl(cxfLiveRoom.getLiveUrl());
		liveRoomVO.setName(cxfLiveRoom.getName());
		if(cxfLiveRoom.getState()==2 && System.currentTimeMillis() < startTime.getTime()){
			liveRoomVO.setState(8);
		}else{
			liveRoomVO.setState(cxfLiveRoom.getState());
		}
		return liveRoomVO;
	}

	@Override
	public String toString() {
		return "LiveRoomVO [name=" + name + ", liveStartTime=" + liveStartTime+",liveStopTime="+liveStopTime
				+ ", state=" + state + ", liveUrl=" + liveUrl + "]";
	}
	
    
}
