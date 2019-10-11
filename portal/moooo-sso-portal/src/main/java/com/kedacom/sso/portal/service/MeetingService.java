package com.kedacom.sso.portal.service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import com.kedacom.sdk.meeting.cxf.model.CXFMeetings;
import com.kedacom.sso.portal.vo.LiveRoomVO;
import com.kedacom.sso.portal.vo.MeetingVO;


public interface MeetingService {
	
	/**
	 * 根据日期查询会议日程
	 * @param moid
	 * @param dateTime
	 * @return
	 * @throws ParseException 
	 */
	public List<MeetingVO> getMeetingByDateTime(String moid,Date dateTime) throws ParseException;
	/**
	 * 根据日期查询直播室
	 * @param moid
	 * @param dateTime
	 * @return
	 * @throws ParseException 
	 */
	public List<LiveRoomVO> getLiveRoomByDateTime(String moid,Date dateTime) throws ParseException;

	/**
	 * 根据类型获取会议，portal使用
	 * 
	 * @param moid
	 * @param startTime
	 * @param endTime
	 * @param type
	 *            1：预约会议；2：待确认的会议；3：正在召开的会议；4：历史会议
	 * @param timezone
	 * @param start
	 * @param count
	 * @param order
	 * @return
	 */
	public CXFMeetings listMeetingByCondition(String moid, String startTime,
			String endTime, Integer type, String timezone, Integer start,
			Integer count, Integer order, Integer searchType);

	/**
	 * 反馈参会方式
	 * 
	 * @param isParticipant
	 *            0：不参加；1：参加
	 * @param moid
	 * @param meetingId
	 * @param isVideoMeeting
	 * @param participanteType
	 *            参会方式
	 * @param participateNO
	 * @param reasonId
	 * @param lastModifyTime
	 * @param reasonDesc
	 * @param meetingType
	 *            0：单次 1：例会
	 */

	public Boolean participante(Integer isParticipant, String moid,
			Integer meetingId, Integer isVideoMeeting,
			Integer participanteType, String participateNO, Integer reasonId,
			String lastModifyTime, String reasonDesc, Integer meetingType);

	
}
