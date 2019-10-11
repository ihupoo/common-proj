package com.kedacom.sso.portal.vo;


import java.util.List;
import java.text.ParseException;
import java.util.Date;

import com.kedacom.sdk.meeting.cxf.model.CXFMeeting;
import com.kedacom.sdk.meeting.cxf.model.CXFRoom;
import com.kedacom.sso.portal.util.TimeUtil;

public class MeetingVO {
	
	private String name;
	private String meetingTime;
	private Integer state;			//2-进行中 8-准点
	private Boolean isConflict;
	private String creator;
	private String mobile;// 座机
	private String telephone;// 手机
	private List<CXFRoom> rooms;//实体会议室
    

	public List<CXFRoom> getRooms() {
		return rooms;
	}

	public void setRooms(List<CXFRoom> rooms) {
		this.rooms = rooms;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public MeetingVO(){};
	
	public MeetingVO(String name, String meetingTime, Integer state,Boolean isConflict,String creator,String mobile,String telephone,List<CXFRoom> rooms) {
		this.name = name;
		this.meetingTime = meetingTime;
		this.state = state;
		this.isConflict = isConflict;
		this.creator = creator;
		this.mobile  = mobile;
		this.telephone = telephone;
		this.rooms = rooms;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMeetingTime() {
		return meetingTime;
	}
	public void setMeetingTime(String meetingTime) {
		this.meetingTime = meetingTime;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public Boolean getIsConflict() {
		return isConflict;
	}

	public void setIsConflict(Boolean isConflict) {
		this.isConflict = isConflict;
	}

	public static MeetingVO toMeetingVO(CXFMeeting cxfMeeting) throws ParseException{
		MeetingVO meetingVO = new MeetingVO();
		meetingVO.setName(cxfMeeting.getSubject());
		meetingVO.setCreator(cxfMeeting.getCreator());
		meetingVO.setMobile(cxfMeeting.getMobile());
		meetingVO.setTelephone(cxfMeeting.getTelephone());
		meetingVO.setMeetingTime(cxfMeeting.getStartTime().substring(0,16));
		meetingVO.setIsConflict(cxfMeeting.getIsConflict());
		Date startTime = TimeUtil.string2DateTime(cxfMeeting.getStartTime(), null);
		if(cxfMeeting.getStatus()==2 && System.currentTimeMillis() < startTime.getTime()){
			meetingVO.setState(8);
		}else{
			meetingVO.setState(cxfMeeting.getStatus());
		}
			meetingVO.setRooms(cxfMeeting.getRooms());
		return meetingVO;
	}
	
}
