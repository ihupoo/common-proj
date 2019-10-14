package com.kedacom.sso.portal.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.InternalResourceView;

import com.kedacom.moooo.cache.CacheRedisUtils;
import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.utils.CookieUtils;
import com.kedacom.moooo.core.web.AjaxMessage;
import com.kedacom.moooo.sso.authentication.DigestAuthenticationEntryPoint;
import com.kedacom.moooo.sso.constants.SSOConstants;
import com.kedacom.movision.base.model.JmsConfigGuide;
import com.kedacom.movision.base.model.SecurityPolicy;
import com.kedacom.movision.base.model.UserDomainVO;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.movision.common.Constants;
import com.kedacom.movision.common.MovisionError;
import com.kedacom.movision.common.util.SecurityPolicyUtil;
import com.kedacom.movision.core.model.Message;
import com.kedacom.sso.portal.CacheConstants;
import com.kedacom.sso.portal.PortalConstants;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.service.CXFService;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.service.PasswordService;
import com.kedacom.sso.portal.service.PortalService;
import com.kedacom.sso.portal.service.VersionInfo;
import com.kedacom.sso.portal.util.DirectlyRenderUtils;
import com.kedacom.sso.portal.util.MenuContext;
import com.kedacom.sso.portal.util.TimeUtil;
import com.kedacom.sso.portal.vo.MeetingVO;
import com.kedacom.sso.portal.vo.WebUrlVO;

import net.sf.json.JSONArray;

/**
 * 首页
 */

@Controller
@RequestMapping("/")
public class IndexController {

	Logger logger = LoggerFactory.getLogger(IndexController.class);

	@Resource
	private ConfigService configService;

	@Resource
	private CXFService cxfService;

	@Resource
	private MenuContext menuContext;
	@Resource
	private VersionInfo versionInfo;
	
	@Resource
	private PortalService portalService;

	@Resource
	private PasswordService passwordService;

	@Resource
	private DigestAuthenticationEntryPoint digestAuthenticationEntryPoint;
	
