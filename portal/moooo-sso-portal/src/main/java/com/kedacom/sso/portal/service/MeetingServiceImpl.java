package com.kedacom.sso.portal.service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kedacom.sdk.meeting.cxf.model.CXFLiveRoom;
import com.kedacom.sdk.meeting.cxf.model.CXFMeeting;
import com.kedacom.sdk.meeting.cxf.model.CXFMeetings;
import com.kedacom.sso.portal.CacheConstants;
import com.kedacom.sso.portal.aop.annotation.LoadFromRedis;
import com.kedacom.sso.portal.util.TimeUtil;
import com.kedacom.sso.portal.vo.LiveRoomVO;
import com.kedacom.sso.portal.vo.MeetingVO;

@Service("meetingService")
public class MeetingServiceImpl implements MeetingService {
	
	@Resource(name = "CXFService")
	private CXFService cxfService;
	
	@Override
	@LoadFromRedis(key = "${moid}_${dateTime}", prefix = CacheConstants.PREFIX_MEETING + "getMeetingByDateTime_")
	public List<MeetingVO> getMeetingByDateTime(String moid, Date dateTime) throws ParseException {
		List<CXFMeeting> list = cxfService.getMeetingCXFService().listMeetingByDateAndMoid(moid, TimeUtil.dateTime2String(dateTime, null), 0, "");
		List<MeetingVO> listVO = new ArrayList<MeetingVO>();
		if(list != null){
			for (CXFMeeting cxfMeeting : list) {
				MeetingVO meetingVO = MeetingVO.toMeetingVO(cxfMeeting);
				listVO.add(meetingVO);
			}
		}
		return listVO;
	}

	@Override
	public List<LiveRoomVO> getLiveRoomByDateTime(String moid, Date dateTime) throws ParseException {
		List<CXFLiveRoom> list = cxfService.getMeetingCXFService().listLiveRoomByDateAndMoid(moid, TimeUtil.dateTime2String(dateTime, null),"");
		List<LiveRoomVO> listVO = new ArrayList<LiveRoomVO>();
		if(list != null){
			for (CXFLiveRoom cxfLiveRoom : list) {
				LiveRoomVO liveRoomVO = LiveRoomVO.toLiveRoomVO(cxfLiveRoom);
				listVO.add(liveRoomVO);
			}
		}
		return listVO;
	}

	@Override
	@LoadFromRedis(key = "${moid}_${startTime}_${endTime}_${type}_${timezone}_${start}_${count}_${order}_${searchType}", prefix = CacheConstants.PREFIX_MEETING
			+ "listMeetingByCondition_")
	public CXFMeetings listMeetingByCondition(String moid, String startTime,
			String endTime, Integer type, String timezone, Integer start,
			Integer count, Integer order, Integer searchType) {
		CXFMeetings cxfMeetings = cxfService.getMeetingCXFService()
				.listMeetingByCondition(moid, startTime, endTime, type,
						timezone, start, count, order,searchType);
		return cxfMeetings;
	}

	@Override
	@LoadFromRedis(key = "${isParticipant}_${moid}_${meetingId}_${isVideoMeeting}_${participanteType}_${participateNO}_${reasonId}_${lastModifyTime}_${reasonDesc}_${meetingType}", prefix = CacheConstants.PREFIX_MEETING
			+ "confirmParticipantType_")
	public Boolean participante(Integer isParticipant, String moid,
			Integer meetingId, Integer isVideoMeeting,
			Integer participanteType, String participateNO, Integer reasonId,
			String lastModifyTime, String reasonDesc, Integer meetingType) {
		Boolean flag = cxfService.getMeetingCXFService().participante(
				isParticipant, moid, meetingId, isVideoMeeting,
				participanteType, participateNO, reasonId, lastModifyTime,
				reasonDesc, meetingType);
		return flag;
	}

}
