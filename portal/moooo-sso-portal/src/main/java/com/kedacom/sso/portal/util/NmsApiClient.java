package com.kedacom.sso.portal.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.http.conn.HttpHostConnectException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.utils.BeanUtils;
import com.kedacom.movision.common.Constants;
import com.kedacom.movision.common.MovisionError;
import com.kedacom.movision.common.util.ExceptionUtil;
import com.kedacom.sso.portal.CacheConstants;
import com.kedacom.sso.portal.aop.annotation.LoadFromRedis;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.vo.NmsApiRequest;
import com.kedacom.sso.portal.vo.NmsDomainBean;
import com.kedacom.sso.portal.vo.NmsServerBean;
import com.kedacom.sso.portal.vo.PhysicalsVO;

/**
 * 网管API接口入口
 * @author 方斌
 * @date 2018年4月28日
 */
@Component
public class NmsApiClient {
	
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Resource
	private ConfigService configService;

	/**
	 * 获取资源统计信息
	 */
	@LoadFromRedis(key = "${moid}_${type}", prefix = CacheConstants.PREFIX_NMS + "getResource_")
	public NmsApiRequest getResource(String moid, String type) throws BusinessException {
		if (StringUtils.isNotEmpty(moid) && StringUtils.isNotEmpty(type)) {
			// 设置调用接口URL
			try {
				return sendGetToNms("/api/inner/nms/resource/" + moid + "/media_vmr_statistic?type=" + type);
			} catch (BusinessException e) {
				ExceptionUtil.error(e.getCode(), "[获取资源]" + e.getMessage(), e);
			} catch (Exception e) {
				ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取资源]" + e.getMessage(), e);
			}
		} else {
			ExceptionUtil.throwValidationError("获取资源失败:参数为空");
		}
		return null;
	}
	
	/**
	 * 请求服务器5条未修复严重告警信息
	 */
	@LoadFromRedis(key = "${moid}_${count}_${level}", prefix = CacheConstants.PREFIX_NMS + "getWarning_")
	public NmsApiRequest getWarning(String moid, Integer count, String level) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/warning/topn_unrepaired?count=" + count + "&level=" + level + "&moid=" + moid);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求服务器5条未修复严重告警信息]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求服务器5条未修复严重告警信息]" + e.getMessage(), e);
		}
		return null;
	}
	
	/**
	 * 获取cpu使用率前n的物理服务器
	 */
	@LoadFromRedis(key = "${moid}_${count}", prefix = CacheConstants.PREFIX_NMS + "getCpuPhysical_")
	public NmsApiRequest getCpuPhysical(String moid, int count) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/physicals/topn/cpu?count=" + count +"&moid=" + moid);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[获取cpu使用率]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取cpu使用率]" + e.getMessage(), e);
		}
		return null;
	}
	/**
	 * 获取一组服务器的硬件资源信息
	 */
	@LoadFromRedis(key = "${moidList}", prefix = CacheConstants.PREFIX_NMS + "getCpuPhysical_")
	public NmsApiRequest getPhysicalResource(String moidList) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/physicals/resource?moid_list=" + moidList);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[获取cpu使用率]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取cpu使用率]" + e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 获取内存使用率前五的物理服务器
	 */
	@LoadFromRedis(key = "${moid}_${count}", prefix = CacheConstants.PREFIX_NMS + "getMemPhysical_")
	public NmsApiRequest getMemPhysical(String moid, int count) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/physicals/topn/memory?count=" + count +"&moid="+moid);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[获取内存使用率]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取内存使用率]" + e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 获取物理服务器cpu历史
	 */
	@LoadFromRedis(key = "${moid}_${start_time}_${end_time}", prefix = CacheConstants.PREFIX_NMS
			+ "getCpuUsageHistory_")
	public NmsApiRequest getCpuUsageHistory(String moid, String start_time, String end_time) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/physicals/" + moid + "/cpu_history?start_time=" + start_time
					+ "&end_time=" + end_time);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[获取物理服务器cpu历史]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取物理服务器cpu历史]" + e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 获取物理服务器内存历史
	 */
	@LoadFromRedis(key = "${moid}_${start_time}_${end_time}", prefix = CacheConstants.PREFIX_NMS
			+ "getMemUsageHistory_")
	public NmsApiRequest getMemUsageHistory(String moid, String start_time, String end_time) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/physicals/" + moid + "/memory_history?start_time=" + start_time
					+ "&end_time=" + end_time);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[获取物理服务器内存历史]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取物理服务器内存历史]" + e.getMessage(), e);
		}
		return null;
	}

	

	/**
	 * 请求并发会议统计数据
	 */
	@LoadFromRedis(key = "${moid}_${start_time}_${end_time}", prefix = CacheConstants.PREFIX_NMS
			+ "getMeetingStatistic_")
	public NmsApiRequest getMeetingStatistic(String moid, String start_time, String end_time)
			throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/meeting/" + moid + "/meeting_statistic?start_time=" + start_time
					+ "&end_time=" + end_time);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求并发会议统计数据]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求并发会议统计数据]" + e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 获取并发会议在线终端统计信息
	 */
	@LoadFromRedis(key = "${moid}_${start_time}_${end_time}", prefix = CacheConstants.PREFIX_NMS
			+ "getTerminalStatistic_")
	public NmsApiRequest getTerminalStatistic(String moid, String start_time, String end_time)
			throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/meeting/" + moid + "/terminal_statistic?start_time=" + start_time
					+ "&end_time=" + end_time);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[获取并发会议在线终端统计信息]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取并发会议在线终端统计信息]" + e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 获取在线终端统计信息
	 */
	@LoadFromRedis(key = "${moid}_${start_time}_${end_time}", prefix = CacheConstants.PREFIX_NMS
			+ "getOnlineStatistic_")
	public NmsApiRequest getOnlineStatistic(String moid, String start_time, String end_time) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/terminal/" + moid + "/online_statistic?start_time=" + start_time + "&end_time=" + end_time);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[获取在线终端统计信息]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[获取在线终端统计信息]" + e.getMessage(), e);
		}
		return null;
	}
	
	/**
	 * 请求预约会议统计数据 
	 */
	@LoadFromRedis(key = "${moid}_${start_time}_${end_time}", prefix = CacheConstants.PREFIX_NMS
			+ "getAppointmentHistory_")
	public NmsApiRequest getAppointmentHistory(String moid, String start_time, String end_time) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/domains/" + moid + "/appointment/history?start_time=" + start_time
					+ "&end_time=" + end_time);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求服务域或用户域预约会议列表]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求服务域或用户域预约会议列表]" + e.getMessage(), e);
		}
		return null;
	}
	
	/**
	 * 请求服务域或用户域预约会议列表 
	 */
	@LoadFromRedis(key = "${moid}", prefix = CacheConstants.PREFIX_NMS + "getAppointmentList_")
	public NmsApiRequest getAppointmentList(String moid) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/domains/" + moid + "/appointment/list");
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求服务域或用户域预约会议列表]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求服务域或用户域预约会议列表]" + e.getMessage(), e);
		}
		return null;
	}
	
	/**
	 * 请求服务域或用户域预约会议列表 
	 */
	@LoadFromRedis(key = "${moid}_${startTime}_${endTime}_${conf_type}", prefix = CacheConstants.PREFIX_NMS + "getHistoryMeetings_")
	public NmsApiRequest getHistoryMeetings(String moid, String startTime, String endTime, String conf_type) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms(
					"/api/inner/nms/domains/" + moid + "/meetings/history?start_time=" + startTime + "&end_time=" + endTime + "&conf_type=" + conf_type);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求服务域或用户域预约会议列表]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求服务域或用户域预约会议列表]" + e.getMessage(), e);
		}
		return null;
	}
	/**
	 * 请求服务域正在召开的会议
	 */
	@LoadFromRedis(key = "${moid}_${count}_${conf_type}", prefix = CacheConstants.PREFIX_NMS + "getMeetings_")
	public NmsApiRequest getMeetings(String moid, Integer count, String conf_type) throws BusinessException {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/domains/" + moid + "/meetings?count=" + count + "&conf_type=" + conf_type);
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求服务域正在召开的会议]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求服务域正在召开的会议]" + e.getMessage(), e);
		}
		return null;
	}
	
	/**
	 * 请求服务域或用户域所属直播列表
	 */
	@LoadFromRedis(key = "${moid}", prefix = CacheConstants.PREFIX_NMS + "getLivesList_")
	public NmsApiRequest getLivesList(String moid) {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/domains/" + moid + "/lives");
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求服务域或用户域所属直播列表]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求服务域或用户域所属直播列表]" + e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 请求服务域或用户域所属预约直播列表
	 */
	@LoadFromRedis(key = "${moid}", prefix = CacheConstants.PREFIX_NMS + "getApLivesList_")
	public NmsApiRequest getApLivesList(String moid) {
		// 设置调用接口URL
		try {
			return sendGetToNms("/api/inner/nms/domains/" + moid + "/aplives");
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求服务域或用户域所属预约直播列表]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求服务域或用户域所属预约直播列表]" + e.getMessage(), e);
		}
		return null;
	}
	
	/**
	 * 请求域信息
	 * 
	 * @param moid
	 *            核心域、服务域的moid
	 */
	public List<NmsDomainBean> listDomains(String moid) throws BusinessException {
		// 设置调用接口URL
		try {
			NmsApiRequest result = sendGetToNms("/api/inner/nms/domains?moid=" + moid);
			//String demoJson = "{\"success\":1,\"domains\":[{\"moid\":\"mooooooo-oooo-oooo-oooo-topdoooomain\",\"parent_moid\":\"\",\"name\":\"kedacom\",\"type\":\"service\"},{\"moid\":\"mooooooo-oooo-oooo-oooo-defaultserdo\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-topdoooomain\",\"name\":\"默认服务域\",\"type\":\"service\"},{\"moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-defaultserdo\",\"name\":\"默认平台域\",\"type\":\"platform\"},{\"moid\":\"mooooooo-oooo-oooo-oooo-topplatfoorm\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-topdoooomain\",\"name\":\"核心域平台\",\"type\":\"platform\"},{\"moid\":\"mvisiomdefaultuserdomain\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"name\":\"默认用户域\",\"type\":\"user\"},{\"moid\":\"wcjak601fu3qbvmzuzu6lctm\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"name\":\"测试用户域1\",\"type\":\"user\"},{\"moid\":\"3t5jfd2iktx67afty5ne5np8\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"name\":\"ceshi\",\"type\":\"user\"},{\"moid\":\"6a1zsoi6yu92f1tt9ypdt3rx\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"name\":\"ceshi2\",\"type\":\"user\"},{\"moid\":\"tmp71ackmtgj4p7nnhht8zbh\",\"parent_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"name\":\"ceshi3\",\"type\":\"user\"}]}";
			//NmsApiRequest result = JacksonUtils.fromJsonString(demoJson, NmsApiRequest.class);
			if (null != result) {
				return result.getDomains();
			}
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), "[请求域信息]" + e.getMessage(), e);
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "[请求域信息]" + e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 获取指定域的服务器列表
	 * 
	 * @param moid
	 *            核心域、服务域或平台域moid
	 */
	public List<NmsServerBean> listPhysicals(String moid) throws BusinessException {
		List<NmsServerBean> servers = new ArrayList<NmsServerBean>();
		// 设置调用接口URL
		try {
			NmsApiRequest result = sendGetToNms("/api/inner/nms/physicals?moid=" + moid);
			//String demoJson = "{\"success\":1,\"physicals\":[{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"ed64f524-28e5-11e8-bf6e-001e675a2813\",\"name\":\"tmm\",\"type\":\"tmm\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"8ce689b6-9b99-11e8-a9b3-a4bf0119323b\",\"name\":\"vrs\",\"type\":\"vrs\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"8139ac44-a0fb-11e8-8151-a4bf0119323b\",\"name\":\"mail\",\"type\":\"mail\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"6abeb6d6-9b96-11e8-a9b3-a4bf0119323b\",\"name\":\"msg\",\"type\":\"msg\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-defaultplatf\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"333\",\"name\":\"xmpu5\",\"type\":\"xmpu5\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-topplatfoorm\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"xxxx-xxxx-xxxx-xxxx-xxx1\",\"name\":\"umm\",\"type\":\"umm\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-topplatfoorm\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"6abeb6d6-9b96-11e8-a9b3-a4bf011932s1\",\"name\":\"media-port\",\"type\":\"media-port\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-topplatfoorm\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"xxxx-xxxx-xxxx-xxxx-xxx2\",\"name\":\"dcs\",\"type\":\"dcs\"},{\"domain_moid\":\"mooooooo-oooo-oooo-oooo-topplatfoorm\",\"online\":\"online\",\"machine_room_moid\":\"mooooooo-oooo-oooo-oooo-defaultmachi\",\"moid\":\"xxxx-xxxx-xxxx-xxxx-xxx3\",\"name\":\"jd4000-h\",\"type\":\"jd4000-h\"}]}";
			//NmsApiRequest result = JacksonUtils.fromJsonString(demoJson, NmsApiRequest.class);
			if (null != result && null != result.getPhysicals() && result.getPhysicals().size() > 0) {
				List<PhysicalsVO> physicals = result.getPhysicals();
				for (int i = 0; i < physicals.size(); i++) {
					PhysicalsVO physical = physicals.get(i);
//					if (!physical.getDomain_moid().equals(moid)) {// 此demo判断临时使用根据传入平台域moid进行过滤
//						continue;
//					}
					NmsServerBean bean = new NmsServerBean();
					BeanUtils.copyProperties(physical, bean);
					bean.setDomainMoid(physical.getDomain_moid());
					bean.setMachineRoomMoid(physical.getMachine_room_moid());
					servers.add(bean);
				}
			}
		} catch (BusinessException e) {
			logger.debug("[获取指定域的服务器列表]" + e.getMessage(),e);
		} catch (Exception e) {
			logger.debug("[获取指定域的服务器列表]" + e.getMessage(),e);
		}
		return servers;
	}

	/**
	 * GET 请求网管接口
	 */
	private NmsApiRequest sendGetToNms(String url) {
		String result = null;
		try {
			result = NmsHttpClientUtils.doGetNms(configService.getNms() + url);
			
		} catch (HttpHostConnectException e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "主机地址连接失败", e);
		} catch (IOException e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "IOE异常", e);
		}
		if (StringUtils.isNotEmpty(result) && JsonUtils.isJson(result)) {
			try {
				NmsApiRequest ret = NmsApiRequest.toObject(result);
				if (null != ret) {
					if (Constants.ONE.equals(ret.getSuccess())) {
						return ret;
					} else {
						ExceptionUtil.error(MovisionError.CODE_SYS_EX, "业务处理失败 错误码:" + ret.getError_code());
					}
				} else {
					ExceptionUtil.error(MovisionError.CODE_SYS_EX, "业务处理失败");
				}
			} catch (Exception e) {
				ExceptionUtil.error(MovisionError.CODE_SYS_EX, "返回信息为空", e);
			}
		} else {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, "返回信息错误");
		}
		return null;
	}

	@SuppressWarnings("unused")
	public static void main(String[] args) {
		String ss = "{\"success\":1,\"physicals\":[{\"name\":\"UbuntuVrs1\",\"moid\":\"2bb14171-9a5f-43e9-a09d-143a78fefffa\",\"cpu\":45},{\"name\":\"UbuntuVrs2\",\"moid\":\"2bb14171-9a5f-43e9-a09d-143a78fefffb\",\"cpu\":45},{\"name\":\"UbuntuVrs3\",\"moid\":\"2bb14171-9a5f-43e9-a09d-143a78fefffc\",\"cpu\":45},{\"name\":\"UbuntuVrs4\",\"moid\":\"2bb14171-9a5f-43e9-a09d-143a78fefffd\",\"cpu\":45},{\"name\":\"UbuntuVrs5\",\"moid\":\"2bb14171-9a5f-43e9-a09d-143a78fefffe\",\"cpu\":45}]}";
		String source = "{\"success\":1,\"resource\":{\"access\":{\"ap_used\":80,\"ap_total\":100},\"media\":{\"used_h264\":25,\"total_h264\":40,\"used_h265\":5,\"total_h265\":10,\"used_vmp\":12,\"total_vmp\":20,\"used_mixer\":6,\"total_mixer\":20},\"vrs\":{\"recroomocp\":15,\"recroomtotal\":40,\"lcastocp\":6,\"lcasttotal\":30,\"html5lcastocp\":6,\"html5lcasttotal\":20},\"dcs\":{\"conf_num\":20,\"max_conf_num\":64,\"mt_num\":26,\"max_mt_num\":128},\"vmr\":{\"used_192_720\":60,\"total_192_720\":100,\"used_8_1080\":60,\"used_32_720\":60,\"used_192_1080\":60,\"total_192_1080\":100,\"total_32_1080\":100,\"used_32_1080\":60,\"total_64_720\":100,\"total_32_720\":100,\"used_64_1080\":60,\"total_8_1080\":100,\"used_8_720\":60,\"total_8_720\":100,\"used_64_720\":60,\"total_64_1080\":100}}}";
		String statistic = "{\"success\":1,\"statistic\":{\"multi\":{\"max\":15,\"min\":2,\"average\":6,\"time\":[\"2011-07-2801:53:28\",\"2011-07-2801:53\",\"2011-07-2801:53:30\"],\"values\":[12,23,24]},\"p2p\":{\"max\":15,\"min\":2,\"average\":6,\"time\":[\"2011-07-2801:53:28\",\"2011-07-2801:53\",\"2011-07-2801:53:30\"],\"values\":[12,23,24]}}}";
		String waring = "{\"success\":1,\"unrepaired_warnings\":[{\"device_name\":\"UbuntuXXX\",\"device_moid\":\"2bb14171-9a5f-43e9-a09d-143a78feffff\",\"device_type\":\"x86_server\",\"device_ip\":\"1.1.1.2\",\"machine_room_moid\":\"xxxxx\",\"machine_room_name\":\"Room1\",\"code\":2003,\"start_time\":\"2018-01-11 17:16:21\",\"title\":\"内存高于阈值\",\"description\":\"服务器内存5分钟内平均使用率超过阈值\"},{\"device_name\":\"UbuntuXXX\",\"device_moid\":\"2bb14171-9a5f-43e9-a09d-143a78feffff\",\"device_type\":\"x86_server\",\"device_ip\":\"1.1.1.2\",\"machine_room_moid\":\"xxxxx\",\"machine_room_name\":\"Room1\",\"code\":2003,\"start_time\":\"2018-01-11 17:16:21\",\"title\":\"内存高于阈值\",\"description\":\"服务器内存5分钟内平均使用率超过阈值\"},{\"device_name\":\"UbuntuXXX\",\"device_moid\":\"2bb14171-9a5f-43e9-a09d-143a78feffff\",\"device_type\":\"x86_server\",\"device_ip\":\"1.1.1.2\",\"machine_room_moid\":\"xxxxx\",\"machine_room_name\":\"Room1\",\"code\":2003,\"start_time\":\"2018-01-11 17:16:21\",\"title\":\"内存高于阈值\",\"description\":\"服务器内存5分钟内平均使用率超过阈值\"},{\"device_name\":\"UbuntuXXX\",\"device_moid\":\"2bb14171-9a5f-43e9-a09d-143a78feffff\",\"device_type\":\"x86_server\",\"device_ip\":\"1.1.1.2\",\"machine_room_moid\":\"xxxxx\",\"machine_room_name\":\"Room1\",\"code\":2003,\"start_time\":\"2018-01-11 17:16:21\",\"title\":\"内存高于阈值\",\"description\":\"服务器内存5分钟内平均使用率超过阈值\"},{\"device_name\":\"UbuntuXXX\",\"device_moid\":\"2bb14171-9a5f-43e9-a09d-143a78feffff\",\"device_type\":\"x86_server\",\"device_ip\":\"1.1.1.2\",\"machine_room_moid\":\"xxxxx\",\"machine_room_name\":\"Room1\",\"code\":2003,\"start_time\":\"2018-01-11 17:16:21\",\"title\":\"内存高于阈值\",\"description\":\"服务器内存5分钟内平均使用率超过阈值\"}]}";
		String meeting = "{\"success\":1,\"meeting\":[{\"conf_type\":1,\"name\":\"特种公司\",\"e164\":\"0001781\",\"bitrate\":1024,\"domain_moid\":\"729qq1rywt88fzuccqvbccj5\",\"start_time\":\"2011-07-28 01:53:28\",\"end_time\":\"2011-07-28 01:53:28\",\"meeting_terminals\":[{\"domain_moid\":\"729qq1rywt88fzuccqvbccj5\",\"name\":\"大客户部会议室2\",\"version\":\"\",\"type\":\"\",\"moid\":\"74a9a32e-7498-4681-9c74-3b3a9dca9036\",\"e164\":\"0512111996002\",\"ip\":\"\"}],\"telephone_terminals\":[\"17602192183\",\"18818216847\"],\"cascades\":[{\"type\":1,\"e164\":\"0001781\",\"name\":\"特种公司\"},{\"type\":0,\"e164\":\"0002694\",\"name\":\"9998880000001的会议\"}],\"ip_e164\":[\"172.16.80.46\",\"192.168.1.23\"]},{\"conf_type\":2,\"caller_name\":\"0511001000032\",\"caller_type\":\"H323n\",\"caller_e164\":\"0511001000032\",\"caller_domain_moid\":\"729qq1rywt88fzuccqvbccj5\",\"callee_name\":\"0511001000034\",\"callee_type\":\"H323n\",\"callee_e164\":\"0511001000034\",\"callee_domain_moid\":\"729qq1rywt88fzuccqvbccj5\",\"bitrate\":192,\"start_time\":\"2011-07-28 01:53:28\"},{\"conf_type\":0,\"name\":\"张家亮的会议\",\"e164\":\"0000840\",\"bitrate\":256,\"domain_moid\":\"729qq1rywt88fzuccqvbccj5\",\"start_time\":\"2011-07-28 01:53:28\",\"end_time\":\"2011-07-28 01:53:28\",\"meeting_terminals\":[{\"domain_moid\":\"729qq1rywt88fzuccqvbccj5\",\"name\":\"0512121880866\",\"version\":\"\",\"type\":\"\",\"moid\":\"5cb90b98-048f-4682-95c9-e5449930dce7\",\"e164\":\"0512121880866\",\"ip\":\"\"}],\"telephone_terminals\":[\"17602192183\",\"18818216847\"],\"cascades\":[{\"type\":1,\"e164\":\"0001781\",\"name\":\"特种公司\"},{\"type\":0,\"e164\":\"0002694\",\"name\":\"9998880000001的会议\"}],\"meeting_device\":[{\"type\":\"JD2000\",\"ip\":\"172.16.81.101\",\"mixer_count\":2,\"abas_count\":3,\"vbas_count\":1,\"vmp_count\":1}],\"ip_e164\":[\"172.16.80.46\",\"192.168.1.23\"]}]}";
		// String meetings =
		// "{\"meetings\":[{\"regular_id\":123,\"end_time\":\"2018/06/02
		// 10:18:03\",\"is_video_meeting\":0,\"id\":111,\"meeting_type\":0,\"last_modify_time\":\"2018/06/01
		// 09:18:03\",\"creator\":\"李四\",\"mobile\":\"0551234567\",\"subject\":\"5\",\"is_conflict\":0,\"telephone\":\"1555555553\",\"start_time\":\"2018/06/02
		// 09:18:03\",\"confe164\":\"05551234567\",\"organizer_moid\":\"urhvs6xfnrngawq07o3v9vto\"},{\"regular_id\":0,\"end_time\":\"2018-06-29
		// 21:00:00\",\"is_video_meeting\":1,\"id\":37,\"meeting_type\":0,\"last_modify_time\":\"2018-06-29
		// 14:56:02\",\"creator\":\"admin1\",\"mobile\":\"123123123123\",\"subject\":\"会议1\",\"is_conflict\":0,\"telephone\":\"1231\",\"start_time\":\"2018-06-29
		// 17:00:00\",\"confe164\":\"0211009\",\"organizer_moid\":\"e0cb1d49-ad46-44a6-8387-816ee299e3ab\"}],\"total\":2,\"success\":1}";
		// String meetings =
		// "{\"meetings\":[{\"regular_id\":123,\"end_time\":\"2018/06/02
		// 10:18:03\",\"is_video_meeting\":0,\"id\":111,\"rooms\":[{\"id\":111,\"name\":\"DDD\"}],\"meeting_type\":0,\"last_modify_time\":\"2018/06/01
		// 09:18:03\",\"creator\":\"李四\",\"mobile\":\"0551234567\",\"subject\":\"5\",\"is_conflict\":0,\"telephone\":\"1555555553\",\"start_time\":\"2018/06/02
		// 09:18:03\",\"confe164\":\"05551234567\",\"organizer_moid\":\"urhvs6xfnrngawq07o3v9vto\"},{\"regular_id\":0,\"end_time\":\"2018-06-29
		// 21:00:00\",\"is_video_meeting\":1,\"id\":37,\"rooms\":[{\"id\":3,\"name\":\"会议室2\"}],\"meeting_type\":0,\"last_modify_time\":\"2018-06-29
		// 14:56:02\",\"creator\":\"admin1\",\"mobile\":\"123123123123\",\"subject\":\"会议1\",\"is_conflict\":0,\"telephone\":\"1231\",\"start_time\":\"2018-06-29
		// 17:00:00\",\"confe164\":\"0211009\",\"organizer_moid\":\"e0cb1d49-ad46-44a6-8387-816ee299e3ab\"}],\"total\":2,\"success\":1}";
		String meetings = "{\"meetings\":[{\"regular_id\":123,\"end_time\":\"2018/06/02 10:18:03\",\"is_video_meeting\":0,\"meeting_resource_vo\":{\"total_count \":10,\"key\":\"xxxx\",\"used_count\":3,\"id\":123,\"multi\":8,\"name\":\"Hello\",\"resolution\":\"\"},\"id\":111,\"rooms\":[{\"id\":111,\"name\":\"DDD\"}],\"meeting_type\":0,\"last_modify_time\":\"2018/06/01 09:18:03\",\"creator\":\"李四\",\"mobile\":\"0551234567\",\"subject\":\"5\",\"is_conflict\":0,\"telephone\":\"1555555553\",\"start_time\":\"2018/06/02 09:18:03\",\"confe164\":\"05551234567\",\"organizer_moid\":\"urhvs6xfnrngawq07o3v9vto\"},{\"regular_id\":0,\"end_time\":\"2018-06-29 21:00:00\",\"is_video_meeting\":1,\"meeting_resource_vo\":{\"total_count \":0,\"key\":\"small_conference\",\"used_count\":0,\"id\":10,\"multi\":8,\"name\":\"8方\",\"resolution\":\"\"},\"id\":37,\"rooms\":[{\"id\":3,\"name\":\"会议室2\"}],\"meeting_type\":0,\"last_modify_time\":\"2018-06-29 14:56:02\",\"creator\":\"admin1\",\"mobile\":\"123123123123\",\"subject\":\"会议1\",\"is_conflict\":0,\"telephone\":\"1231\",\"start_time\":\"2018-06-29 17:00:00\",\"confe164\":\"0211009\",\"organizer_moid\":\"e0cb1d49-ad46-44a6-8387-816ee299e3ab\"}],\"total\":2,\"success\":1}";
		NmsApiRequest rec = NmsApiRequest.toObject(meetings);
		System.out.println(rec.getMeetings());

	}
}
