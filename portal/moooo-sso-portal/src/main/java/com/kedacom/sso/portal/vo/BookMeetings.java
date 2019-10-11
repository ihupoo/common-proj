package com.kedacom.sso.portal.vo;

import java.util.List;


public class BookMeetings {
	private Integer total;
	
	private List<BookMeetings> meetings;

	
	public Integer getTotal() {
		return total;
	}

	
	public void setTotal(Integer total) {
		this.total = total;
	}

	
	public List<BookMeetings> getMeetings() {
		return meetings;
	}

	
	public void setMeetings(List<BookMeetings> meetings) {
		this.meetings = meetings;
	}
	
	
	
}
