package com.kedacom.sso.portal.controller;


import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.kedacom.moooo.core.utils.CookieUtils;
import com.kedacom.moooo.core.web.utils.DirectlyRenderUtils;
import com.kedacom.movision.base.model.Server;
import com.kedacom.movision.core.model.Message;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.service.ServerService;
import com.kedacom.sso.portal.util.VrsApiClient;
import com.kedacom.sso.portal.vo.VrsApiRequest;


/**
 * 录播接口调用Controller
 */

@Controller
@RequestMapping("/vrs")
public class VrsController {

	private Logger logger = LoggerFactory.getLogger(VrsController.class);

	@Resource
	private ServerService serverService;

	@Resource
	private VrsApiClient vrsApiClient;

	/**
	 * 获取vrs的登录IP地址,proxy_carrier
	 */
	@RequestMapping(value = "/getVrsIp", method = RequestMethod.GET)
	public void getVrsIp(HttpServletRequest request,
			HttpServletResponse response, ModelMap model) {
		String vrsIp = null;
		Message<String> message = new Message<String>(false, "");
		String carrier = request.getHeader("proxy_carrier");
		if (!StringUtils.isEmpty(carrier)) {
			try {
				carrier = URLDecoder.decode(carrier, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				logger.debug("运营商URL解码失败");
				logger.debug(e.getMessage());
			}
		}
		vrsIp =  getVrsIpByCarrier(carrier);
		message.setData(vrsIp);
		message.setSuccess(true);
		
		DirectlyRenderUtils.renderJson(response, message);
	}

	public String getVrsIpByCarrier(String carrier) {
		if (StringUtils.isEmpty(carrier)) {
			logger.debug("cookies中无运营商信息");
		} 
		String vrsIp = null;
		SessionUser sessionUser = UserContext.getCurrentUser();
		String userDomainMoid = sessionUser.getUser().getUserDomainMoid();
		
		if (StringUtils.isEmpty(userDomainMoid)) {
			logger.debug("用户无用户域信息");
			return vrsIp;
		}
		String vrsServerType = "vrs";
		// 先获取所有VRS信息
		List<Server> vrsServers = serverService.getVrsServers(
				vrsServerType, sessionUser.getUser().getUserDomainMoid());
		if (vrsServers != null && vrsServers.size() > 0) {
			// 根据运营商获取返回的服务器ip
			vrsIp = serverService.getVrsIP(vrsServers, carrier);
		}

		return vrsIp;
	}

	/**
	 * 名称 获取直播室列表
	 */
	@RequestMapping(value = "/getVrsLiveRoom", method = RequestMethod.GET)
	public void getVrsLiveRoom(HttpServletRequest request,
			HttpServletResponse response, String vrsIp, Integer prgs1page,
			Integer pageid, Integer orderindex, Integer desc, ModelMap model) {
		Message<VrsApiRequest> message = new Message<VrsApiRequest>(false, "");
		String token = CookieUtils.getTokenCookie(request);
		SessionUser sessionUser = UserContext.getCurrentUser();
		String userDomainMoid  = sessionUser.getUser().getUserDomainMoid();
		if (StringUtils.isEmpty(token)) {
			logger.debug("/getVrsLiveRoom：调用Vrs接口前获取token失败");
		} else if (StringUtils.isEmpty(userDomainMoid)) {
			logger.debug("/getVrsLiveRoom：调用Vrs接口前获取用户域moid为空");
		} else if (StringUtils.isEmpty(vrsIp)) {
			logger.debug("/getVrsLiveRoom：调用Vrs接口前VrsIp地址为空");
		} else {
			try {
				VrsApiRequest vrs = vrsApiClient.getVrsLiveRoom(vrsIp,
						userDomainMoid, prgs1page, pageid, orderindex, desc,
						token);
				message.setData(vrs);
				message.setSuccess(true);
			} catch (Exception e) {
				logger.debug(e.getMessage());
			}
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	/**
	 * 获取预约直播室列表
	 */
	@RequestMapping(value = "/getVrsResRoom", method = RequestMethod.GET)
	public void getVrsResRoom(HttpServletRequest request,
			HttpServletResponse response, String vrsIp, Integer prgs1page,
			Integer pageid, ModelMap model) {
		Message<VrsApiRequest> message = new Message<VrsApiRequest>(false, "");
		String token = CookieUtils.getTokenCookie(request);
		SessionUser sessionUser = UserContext.getCurrentUser();
		String userDomainMoid = sessionUser.getUser().getUserDomainMoid();
		if (StringUtils.isEmpty(token)) {
			logger.debug("/getVrsResRoom：调用Vrs接口前获取token失败");
		} else if (StringUtils.isEmpty(userDomainMoid)) {
			logger.debug("/getVrsResRoom：调用Vrs接口前获取用户域moid为空");
		} else if (StringUtils.isEmpty(vrsIp)) {
			logger.debug("/getVrsResRoom：调用Vrs接口前VrsIp地址为空");
		} else {
			try {
				VrsApiRequest vrs = vrsApiClient.getVrsResRoom(vrsIp,
						userDomainMoid, prgs1page, pageid,
						token);
				message.setData(vrs);
				message.setSuccess(true);
			} catch (Exception e) {
				logger.debug(e.getMessage());
			}
		}
		DirectlyRenderUtils.renderJson(response, message);

	}
}
