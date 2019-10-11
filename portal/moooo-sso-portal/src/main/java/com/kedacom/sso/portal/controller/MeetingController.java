package com.kedacom.sso.portal.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.kedacom.moooo.core.web.utils.DirectlyRenderUtils;
import com.kedacom.movision.core.model.Message;
import com.kedacom.sdk.meeting.cxf.model.CXFMeetings;
import com.kedacom.sso.portal.service.MeetingService;


/**
 * 会管接口调用Controller
 */

@Controller
@RequestMapping("/meeting")
public class MeetingController {
	
	private Logger logger = LoggerFactory.getLogger(VrsController.class);
	
	@Resource(name = "meetingService")
	private MeetingService meetingService;

	
	/**
	 * 根据类型获取会议
	 * 
	 * @param moid
	 * @param startTime
	 *            格式 yyyy-MM-dd HH:mm:ss,传null默认当前时间
	 * @param endTime
	 *            没有时间范围 传null
	 * @param type
	 *            1：预约会议；2：待确认的会议；3：正在召开的会议；4：历史会议
	 * @param timezone
	 *            不设置时区 传null
	 * @param start
	 * @param count
	 * @param order 1-降序  0-升序
	 * @param searchType 0:根据当前用户查询；1:查询该用户域下所有
	 * @return
	 */
	@RequestMapping(value = "/listMeetingByCondition", method = RequestMethod.GET)
	public void listMeetingByCondition(HttpServletResponse response,
			String moid, String startTime, String endTime, Integer type,
			String timezone, Integer start, Integer count, Integer order,
			Integer searchType,ModelMap model) {
		Message<CXFMeetings> message = new Message<CXFMeetings>(false, "");
		try {
			CXFMeetings cxfMeetings = meetingService.listMeetingByCondition(
					moid, startTime, endTime, type, timezone, start, count,
					order,searchType);
			message.setData(cxfMeetings);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
		

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
	@RequestMapping(value = "/confirmParticipantType", method = RequestMethod.GET)
	public void listMeetingByCondition(HttpServletResponse response,
			Integer isParticipant, String moid, Integer meetingId,
			Integer isVideoMeeting, Integer participanteType,
			String participateNO, Integer reasonId, String lastModifyTime,
			String reasonDesc, Integer meetingType,
			ModelMap model) {
		Message<Boolean> message = new Message<Boolean>(false, "");
		try {
			Boolean flag = meetingService.participante(isParticipant,
					moid, meetingId, isVideoMeeting, participanteType,
					participateNO, reasonId, lastModifyTime, reasonDesc,
					meetingType);
			message.setData(flag);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

}
