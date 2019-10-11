package com.kedacom.sso.portal.vo;


import java.util.List;

public class NmsMeetingVO {
	private Integer id;
	
	private String name;
	private String callee_name;
	private String callee_e164;
	private String caller_name;
	private String caller_e164;
	private String confe164;
	private String start_time;
	private String end_time;
	private String organizer;
	private String subject;
	private String organizer_moid;
	private Integer regular_id;
	private Integer is_video_meeting;
	private Integer is_conflict;
	private String creator;
	private String mobile;
	private String telephone;
	private Integer meeting_type;
	private String last_modify_time;
	private String multi;
	private String format;
	private String resolution;
	private String encryption;
	private NmsMeetingResourceVO meeting_resource_vo;
	private List<NmsRoomVO> rooms; 

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStart_time() {
		return start_time;
	}

	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}

	public String getEnd_time() {
		return end_time;
	}

	public void setEnd_time(String end_time) {
		this.end_time = end_time;
	}


	
	public Integer getId() {
		return id;
	}


	
	public void setId(Integer id) {
		this.id = id;
	}


	
	public String getConfe164() {
		return confe164;
	}


	
	public void setConfe164(String confe164) {
		this.confe164 = confe164;
	}


	
	public String getOrganizer() {
		return organizer;
	}


	
	public void setOrganizer(String organizer) {
		this.organizer = organizer;
	}


	
	public String getSubject() {
		return subject;
	}


	
	public void setSubject(String subject) {
		this.subject = subject;
	}


	
	public String getOrganizer_moid() {
		return organizer_moid;
	}

	public void setOrganizer_moid(String organizer_moid) {
		this.organizer_moid = organizer_moid;
	}

	public Integer getRegular_id() {
		return regular_id;
	}
	
	public void setRegular_id(Integer regular_id) {
		this.regular_id = regular_id;
	}

	public Integer getIs_video_meeting() {
		return is_video_meeting;
	}
	
	public void setIs_video_meeting(Integer is_video_meeting) {
		this.is_video_meeting = is_video_meeting;
	}
	
	public Integer getIs_conflict() {
		return is_conflict;
	}

	public void setIs_conflict(Integer is_conflict) {
		this.is_conflict = is_conflict;
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
	
	public Integer getMeeting_type() {
		return meeting_type;
	}

	public void setMeeting_type(Integer meeting_type) {
		this.meeting_type = meeting_type;
	}
	
	public String getLast_modify_time() {
		return last_modify_time;
	}
	
	public void setLast_modify_time(String last_modify_time) {
		this.last_modify_time = last_modify_time;
	}
	
	public NmsMeetingResourceVO getMeeting_resource_vo() {
		return meeting_resource_vo;
	}

	public void setMeeting_resource_vo(NmsMeetingResourceVO meeting_resource_vo) {
		this.meeting_resource_vo = meeting_resource_vo;
	}

	public List<NmsRoomVO> getRooms() {
		return rooms;
	}

	public void setRooms(List<NmsRoomVO> rooms) {
		this.rooms = rooms;
	}

	
	public String getCallee_name() {
		return callee_name;
	}

	
	public void setCallee_name(String callee_name) {
		this.callee_name = callee_name;
	}

	
	public String getCallee_e164() {
		return callee_e164;
	}

	
	public void setCallee_e164(String callee_e164) {
		this.callee_e164 = callee_e164;
	}

	
	public String getCaller_name() {
		return caller_name;
	}

	
	public void setCaller_name(String caller_name) {
		this.caller_name = caller_name;
	}

	
	public String getCaller_e164() {
		return caller_e164;
	}

	
	public void setCaller_e164(String caller_e164) {
		this.caller_e164 = caller_e164;
	}

	
	public String getMulti() {
		return multi;
	}

	
	public void setMulti(String multi) {
		this.multi = multi;
	}

	
	public String getFormat() {
		return format;
	}

	
	public void setFormat(String format) {
		this.format = format;
	}

	
	public String getResolution() {
		return resolution;
	}

	
	public void setResolution(String resolution) {
		this.resolution = resolution;
	}

	
	public String getEncryption() {
		return encryption;
	}

	
	public void setEncryption(String encryption) {
		this.encryption = encryption;
	}

	
}
