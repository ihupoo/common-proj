package com.kedacom.sso.portal.vo;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.kedacom.moooo.core.utils.JacksonUtils;
import com.kedacom.movision.base.constant.Constants;
import com.kedacom.sdk.meeting.cxf.model.CXFMeeting;
import com.kedacom.sdk.meeting.cxf.model.CXFMeetings;
import com.kedacom.sdk.meeting.cxf.model.CXFRoom;
import com.kedacom.sdk.meeting.cxf.model.MeetingResourceVO;

/**
 * NmsApiRequest
 * @author 方斌
 * @date 2018年1月8日
 */
public class NmsApiRequest {

	private String success;
	private String error_code;
	/** 获取资源详情 **/
	private ResourceVO resource;
	/** 告警信息详情 **/
	private List<WarningVO> unrepaired_warnings;
	/** 获取CPU、内存使用率前五的服务器 **/
	private List<PhysicalsVO> physicals;
	/** 获取服务器CPU、内存历史 **/
	private PhysicalVO physical;
	/** 并发会议统计数据,并发会议在线终端统计,在线终端统计信息 ,预约会议并发统计 **/
	private StatisticVO statistic;
	private BigDecimal total_count;
	/** 获取服务域的预约会议列表 **/
	private BigDecimal total;
	private List<NmsMeetingVO> meetings;
	/** 请求服务域或用户域所属直播列表 **/
	private List<NmsRoomStateVO> live;
	/**
	 * 请求服务域或用户域所属预约直播列表
	 */
	private List<NmsRoomStateVO> aplive;
	/** 域信息 */
	private List<NmsDomainBean> domains;

