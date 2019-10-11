package com.kedacom.sso.portal.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.web.AjaxMessage;
import com.kedacom.movision.common.MovisionError;
import com.kedacom.movision.core.vo.EasyUiTreeNode;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.service.ServerService;
import com.kedacom.sso.portal.service.UserService;

/**
 * 个性化配置
 * 
 * @author ranran.ye
 * @date 2018年10月17日
 */
@Controller
@RequestMapping("/custom")
public class CustomController {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Resource
	private UserService userService;
	@Resource
	private ServerService serverService;

	/**
	 * 查询用户自定义配置
	 * 
	 */
	@RequestMapping(value = "/personalSetting", method = RequestMethod.GET)
	@ResponseBody
	public AjaxMessage<Map<String, String>> getPersonalSetting() {
		AjaxMessage<Map<String, String>> message = new AjaxMessage<Map<String, String>>(true, "查询成功！");
		try {
			SessionUser sessionUser = UserContext.getCurrentUser();
			Map<String, String> data = userService.getPersonalSetting(sessionUser.getMoid());
			if (null == data) {
				data = new HashMap<String, String>();
			}
			message.setData(data);
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setErrorCode(e.getCode());
			message.setDescription(e.getMessage());
			if (logger.isDebugEnabled()) {
				logger.debug("查询用户自定义配置失败", e);
			}
		} catch (Exception e) {
			message.setSuccess(false);
			message.setErrorCode(MovisionError.CODE_SYS_EX.code());
			message.setDescription(e.getMessage());
			logger.error("查询用户自定义配置失败", e);
		}
		return message;
	}

	/**
	 * 保存用户自定义配置
	 * 
	 */
	@RequestMapping(value = "/personalSetting", method = RequestMethod.POST)
	@ResponseBody
	public AjaxMessage<Object> setPersonalSetting(@RequestParam("type") String type,
			@RequestParam("value") String value) {
		AjaxMessage<Object> message = new AjaxMessage<Object>(true, "保存成功！");
		try {
			SessionUser sessionUser = UserContext.getCurrentUser();
			userService.updatePersonalSetting(sessionUser.getMoid(), type, value);
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setErrorCode(e.getCode());
			message.setDescription(e.getMessage());
			if (logger.isDebugEnabled()) {
				logger.debug("保存用户自定义配置失败", e);
			}
		} catch (Exception e) {
			message.setSuccess(false);
			message.setErrorCode(MovisionError.CODE_SYS_EX.code());
			message.setDescription(e.getMessage());
			logger.error("保存用户自定义配置失败", e);
		}
		return message;
	}

	/**
	 * 查询用户自定义服务器列表
	 * 
	 */
	@RequestMapping(value = "/personalPhysicalServer", method = RequestMethod.GET)
	@ResponseBody
	public AjaxMessage<List<String>> getPersonalPhysicalServer(@RequestParam("type") String type) {
		AjaxMessage<List<String>> message = new AjaxMessage<List<String>>(true, "查询成功！");
		try {
			SessionUser sessionUser = UserContext.getCurrentUser();
			List<String> servers = serverService.getPersonalPhysicalServer(sessionUser.getMoid(), type);
			if (null == servers) {
				servers = new ArrayList<String>();
			}
			message.setData(servers);
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setErrorCode(e.getCode());
			message.setDescription(e.getMessage());
			if (logger.isDebugEnabled()) {
				logger.debug("查询用户自定义服务器列表失败", e);
			}
		} catch (Exception e) {
			message.setSuccess(false);
			message.setErrorCode(MovisionError.CODE_SYS_EX.code());
			message.setDescription(e.getMessage());
			logger.error("查询用户自定义服务器列表失败", e);
		}
		return message;
	}

	/**
	 * 保存用户自定义服务器列表
	 * 
	 */
	@RequestMapping(value = "/personalPhysicalServer", method = RequestMethod.POST)
	@ResponseBody
	public AjaxMessage<Object> setPersonalPhysicalServer(@RequestParam("type") String type,
			@RequestParam("servers") String servers) {
		AjaxMessage<Object> message = new AjaxMessage<Object>(true, "保存成功！");
		try {
			SessionUser sessionUser = UserContext.getCurrentUser();
			userService.savePersonalPhysicalServer(sessionUser.getMoid(), type, servers);
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setErrorCode(e.getCode());
			message.setDescription(e.getMessage());
			if (logger.isDebugEnabled()) {
				logger.debug("保存用户自定义配置失败", e);
			}
		} catch (Exception e) {
			message.setSuccess(false);
			message.setErrorCode(MovisionError.CODE_SYS_EX.code());
			message.setDescription(e.getMessage());
			logger.error("保存用户自定义配置失败", e);
		}
		return message;
	}

	/**
	 * 查询物理服务器待选列表
	 * 
	 */
	@RequestMapping(value = "/physicalServerTree", method = RequestMethod.GET)
	@ResponseBody
	public AjaxMessage<List<EasyUiTreeNode>> getPhysicalServerTree(@RequestParam("type") String type) {
		AjaxMessage<List<EasyUiTreeNode>> message = new AjaxMessage<List<EasyUiTreeNode>>(true, "查询成功！");
		try {
			SessionUser sessionUser = UserContext.getCurrentUser();
			message.setData(serverService.getPhysicalServerTree(sessionUser.getUserMoid(), type));
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setErrorCode(e.getCode());
			message.setDescription(e.getMessage());
			if (logger.isDebugEnabled()) {
				logger.debug("查询物理服务器待选列表失败", e);
			}
		} catch (Exception e) {
			message.setSuccess(false);
			message.setErrorCode(MovisionError.CODE_SYS_EX.code());
			message.setDescription(e.getMessage());
			logger.error("查询物理服务器待选列表失败", e);
		}
		return message;
	}
	
	/**
	 * 跳转个性化设置弹出框
	 */
	@RequestMapping(value = "/physicalServerSetting", method = RequestMethod.GET)
	public String settingDialogPage() {
		return "/dialog/selectPersonalServers";
	}
}
