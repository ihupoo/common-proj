package com.kedacom.sso.portal.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.utils.DateUtils;
import com.kedacom.moooo.core.web.AjaxMessage;
import com.kedacom.moooo.core.web.utils.DirectlyRenderUtils;
import com.kedacom.movision.common.MovisionError;
import com.kedacom.movision.core.model.Message;
import com.kedacom.movision.core.util.StringUtil;
import com.kedacom.sdk.meeting.cxf.model.CXFMeeting;
import com.kedacom.sdk.meeting.cxf.model.CXFMeetings;
import com.kedacom.sso.portal.service.PortalService;
import com.kedacom.sso.portal.util.MeetingCompare;
import com.kedacom.sso.portal.util.NmsApiClient;
import com.kedacom.sso.portal.vo.LiveInfoVO;
import com.kedacom.sso.portal.vo.NmsApiRequest;
import com.kedacom.sso.portal.vo.NmsRoomStateVO;
import com.kedacom.sso.portal.vo.RoomStateVO;
import com.kedacom.sso.portal.vo.VrsApiRequest;

/**
 * 网管接口调用Controller
 */

@Controller
@RequestMapping("/nms")
public class NmsController {

	private Logger logger = LoggerFactory.getLogger(NmsController.class);

	private static final String VRS_ROOM_TYPE_LIVE = "live"; //正在直播
	private static final String VRS_ROOM_TYPE_APPOINTMENT = "appointment"; //预约直播

	@Resource
	private NmsApiClient nmsApiClient;

	@Resource
	private PortalService portalService;