	public static NmsApiRequest toObject(String ar) {
		return JacksonUtils.getJsonConvertWithoutNull().fromJsonString(ar, NmsApiRequest.class);
	}
	public static CXFMeetings callTranMeetingToCxfMeeting(NmsApiRequest nmsApiRequest) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		List<NmsMeetingVO> meetings = nmsApiRequest.getMeetings();
		List<CXFMeeting> cxfMeetingList = new ArrayList<CXFMeeting>();
		MeetingResourceVO meetingResourceVO = new MeetingResourceVO();
		if(null!=meetings){
			for(NmsMeetingVO meeting : meetings){
				CXFMeeting cxfMeeting = new CXFMeeting();
				cxfMeeting.setSubject(meeting.getName());
				cxfMeeting.setCreator(meeting.getOrganizer());
				cxfMeeting.setEndTime(meeting.getEnd_time());
				cxfMeeting.setIsVideoMeeting(new Integer(1));
				meetingResourceVO.setMulti(Integer.parseInt(meeting.getMulti()));
				meetingResourceVO.setResolution(meeting.getResolution());
				cxfMeeting.setMeetingResourceVO(meetingResourceVO);
				cxfMeeting.setStartTime(meeting.getStart_time());
				cxfMeetingList.add(cxfMeeting);
			}
		}
		cxfMeetings.setTotal(null == meetings ? 0 : meetings.size());
		cxfMeetings.setMeetings(cxfMeetingList);
		return cxfMeetings;
	}
	public static CXFMeetings callPortMeetingToCxfMeeting(NmsApiRequest nmsApiRequest) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		List<NmsMeetingVO> meetings = nmsApiRequest.getMeetings();
		List<CXFMeeting> cxfMeetingList = new ArrayList<CXFMeeting>();
		MeetingResourceVO meetingResourceVO = new MeetingResourceVO();
		if(null!=meetings){
			for(NmsMeetingVO meeting : meetings){
				CXFMeeting cxfMeeting = new CXFMeeting();
				cxfMeeting.setSubject(meeting.getName());
				cxfMeeting.setCreator(meeting.getOrganizer());
				cxfMeeting.setEndTime(meeting.getEnd_time());
				cxfMeeting.setIsVideoMeeting(new Integer(1));
				meetingResourceVO.setMulti(Integer.parseInt(meeting.getMulti()));
				meetingResourceVO.setResolution(meeting.getResolution());
				cxfMeeting.setMeetingResourceVO(meetingResourceVO);
				cxfMeeting.setStartTime(meeting.getStart_time());
				cxfMeetingList.add(cxfMeeting);
			}
		}
		cxfMeetings.setTotal(null == meetings ? 0 : meetings.size());
		cxfMeetings.setMeetings(cxfMeetingList);
		return cxfMeetings;
	}
	public static CXFMeetings callP2pMeetingToCxfMeeting(NmsApiRequest nmsApiRequest) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		List<NmsMeetingVO> meetings = nmsApiRequest.getMeetings();
		List<CXFMeeting> cxfMeetingList = new ArrayList<CXFMeeting>();
		MeetingResourceVO meetingResourceVO = new MeetingResourceVO();
		if(null!=meetings){
			for(NmsMeetingVO meeting : meetings){
				CXFMeeting cxfMeeting = new CXFMeeting();
				cxfMeeting.setSubject(meeting.getName());
				cxfMeeting.setCreator(meeting.getOrganizer());
				cxfMeeting.setEndTime(meeting.getEnd_time());
				cxfMeeting.setIsVideoMeeting(new Integer(1));
				meetingResourceVO.setMulti(Integer.parseInt(meeting.getMulti()));
				meetingResourceVO.setResolution(meeting.getResolution());
				cxfMeeting.setMeetingResourceVO(meetingResourceVO);
				cxfMeeting.setStartTime(meeting.getStart_time());
				cxfMeetingList.add(cxfMeeting);
			}
		}
		cxfMeetings.setTotal(nmsApiRequest.getTotal().intValue());
		cxfMeetings.setMeetings(cxfMeetingList);
		return cxfMeetings;
	}
	public static CXFMeetings callEntityMeetingToCxfMeeting(NmsApiRequest nmsApiRequest) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		List<NmsMeetingVO> meetings = nmsApiRequest.getMeetings();
		List<CXFMeeting> cxfMeetingList = new ArrayList<CXFMeeting>();
		if(null!=meetings){
			for(NmsMeetingVO meeting : meetings){
				CXFMeeting cxfMeeting = new CXFMeeting();
				cxfMeeting.setSubject(meeting.getName());
				cxfMeeting.setCreator(meeting.getOrganizer());
				cxfMeeting.setEndTime(meeting.getEnd_time());
				cxfMeeting.setTelephone(meeting.getMobile());
				cxfMeeting.setMobile(meeting.getTelephone());
				cxfMeeting.setIsVideoMeeting(new Integer(0));
				cxfMeeting.setStartTime(meeting.getStart_time());
				List<NmsRoomVO> nmsRooms = meeting.getRooms();
				List<CXFRoom> cxfRooms = new ArrayList<CXFRoom>();
				if(null!=nmsRooms){
					for(NmsRoomVO nmsRoom:nmsRooms){
						CXFRoom cxfRoom = new CXFRoom();
						cxfRoom.setId(nmsRoom.getId());
						cxfRoom.setName(nmsRoom.getName());
						cxfRooms.add(cxfRoom);
					}
				}
				cxfMeeting.setRooms(cxfRooms);
				cxfMeetingList.add(cxfMeeting);
			}
		}
		cxfMeetings.setTotal(null == meetings ? 0 : meetings.size());
		cxfMeetings.setMeetings(cxfMeetingList);
		return cxfMeetings;
	}
	public static CXFMeetings bookMeetingToCxfMeeting(NmsApiRequest nmsApiRequest) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		List<NmsMeetingVO> meetings = nmsApiRequest.getMeetings();
		List<CXFMeeting> cxfMeetingList = new ArrayList<CXFMeeting>();
		
		MeetingResourceVO meetingResourceVO = new MeetingResourceVO();
		if(null!=meetings){
			SimpleDateFormat nmsDateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			for(NmsMeetingVO meeting : meetings){
				String startTime = meeting.getStart_time();
				try {
					// 预约会议只保留24小时内的
					Date appointTime = nmsDateFormat.parse(startTime);
					Calendar calendar = Calendar.getInstance();
					calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + 1);
					Date oneDayLater = calendar.getTime();
					if (appointTime.compareTo(oneDayLater) >= 0) {
						continue;
					}
				} catch (ParseException e) {
					e.printStackTrace();
					continue;
				}
				CXFMeeting cxfMeeting = new CXFMeeting();
				cxfMeeting.setCreator(meeting.getCreator());
				cxfMeeting.setEndTime(meeting.getEnd_time());
				cxfMeeting.setId(meeting.getId());
				cxfMeeting.setIsConflict(meeting.getIs_conflict().equals(Constants.YES_INT));
				cxfMeeting.setIsVideoMeeting(meeting.getIs_video_meeting());
				cxfMeeting.setLastModifyTime(meeting.getLast_modify_time());
				NmsMeetingResourceVO nmsMeetingResourceVO = meeting.getMeeting_resource_vo();
				if(nmsMeetingResourceVO!=null){
					meetingResourceVO.setId(nmsMeetingResourceVO.getId());
					meetingResourceVO.setKey(nmsMeetingResourceVO.getKey());
					meetingResourceVO.setMulti(nmsMeetingResourceVO.getMulti());
					meetingResourceVO.setName(nmsMeetingResourceVO.getName());
					meetingResourceVO.setResolution(nmsMeetingResourceVO.getResolution());
					meetingResourceVO.setTotalCount(nmsMeetingResourceVO.getTotal_count().intValue());
					meetingResourceVO.setUsedCount(nmsMeetingResourceVO.getUsed_count().intValue());
				}
				cxfMeeting.setMeetingResourceVO(meetingResourceVO);
				cxfMeeting.setMeetingType(meeting.getMeeting_type());
				cxfMeeting.setMobile(meeting.getMobile());
				cxfMeeting.setOrganizerMoid(meeting.getOrganizer_moid());
				cxfMeeting.setRegularId(meeting.getRegular_id());
				List<NmsRoomVO> nmsRooms = meeting.getRooms();
				List<CXFRoom> cxfRooms = new ArrayList<CXFRoom>();
				if(null!=nmsRooms){
					for(NmsRoomVO nmsRoom:nmsRooms){
						CXFRoom cxfRoom = new CXFRoom();
						cxfRoom.setId(nmsRoom.getId());
						cxfRoom.setName(nmsRoom.getName());
						cxfRooms.add(cxfRoom);
					}
				}
				cxfMeeting.setRooms(cxfRooms);
				cxfMeeting.setStartTime(startTime);
				cxfMeeting.setSubject(meeting.getSubject());
				cxfMeeting.setTelephone(meeting.getTelephone());
				cxfMeetingList.add(cxfMeeting);
			}
		}
		cxfMeetings.setTotal(null == cxfMeetingList ? 0 : cxfMeetingList.size());
		cxfMeetings.setMeetings(cxfMeetingList);
		return cxfMeetings;
	}
	public static CXFMeetings historyMultiMeetingToCxfMeeting(NmsApiRequest nmsApiRequest) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		List<NmsMeetingVO> meetings = nmsApiRequest.getMeetings();
		List<CXFMeeting> cxfMeetingList = new ArrayList<CXFMeeting>();
		MeetingResourceVO meetingResourceVO = new MeetingResourceVO();
		if(null!=meetings){
			for(NmsMeetingVO meeting : meetings){
				CXFMeeting cxfMeeting = new CXFMeeting();
				cxfMeeting.setSubject(meeting.getName());
				cxfMeeting.setCreator(meeting.getOrganizer());
				cxfMeeting.setEndTime(meeting.getEnd_time());
				cxfMeeting.setIsVideoMeeting(new Integer(1));
				meetingResourceVO.setMulti(Integer.parseInt(meeting.getMulti()));
				meetingResourceVO.setResolution(meeting.getResolution());
				cxfMeeting.setMeetingResourceVO(meetingResourceVO);
				cxfMeeting.setStartTime(meeting.getStart_time());
				cxfMeetingList.add(cxfMeeting);
			}
		}
		cxfMeetings.setTotal(meetings == null ? 0 : meetings.size());
		cxfMeetings.setMeetings(cxfMeetingList);
		return cxfMeetings;
	}
	public static CXFMeetings historyEntityMeetingToCxfMeeting(NmsApiRequest nmsApiRequest) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		List<NmsMeetingVO> meetings = nmsApiRequest.getMeetings();
		List<CXFMeeting> cxfMeetingList = new ArrayList<CXFMeeting>();
		if(null!=meetings){
			for(NmsMeetingVO meeting : meetings){
				CXFMeeting cxfMeeting = new CXFMeeting();
				cxfMeeting.setSubject(meeting.getName());
				cxfMeeting.setCreator(meeting.getOrganizer());
				cxfMeeting.setEndTime(meeting.getEnd_time());
				cxfMeeting.setTelephone(meeting.getMobile());
				cxfMeeting.setMobile(meeting.getTelephone());
				cxfMeeting.setIsVideoMeeting(new Integer(0));
				cxfMeeting.setStartTime(meeting.getStart_time());
				List<NmsRoomVO> nmsRooms = meeting.getRooms();
				List<CXFRoom> cxfRooms = new ArrayList<CXFRoom>();
				if(null!=nmsRooms){
					for(NmsRoomVO nmsRoom:nmsRooms){
						CXFRoom cxfRoom = new CXFRoom();
						cxfRoom.setId(nmsRoom.getId());
						cxfRoom.setName(nmsRoom.getName());
						cxfRooms.add(cxfRoom);
					}
				}
				cxfMeeting.setRooms(cxfRooms);
				cxfMeetingList.add(cxfMeeting);
			}
		}
		cxfMeetings.setTotal(meetings == null ? 0 : meetings.size());
		cxfMeetings.setMeetings(cxfMeetingList);
		return cxfMeetings;
	}

	/**
	 *
	 * @param nmsApiRequest
	 * @param isAppointment 是否预约类型
	 * @return
	 */
	public static List<RoomStateVO> nmsRoomStateVoToRoomStateVOs(NmsApiRequest nmsApiRequest, Boolean isAppointment){
		List<RoomStateVO> roomStateVOs = new ArrayList<RoomStateVO>();
		//根据类型从live或aplive中获取值
		List<NmsRoomStateVO> nmsRoomStateVOs = isAppointment ? nmsApiRequest.getAplive():nmsApiRequest.getLive();
		if(null!=nmsRoomStateVOs){
			for(NmsRoomStateVO nmsRoomStateVo : nmsRoomStateVOs){
				RoomStateVO roomStateVo = new RoomStateVO();
				roomStateVo.setRoomname(nmsRoomStateVo.getLive_name());
				roomStateVo.setUserdomainmoid(nmsRoomStateVo.getDomain_moid());
				roomStateVo.setUserdomainname(nmsRoomStateVo.getDomain_name());
				roomStateVo.setMte164(nmsRoomStateVo.getConfe164());
				roomStateVo.setLivetime(nmsRoomStateVo.getStart_time());
				roomStateVo.setElapse(nmsRoomStateVo.getElapse());
				roomStateVo.setLivestatnum(nmsRoomStateVo.getLivestatnum());
				roomStateVo.setEncmode(nmsRoomStateVo.getEncmode());
				roomStateVo.setAuthmode(nmsRoomStateVo.getAuthmode());
				roomStateVOs.add(roomStateVo);
			}
		}
		return roomStateVOs;
	}

	public static List<LiveInfoVO> nmsRoomStateVoToLiveInfoVO(NmsApiRequest nmsApiRequest) {
		List<LiveInfoVO> liveInfoVOs = new ArrayList<LiveInfoVO>();
		List<NmsRoomStateVO> nmsRoomStateVOs = nmsApiRequest.getAplive();
		if (null != nmsRoomStateVOs) {
			for (NmsRoomStateVO nmsRoomStateVo : nmsRoomStateVOs) {
				LiveInfoVO liveInfoVO = new LiveInfoVO();
				liveInfoVO.setConfname(nmsRoomStateVo.getLive_name());
				liveInfoVO.setEncmode(nmsRoomStateVo.getEncmode());
				liveInfoVO.setStarttime(nmsRoomStateVo.getStart_time());
				liveInfoVOs.add(liveInfoVO);
			}
		}
		return liveInfoVOs;
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

	public List<PhysicalsVO> getPhysicals() {
		return physicals;
	}

	public void setPhysicals(List<PhysicalsVO> physicals) {
		this.physicals = physicals;
	}

	public PhysicalVO getPhysical() {
		return physical;
	}

	public void setPhysical(PhysicalVO physical) {
		this.physical = physical;
	}

	public ResourceVO getResource() {
		return resource;
	}

	public void setResource(ResourceVO resource) {
		this.resource = resource;
	}

	public StatisticVO getStatistic() {
		return statistic;
	}

	public void setStatistic(StatisticVO statistic) {
		this.statistic = statistic;
	}

	public BigDecimal getTotal_count() {
		return total_count;
	}

	public void setTotal_count(BigDecimal total_count) {
		this.total_count = total_count;
	}

	public List<WarningVO> getUnrepaired_warnings() {
		return unrepaired_warnings;
	}

	public void setUnrepaired_warnings(List<WarningVO> unrepaired_warnings) {
		this.unrepaired_warnings = unrepaired_warnings;
	}

	public List<NmsMeetingVO> getMeetings() {
		return meetings;
	}

	public void setMeetings(List<NmsMeetingVO> meetings) {
		this.meetings = meetings;
	}

	
	public List<NmsRoomStateVO> getLive() {
		return live;
	}

	public void setLive(List<NmsRoomStateVO> live) {
		this.live = live;
	}

	public List<NmsRoomStateVO> getAplive() {
		return aplive;
	}

	public void setAplive(List<NmsRoomStateVO> aplive) {
		this.aplive = aplive;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public List<NmsDomainBean> getDomains() {
		return domains;
	}

	public void setDomains(List<NmsDomainBean> domains) {
		this.domains = domains;
	}

}