	/**
	 * 跳转到主页
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "", method = RequestMethod.GET)
	public View indexDispach(HttpServletRequest request,
			HttpServletResponse response, Model model) {
		return new InternalResourceView("/home");
	}

	/**
	 * 跳转到主页
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public String index(HttpServletRequest request,
			HttpServletResponse response, ModelMap model) {
		WebUrlVO webUrl = menuContext.getUrl();
		SessionUser sessionUser = UserContext.getCurrentUser();
		String userMoid = sessionUser.getMoid();
		UserVO user = cxfService.getAmsCXFService().getAccountInfo(userMoid);
		// 如果不是当平台域的用户，重新登陆
		if (!sessionUser.getIsCurrentPlatForm()) {
			return "forward:login";
		}
		// 获取MCU配置信息
		JmsConfigGuide jmsConfigGuide = portalService.getConfigGuide();
		String jmsType = jmsConfigGuide.getJmsType();
		/*** 配置向导及许可证校验 begin ***/
		String configUrl = portalService.checkMcuConfigGuide(request, user, jmsConfigGuide);
		if (!StringUtils.isEmpty(configUrl)) {
			return "redirect:" + configUrl;
		}
		/*** 配置向导及许可证校验 end ***/
		// 获取创会url
		model.addAttribute("createMeetingUrl", portalService.getCreateMeetingUrl());
		// 平台会管业务
		if (Constants.ONE.equals(configService.getDomainType())) {
			try {
				List<MeetingVO> list = portalService.getMeetingByDateTime(user.getMoid(), new Date());
				if (null != list) {
					model.addAttribute("meetings", JSONArray.fromObject(list).toString());
				}
			} catch (Exception e) {
				logger.error("根据日期查询会议日程CXF接口异常", e.getMessage());
			}
		}
		if (null != user) {

			String pServerType = getPServerType();
			if ((user.getDefaultUserDomainAdmin() || user.getUserDomainAdmin() || user.getDefaultServiceDomainAdmin()
					|| user.getServiceDomainAdmin())
					&& PortalConstants.canRebootServerType.toLowerCase().contains(pServerType.toLowerCase())) {
				model.addAttribute("show_sh", Constants.ONE);
				List<String> allIpByServerInfo = portalService.getAllIpByServerInfo();
				if (null == allIpByServerInfo || allIpByServerInfo.size() == 0) {
					model.addAttribute("onlyCurrentIp", "127.0.0.1");
				} else if (allIpByServerInfo.size() == 1) {
					model.addAttribute("onlyCurrentIp", allIpByServerInfo.get(0));
				}
			} else {
				model.addAttribute("show_sh", Constants.ZERO);
			}

			model.addAttribute("currentuser", user);
			portalService.setPortraitDomain(user, model);
			model.addAttribute("sysmode", configService.getSystemMode());
			model.addAttribute("domaintype", configService.getDomainType());
			model.addAttribute("menu", webUrl);
			String versionYear = versionInfo.getVersionYear();
			model.addAttribute("versionYear", versionYear);
			String version = versionInfo.getVersion();
			model.addAttribute("version", version);
			model.addAttribute("SYSTEM_MODE", configService.getSystemMode());
			model.addAttribute("cloudModelInfo", portalService.getCloudModelInfo(user));

			// Vrs
			boolean vrsShow = portalService.checkVrsShow(user);
			model.addAttribute("vrsShow", vrsShow);
			model.addAttribute("vrsIP", vrsShow ? portalService.getVrsIp(request, user) : "");
			// 网呈权限
			boolean enableNexvision = portalService.getEnableNexvision(user);
			model.addAttribute("enableNexvision", enableNexvision);
			// 网呈地址
			model.addAttribute("tpsIP", enableNexvision ? portalService.getNexvisionTpsIp(request) : "");
			//kis
			model.addAttribute("kisIP",
					(null != user.getEnableKIS() && user.getEnableKIS()) ? portalService.getKisIp(request, user) : "");
			boolean isAdmin = portalService.checkUserAdminPower(user);
			String cbsShow = Constants.ZERO;
			String domsShow = Constants.ZERO;
			if(portalService.hasJdbServer()) {
				//用户为超管或单机模式下管理员可以访问CBS
				if(Constants.TOP_DEFAULT_ADMIN_MOID.equals(userMoid) || (Constants.ONE.equals(jmsType) && isAdmin)){
					cbsShow = Constants.ONE;
				}
				//用户具有DOMS权限则可以访问DOMS
				if(null!=user.getEnableDoms() && user.getEnableDoms()){
					domsShow = Constants.ONE;
				}
			}
			model.addAttribute("cbsShow", cbsShow);
			model.addAttribute("domsShow", domsShow);
			// 用户密码过期提醒
			int promotDate = portalService.getPasswordExpired(user);
			if (promotDate > -1 && portalService.hadPrompt(user, promotDate)) {
				model.addAttribute("passwordExpire", promotDate);
			}
			// JMS类型
			model.addAttribute("jmsType", jmsType);
			// 判断当前用户是否是管理员用户
			if (isAdmin) {
				model.addAttribute("isUserDomainAdmin",user.getUserDomainAdmin()||user.getDefaultUserDomainAdmin());
				model.addAttribute("isServiceDomainAdmin",user.getServiceDomainAdmin()||user.getDefaultServiceDomainAdmin());
				model.addAttribute("isUsualUser",false);
				model.addAttribute("jmsConfigGuideUrl",
						portalService.getMcuConfigGuideUrl(request, jmsConfigGuide, user));
				model.addAttribute("licenseInvalidWarn",
						CacheRedisUtils.get(CacheConstants.PREFIX_WARN_LICENSE + userMoid));
			} else {
				model.addAttribute("isUsualUser",true);
				
			}
			//注入Cookie
			model.addAttribute(SSOConstants.SSO_COOKIE_KEY,
					CookieUtils.getCookieValue(request, SSOConstants.SSO_COOKIE_KEY));

			return "home";
		}
		return "login";
	}

	private String getPServerType() {
		String pServerType = "";
		try {
			if (Constants.ONE.equals(configService.getDomainType())) {
				pServerType = cxfService.getAmsCXFService().getPServerType("portal");
			} else {
				pServerType = cxfService.getAmsCXFService().getPServerType("portalCore");
				if (!StringUtils.hasText(pServerType)) {
					pServerType = cxfService.getAmsCXFService().getPServerType("portal");
				}
			}
			if (StringUtils.hasText(pServerType) && pServerType.indexOf("-") > -1) {
				pServerType = pServerType.substring(0, pServerType.indexOf("-"));
			}
		} catch (Exception e) {
			logger.error("获取主机类似失败：" + e.getMessage());
		}
		return pServerType;
	}

	@RequestMapping(value = "/getSsoToken", method = RequestMethod.GET)
	@ResponseBody
	public AjaxMessage<String> getSsoToken(HttpServletRequest request) {
		AjaxMessage<String> msg = new AjaxMessage<String>(true, "");
		try {
			String ssoCookie = CookieUtils.getCookieValue(request, SSOConstants.SSO_COOKIE_KEY);
			msg.setData(null == ssoCookie ? "" : ssoCookie);
		} catch (Exception e) {
			logger.error(e.getMessage());
			msg.setSuccess(false);
			msg.setDescription(MovisionError.CODE_SYS_EX.text());
			msg.setErrorCode(MovisionError.CODE_SYS_EX.code());
		}
		return msg;
	}

	/**
	 * 公告板分页加载
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @param page
	 * @param pageSize
	 * @return
	 */
	@RequestMapping(value = "/getcallBoards")
	public void loadCallBoards(HttpServletRequest request,
			HttpServletResponse response, ModelMap model, Integer page,
			Integer pageSize) {
		AjaxMessage<String> msg = new AjaxMessage<String>(true, "加载成功！");
		// 加载数据
		// 数据格式-"{\"curPage\":\"1\",\"totalPage\":\"10\",[{\"title\":\"科达公告1\",\"datatime\":\"11:30-12:30\",\"state\":\"内容内容内容\"},{\"title\":\"科达公告2\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"},{\"title\":\"科达公告3\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"},{\"title\":\"科达公告4\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"},{\"title\":\"科达公告5\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"}]}";
		String result = "{\"curPage\":\"1\",\"totalPage\":\"10\",[{\"title\":\"科达公告1\",\"datatime\":\"11:30-12:30\",\"state\":\"内容内容内容\"},{\"title\":\"科达公告2\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"},{\"title\":\"科达公告3\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"},{\"title\":\"科达公告4\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"},{\"title\":\"科达公告5\",\"datatime\":\"2015-03-17 09:20\",\"state\":\"内容2内容2内容2\"}]}";
		msg.setDescription(result);
		DirectlyRenderUtils.renderJson(response, msg);
	}

	/**
	 * 跳转到企业管理中心
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/managerCenter", method = RequestMethod.GET)
	public String businessManagerCenter(HttpServletRequest request,
			HttpServletResponse response, Model model) {
		model.addAttribute("SYSTEM_MODE", configService.getSystemMode());
		return "redirect:home";

	}

	/**
	 * 修改密码界面跳转
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/resetPassword", method = RequestMethod.GET)
	public String modifyPassword(HttpServletRequest request,
			HttpServletResponse response, Model model) {
		model.addAttribute("SYSTEM_MODE", configService.getSystemMode());
		return "/resetPassword";
	}

	@RequestMapping("/set")
	public String toSet(ModelMap model) {
		try {
			UserVO user = portalService.getSessionUserVO();

			String pServerType = getPServerType();
			if ((user.getDefaultUserDomainAdmin() || user.getUserDomainAdmin() || user.getDefaultServiceDomainAdmin()
					|| user.getServiceDomainAdmin())
					&& PortalConstants.canRebootServerType.toLowerCase().contains(pServerType.toLowerCase())) {
				model.addAttribute("show_sh", Constants.ONE);
			} else {
				model.addAttribute("show_sh", Constants.ZERO);
			}

			model.addAttribute("currentuser", user);
			portalService.setPortraitDomain(user, model);
			model.addAttribute("domaintype", configService.getDomainType());
			model.addAttribute("brithday",
					user.getDateOfBirth() != null ? TimeUtil.dateTime2String(user.getDateOfBirth(), "") : "");
			String versionYear = versionInfo.getVersionYear();
			model.addAttribute("versionYear", versionYear);
			String version = versionInfo.getVersion();
			model.addAttribute("version", version);
			model.addAttribute("systemSecurity",
					StringUtils.isEmpty(user.getEncryptionPassword()) ? Constants.ZERO : Constants.ONE);
			model.addAttribute("SYSTEM_MODE", configService.getSystemMode());
			SecurityPolicy policy = cxfService.getAmsCXFService().getAccountSecurityPolicy(user.getMoid());
			model.addAttribute("securityPolicy", policy);
			model.addAttribute("strengthRegular", SecurityPolicyUtil.strengthAndRegularJSONStr);
			model.addAttribute("realmName", digestAuthenticationEntryPoint.getRealmName());
			model.addAttribute("cloudModelInfo", portalService.getCloudModelInfo(user));
			UserDomainVO userDomain = cxfService.getAmsCXFService().getUserDomainByUser(user.getMoid());
			model.addAttribute("editName", null == userDomain ? true : userDomain.getEditName());
		} catch (Exception e) {
			logger.error("path:/set error", e);
		}
		if (Constants.ZERO.equals(configService.getDomainType())) {
			return "core-set";
		} else {
			return "plat-set";
		}
	}
	
	/**
	 * 查询是否存在国密密码
	 */
	@RequestMapping(value = "/systemSecurity", method = RequestMethod.POST)
	public void getSystemSecurity(HttpServletResponse response, String username) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "操作成功");
		try {
			UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(username);
			if (null != userVO) {
				if (StringUtils.isEmpty(userVO.getEncryptionPassword())) {
					message.setData(Constants.ZERO);
				} else {
					message.setData(Constants.ONE);
				}
			} else {
				message.setData(Constants.ZERO);
				logger.error("用户信息查询失败：" + username);
				message.setSuccess(true);
			}
		} catch (BusinessException e) {
			message.setData(Constants.ZERO);
			if (logger.isDebugEnabled()) {
				logger.debug("用户信息查询失败", e);
			}
			message.setSuccess(true);
		} catch (Exception e) {
			message.setData(Constants.ZERO);
			if (logger.isDebugEnabled()) {
				logger.debug("用户信息查询失败", e);
			}
			message.setSuccess(true);
			message.setDescription("请联系系统管理员。");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

	/**
	 * 全部直播室
	 */
	@RequestMapping(value = "allLiveRooms", method = RequestMethod.GET)
	public String allLiveRooms(ModelMap model) {
		UserVO user = portalService.getSessionUserVO();
		if (null == user || (!user.getServiceDomainAdmin() && !user.getDefaultServiceDomainAdmin())) {
			return "forward:login";
		}
		model.addAttribute("currentuser", user);
		portalService.setPortraitDomain(user, model);
		model.addAttribute("cloudModelInfo", portalService.getCloudModelInfo(user));
		return "live-room";
	}

	// 系统重启
	@RequestMapping(value = "/reboot", method = RequestMethod.POST)
	public void rebootSystem(HttpServletRequest request, HttpServletResponse response, String needCheckPD,
			String needOperateIP) {
		Message<String> message = new Message<String>(true, "重启成功");
		try {
			Boolean result = passwordService.checkAdministratorPassword(needCheckPD);
			if (!result) {
				message.setSuccess(false);
				message.setDescription("密码验证失败");
			} else {
				String path = PortalConstants.shellPath + "/reboot.sh ";
				if (StringUtils.hasText(needOperateIP)) {
					path += needOperateIP;
					message.setData("reload");
				}
				Object executeLinuxCmd = portalService.executeLinuxFile(path);
				logger.info(executeLinuxCmd.toString());
			}
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("操作出现未知错误，请与系统管理员联系！");
			e.printStackTrace();
			logger.info("操作失败，" + e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	@RequestMapping(value = "/checkADPassword")
	public String checkPassword(ModelMap model) throws Exception {
		return "password-dialog";
	}

	@RequestMapping(value = "/selectPserverIP")
	public String selectPserverIP(ModelMap model, String operate) throws Exception {
		List<String> currentIps = portalService.getAllReachabledIpByServerInfo();
		List<Map<String, String>> result= new ArrayList<Map<String, String>>();
		if(null !=currentIps && currentIps.size()>0) {
			for(String s:currentIps) {
				Map<String, String> map = new HashMap<String, String>();
				map.put("value", s);
				map.put("text", s);
				result.add(map);
			}
		}
		model.addAttribute("currentIps", JSONArray.fromObject(result).toString());
		model.addAttribute("operate", "shutdown");
		return "pserverIpSelect-dialog";
	}

	@RequestMapping(value = "/checkADPassword/check")
	public void check(HttpServletResponse response, String needCheckPD) throws Exception {
		Message<String> message = new Message<String>(true, "验证成功");
		try {
			Boolean result = passwordService.checkAdministratorPassword(needCheckPD);
			if (!result) {
				message.setSuccess(false);
				message.setDescription("密码验证失败");
			}
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("操作出现未知错误，请与系统管理员联系！");
			e.printStackTrace();
			logger.info("操作失败，" + e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);
	}

	// 系统关机
	@RequestMapping(value = "/shutdown", method = RequestMethod.POST)
	public void shutdownSystem(HttpServletRequest request, HttpServletResponse response, String needCheckPD,
			String needOperateIP) {
		Message<String> message = new Message<String>(true, "关机成功");
		try {

			Boolean result = passwordService.checkAdministratorPassword(needCheckPD);
			if (!result) {
				message.setSuccess(false);
				message.setDescription("密码验证失败");
			} else {
				String path = PortalConstants.shellPath + "/shutdown.sh ";
				if (StringUtils.hasText(needOperateIP)) {
					path += needOperateIP;
					message.setData("reload");
				}
				portalService.executeLinuxFile(path);
			}
		} catch (BusinessException e) {
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("操作出现未知错误，请与系统管理员联系！");
			e.printStackTrace();
			logger.info("操作失败，" + e.getMessage());
		}
		DirectlyRenderUtils.renderJson(response, message);

	}

	@GetMapping(value = "/checkLicenseIsInvalid")
	@ResponseBody
	public Message<Integer> checkLicenseIsInvalid() {
		Message<Integer> message = new Message<Integer>(true, "成功!");
		try {
			SessionUser sessionUser = UserContext.getCurrentUser();
			UserVO user = cxfService.getAmsCXFService().getAccountInfo(sessionUser.getMoid());
			int mcuDate = portalService.getInvalidLicenseDate(user.getServiceDomainMoid());
			message.setData(mcuDate);
		} catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("操作出现未知错误，请与系统管理员联系！");
			logger.error("操作失败", e);
		}
		return message;
	}

	@PostMapping(value = "/saveLicenseWarnStatus")
	@ResponseBody
	public Message<String> saveLicenseWarnStatus() {
		Message<String> message = new Message<String>(true, "成功!");
		try {
			boolean res = portalService.saveLicenseWarnState();
			message.setSuccess(res);
			if (!res) {
				message.setDescription("保存失败！");
			}
		} catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("操作出现未知错误，请与系统管理员联系！");
			logger.error("操作失败", e);
		}
		return message;
	}

}