	/**
	 * 获取资源统计信息
	 */
	@RequestMapping(value = "/getResource", method = RequestMethod.GET)
	@ResponseBody
	public Message<NmsApiRequest> getResource(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, String type) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getResource(moid, type);
			if (null != nms && !portalService.checkSupportPortMeeting(moid, type)) { // 当前域不支持端口会议
				nms.getResource().setPort_meeting(null);
			}
			message.setData(nms);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		return message;
	}
	
	/**
	 * 请求服务器5条未修复严重告警信息
	 */
	@RequestMapping(value = "/getWarning", method = RequestMethod.GET)
	public void getWarning(HttpServletRequest request, HttpServletResponse response, ModelMap model, String moid, Integer num,
			String level) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getWarning(moid, num, level);
			message.setData(nms);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}
	
	/**
	 * 获取cpu使用率前n的物理服务器
	 */
	@RequestMapping(value = "/getCpuPhysical", method = RequestMethod.GET)
	public void getCpuPhysical(HttpServletRequest request, HttpServletResponse response, String moid, int num, String moidList, ModelMap model) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = new NmsApiRequest();
			if(StringUtil.isNotNullString(moidList)){
				nms = nmsApiClient.getPhysicalResource(moidList);
			}else{
				nms = nmsApiClient.getCpuPhysical(moid, num);
			}
			message.setData(nms);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	/**
	 * 获取内存使用率前n的物理服务器
	 */
	@RequestMapping(value = "/getMemPhysical", method = RequestMethod.GET)
	public void getMemPhysical(HttpServletRequest request, HttpServletResponse response, String moid, int num, String moidList, ModelMap model) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = new NmsApiRequest();
			if(StringUtil.isNotNullString(moidList)){
				nms = nmsApiClient.getPhysicalResource(moidList);
			}else{
				nms = nmsApiClient.getMemPhysical(moid, num);
			}
			message.setData(nms);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	/**
	 * 获取物理服务器cpu历史
	 */
	@RequestMapping(value = "/getCpuUsageHistory", method = RequestMethod.GET)
	public void getCpuUsageHistory(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, String start_time, String end_time) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getCpuUsageHistory(moid, start_time, end_time);
			if(null!=nms.getPhysical()&&nms.getPhysical().getTime().size()>0){
				message.setData(nms);
				message.setSuccess(true);
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

	/**
	 * 获取物理服务器内存历史
	 */
	@RequestMapping(value = "/getMemUsageHistory", method = RequestMethod.GET)
	public void getMemUsageHistory(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, String start_time, String end_time) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getMemUsageHistory(moid, start_time, end_time);
			if(null!=nms.getPhysical()&&nms.getPhysical().getTime().size()>0){
				message.setData(nms);
				message.setSuccess(true);
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	/**
	 * 请求并发会议统计数据
	 */
	@RequestMapping(value = "/getMeetingStatistic", method = RequestMethod.GET)
	public void getMeetingStatistic(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, String start_time, String end_time) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getMeetingStatistic(moid, start_time, end_time);
			if(null!=nms.getStatistic()&&null!=nms.getStatistic().getMulti()&&nms.getStatistic().getMulti().getTime().size()>0){
				message.setData(nms);
				message.setSuccess(true);
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	/**
	 * 获取并发会议在线终端统计信息
	 */
	@RequestMapping(value = "/getTerminalStatistic", method = RequestMethod.GET)
	public void getTerminalStatistic(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, String start_time, String end_time) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getTerminalStatistic(moid, start_time, end_time);
			if(null!=nms.getStatistic()&&null!=nms.getStatistic().getMulti()&&nms.getStatistic().getMulti().getTime().size()>0){
				message.setData(nms);
				message.setSuccess(true);
			}
			message.setData(nms);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	/**
	 * 获取在线终端统计信息
	 */
	@RequestMapping(value = "/getOnlineStatistic", method = RequestMethod.GET)
	public void getOnlineStatistic(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, String start_time, String end_time) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getOnlineStatistic(moid, start_time, end_time);
			if(null!=nms.getStatistic()&&nms.getStatistic().getSip().getTime().size()>0){
				message.setData(nms);
				message.setSuccess(true);
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}
	
	/**
	 * 请求预约会议统计数据 
	 */
	@RequestMapping(value = "/getAppointmentHistory", method = RequestMethod.GET)
	public void getAppointment(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, String start_time, String end_time) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getAppointmentHistory(moid, start_time, end_time);
			if(null!=nms.getStatistic()&&nms.getStatistic().getTime().size()>0){
				message.setData(nms);
				message.setSuccess(true);
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}
	/**
	 * 请求服务域或用户域正在召开的会议列表 
	 */
	@RequestMapping(value = "/getCallMeetingList", method = RequestMethod.GET)
	public void getCallMeetingList(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, Integer start, Integer count) {
		Message<CXFMeetings> message = new Message<CXFMeetings>(false, "");
		try {
			NmsApiRequest nmsCallTran = nmsApiClient.getMeetings(moid, 0, "tran");
			NmsApiRequest nmsCallPort = nmsApiClient.getMeetings(moid, 0, "port");
			NmsApiRequest nmsCallEntity = nmsApiClient.getMeetings(moid, 0, "entity");
			
			CXFMeetings cxfMeetingsTran = NmsApiRequest.callTranMeetingToCxfMeeting(nmsCallTran);
			CXFMeetings cxfMeetingsPort = NmsApiRequest.callPortMeetingToCxfMeeting(nmsCallPort);
			CXFMeetings cxfMeetingsEntity = NmsApiRequest.callEntityMeetingToCxfMeeting(nmsCallEntity);

			List<CXFMeetings> allMeetingsList = new ArrayList<CXFMeetings>();
			allMeetingsList.add(cxfMeetingsTran);
			allMeetingsList.add(cxfMeetingsPort);
			allMeetingsList.add(cxfMeetingsEntity);

			CXFMeetings cxfMeetings = getConcatCXFMeetings(start, count, true, allMeetingsList);

			message.setData(cxfMeetings);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	private CXFMeetings getConcatCXFMeetings(Integer start, Integer count, boolean isAsc,
			List<CXFMeetings> allMeetingsList) {
		CXFMeetings cxfMeetings = new CXFMeetings();
		int total = 0;
		List<CXFMeeting> meetings = new ArrayList<CXFMeeting>();
		if (null != allMeetingsList) {
			for (CXFMeetings meetingsList : allMeetingsList) {
				List<CXFMeeting> cxfMeetingList = meetingsList.getMeetings();
				if (null != cxfMeetingList) {
					int size = cxfMeetingList.size();
					total += size;
					if (size > 0) {
						meetings.addAll(cxfMeetingList);
					}
				}
			}
			Collections.sort(meetings, new MeetingCompare<CXFMeeting>("StartTime", isAsc));
			int fromIndex = start;
			int toIndex = fromIndex + count;
			toIndex = toIndex < meetings.size() ? toIndex : meetings.size();
			meetings = meetings.subList(fromIndex, toIndex);
		}
		cxfMeetings.setTotal(total);
		cxfMeetings.setMeetings(meetings);
		return cxfMeetings;
	}

	/**
	 * 请求服务域或用户域历史会议列表 
	 */
	@RequestMapping(value = "/getHistoryMeetingList", method = RequestMethod.GET)
	public void getHistoryMeetingList(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, Integer start, Integer count, String startTime, String endTime) {
		Message<CXFMeetings> message = new Message<CXFMeetings>(false, "");
		try {
			NmsApiRequest nmsHistoryMulti = nmsApiClient.getHistoryMeetings(moid, startTime, endTime, "multi");
			NmsApiRequest nmsHistoryEntity = nmsApiClient.getHistoryMeetings(moid, startTime, endTime, "entity");
			
			CXFMeetings cxfMeetingsMulti = NmsApiRequest.historyMultiMeetingToCxfMeeting(nmsHistoryMulti);
			CXFMeetings cxfMeetingsEntity = NmsApiRequest.historyEntityMeetingToCxfMeeting(nmsHistoryEntity);

			List<CXFMeetings> allMeetingsList = new ArrayList<CXFMeetings>();
			allMeetingsList.add(cxfMeetingsMulti);
			allMeetingsList.add(cxfMeetingsEntity);

			CXFMeetings cxfMeetings = getConcatCXFMeetings(start, count, false, allMeetingsList);

			message.setData(cxfMeetings);
			message.setSuccess(true);
			
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}
	/**
	 * 请求服务域或用户域属预约会议列表 
	 */
	@RequestMapping(value = "/getAppointmentList", method = RequestMethod.GET)
	public void getAppointmentList(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, Integer start, Integer count) {
		Message<CXFMeetings> message = new Message<CXFMeetings>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getAppointmentList(moid);
			CXFMeetings cxfMeetings = NmsApiRequest.bookMeetingToCxfMeeting(nms);
			List<CXFMeeting> meetings = cxfMeetings.getMeetings();
			Collections.sort(meetings, new MeetingCompare<CXFMeeting>("StartTime",true));
			int fromIndex = start;
			int toIndex = fromIndex + count;
			toIndex = (Integer) (toIndex<meetings.size()?toIndex:meetings.size());
			meetings = meetings.subList(fromIndex, toIndex);
			cxfMeetings.setMeetings(meetings);

			message.setData(cxfMeetings);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}
	/**
	 * 请求服务域正在召开的会议-传统会议、端口会议、点对点会议
	 */
	@RequestMapping(value = "/getMeetings", method = RequestMethod.GET)
	public void getMeetings(HttpServletRequest request, HttpServletResponse response, ModelMap model, String moid,
			Integer count, String conf_type) {
		Message<NmsApiRequest> message = new Message<NmsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getMeetings(moid, count, conf_type);
			message.setData(nms);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	/**
	 * 请求服务域或用户域所直播室列表 
	 */
	@RequestMapping(value = "/getLivesList", method = RequestMethod.GET)
	public void getLivesList(HttpServletRequest request, HttpServletResponse response, ModelMap model,
			String moid, int num) {
		Message<VrsApiRequest> message = new Message<VrsApiRequest>(false, "");
		try {
			NmsApiRequest nms = nmsApiClient.getLivesList(moid);
			int fromIndex = 0;
			int toIndex = fromIndex + num;
			List<NmsRoomStateVO> nmsRoomStateVOs = nms.getLive();
			toIndex = (Integer) (toIndex<nmsRoomStateVOs.size()?toIndex:nmsRoomStateVOs.size());
			nmsRoomStateVOs = nmsRoomStateVOs.subList(fromIndex, toIndex);
			nms.setLive(nmsRoomStateVOs);
			List<RoomStateVO> roomStateVOs = NmsApiRequest.nmsRoomStateVoToRoomStateVOs(nms,false);
			VrsApiRequest vrs = new VrsApiRequest();
			vrs.setRoomstate(roomStateVOs);
			message.setData(vrs);
			message.setSuccess(true);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	/**
	 * 请求服务域或用户域所直播室列表
	 */
	@RequestMapping(value = "/getAppointedLivingList", method = RequestMethod.GET)
	public void getAppointedLivingList(HttpServletResponse response, String moid, int num) {
		AjaxMessage<VrsApiRequest> message = new AjaxMessage<VrsApiRequest>(true, "查询成功！");
		try {
			NmsApiRequest nms = nmsApiClient.getApLivesList(moid);
			int fromIndex = 0;
			int toIndex = fromIndex + num;
			List<NmsRoomStateVO> nmsRoomStateVOs = nms.getAplive();
			toIndex = toIndex < nmsRoomStateVOs.size() ? toIndex : nmsRoomStateVOs.size();
			nmsRoomStateVOs = nmsRoomStateVOs.subList(fromIndex, toIndex);
			nms.setAplive(nmsRoomStateVOs);

			List<LiveInfoVO> liveInfoVOs = NmsApiRequest.nmsRoomStateVoToLiveInfoVO(nms);
			VrsApiRequest vrs = new VrsApiRequest();
			vrs.setLiveinfo(liveInfoVOs);
			message.setData(vrs);
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setErrorCode(e.getCode());
			message.setDescription(e.getMessage());
			logger.error("查询预约直播室列表失败");
		} catch (Exception e) {
			message.setSuccess(false);
			message.setErrorCode(MovisionError.CODE_SYS_EX.code());
			message.setDescription(e.getMessage());
			logger.error("查询预约直播室列表失败");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

	/**
	 * 请求服务域或用户域所有的直播室统计
	 */
	@RequestMapping(value = "/getAllLiveRooms", method = RequestMethod.GET)
	public void getAllLiveRooms(HttpServletResponse response, String type, String moid) {
		AjaxMessage<Map> message = new AjaxMessage<Map>(true, "查询成功！");
		try {
			NmsApiRequest nms = null;
			boolean isAppointment = false; //是否预约列表
			if (VRS_ROOM_TYPE_LIVE.equals(type)) {
				nms = nmsApiClient.getLivesList(moid);
			} else if (VRS_ROOM_TYPE_APPOINTMENT.equals(type)) {
				nms = nmsApiClient.getApLivesList(moid);
				isAppointment = true;
			}
			if (null != nms) {
				List<RoomStateVO> roomStateVOs = NmsApiRequest.nmsRoomStateVoToRoomStateVOs(nms,isAppointment);
				if (null != roomStateVOs && roomStateVOs.size() > 0) {
					Map liveRoomGroupMap = createMapFromRoomStateList(roomStateVOs, isAppointment);
					message.setData(liveRoomGroupMap);
				}
			}
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setErrorCode(e.getCode());
			message.setDescription(e.getMessage());
			logger.error("查询直播室列表统计失败");
		} catch (Exception e) {
			message.setSuccess(false);
			message.setErrorCode(MovisionError.CODE_SYS_EX.code());
			message.setDescription(e.getMessage());
			logger.error("查询直播室列表统计失败");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

	/**
	 * 生成按用户域分组全部直播室列表
	 */
	private Map<String, List<Object>> createMapFromRoomStateList(List<RoomStateVO> roomStateVOs, Boolean isAppointment) {
		Map<String, List<Object>> liveRoomGroupMap = new HashMap<String, List<Object>>();
		for (RoomStateVO roomState : roomStateVOs) {
			String moid = roomState.getUserdomainmoid();
			//转换日期格式
			String timeString = roomState.getLivetime().replace('/', '-');
			roomState.setLivetime(timeString);
			if (liveRoomGroupMap.containsKey(moid)) {
				try {
					List<Object> domainInfoList = liveRoomGroupMap.get(moid);
					//记录更近的时间
					if (isAppointment) {
						String startTime = roomState.getLivetime();
						String recordTime = domainInfoList.get(1).toString();
						if (DateUtils.fromDatetimeString(startTime).after(DateUtils.fromDatetimeString(recordTime))) {
							//如果新的时间在记录的时间之后则记录新的时间
							domainInfoList.set(1, startTime);
						}
					} else {
						BigDecimal elapse = roomState.getElapse();
						BigDecimal currentElapse = (BigDecimal) domainInfoList.get(1);
						if (elapse.compareTo(currentElapse) < 0) {
							domainInfoList.set(1, elapse);
						}
					}
					//向用户域所属直播室列表添加
					List<RoomStateVO> liveRoomList = (List<RoomStateVO>) domainInfoList.get(2);
					liveRoomList.add(roomState);
					liveRoomGroupMap.put(moid, domainInfoList);
				} catch (Exception e) {
					logger.warn(e.getMessage());
				}
			} else { //未出现过的用户域新增一个分组
				List<Object> domainInfoList = new ArrayList<Object>();
				domainInfoList.add(roomState.getUserdomainname());
				if (isAppointment) { //记录直播开始时间
					domainInfoList.add(roomState.getLivetime());
				} else {
					domainInfoList.add(roomState.getElapse());
				}
				List<RoomStateVO> liveRoomList = new ArrayList<RoomStateVO>(); //直播室列表
				liveRoomList.add(roomState);
				domainInfoList.add(liveRoomList);
				liveRoomGroupMap.put(roomState.getUserdomainmoid(), domainInfoList);
			}
		}
		return liveRoomGroupMap;
	}
	
}
