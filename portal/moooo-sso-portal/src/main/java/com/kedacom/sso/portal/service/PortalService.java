package com.kedacom.sso.portal.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;

import com.kedacom.moooo.cache.CacheRedisUtils;
import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.http.utils.HttpClientUtils;
import com.kedacom.moooo.core.http.utils.ProxyUtil;
import com.kedacom.moooo.core.utils.CollectionUtils;
import com.kedacom.moooo.core.utils.JacksonUtils;
import com.kedacom.moooo.core.web.AjaxMessage;
import com.kedacom.movision.base.constant.ServerConstants;
import com.kedacom.movision.base.model.CloudModelInfo;
import com.kedacom.movision.base.model.JmsConfigGuide;
import com.kedacom.movision.base.model.PlatformDomain;
import com.kedacom.movision.base.model.SecurityPolicy;
import com.kedacom.movision.base.model.Server;
import com.kedacom.movision.base.model.UserDomainVO;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.movision.common.Constants;
import com.kedacom.movision.common.MovisionError;
import com.kedacom.movision.common.util.ExceptionUtil;
import com.kedacom.movision.common.util.SimpleHttpClientUtil;
import com.kedacom.movision.core.util.StringUtil;
import com.kedacom.sso.portal.CacheConstants;
import com.kedacom.sso.portal.PortalConstants;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.util.ServerInfo;
import com.kedacom.sso.portal.vo.ErrorCode;
import com.kedacom.sso.portal.vo.MeetingVO;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.DomDriver;
import com.thoughtworks.xstream.io.xml.XmlFriendlyNameCoder;

/**
 * 响应门户页面各请求
 * @author luocanfeng
 * @date 2014-7-16
 */
@Service
public class PortalService {

	private static final String PORTAL_ACCOUNT_TOKEN = "PORTAL_ACCOUNT_TOKEN";

	private static final String PORTAL_ACCOUNT_PROPTDATE_ = "PORTAL_ACCOUNT_PROPTDATE_";

	private static final String DEFAULT_SJMS_GUIDE_URI = "/jms/config/entrance";

	private static final String DEFAULT_JMS_GUIDE_URI = "/luban/guide";

	// private static final String PORTAL_JMS_GUIDE_URI = "/jmsConfig";

	private static final String PORTAL_CORE_HOME_URI = "/portalCore/home";

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Resource
	private ConfigService configService;

	@Resource
	private CXFService cxfService;

	@Resource
	private ServerService serverService;

	@Resource
	private MeetingService meetingService;

	@Resource
	private ServerInfo serverInfo;

	/**
	 * 获取当前登录用户信息
	 */
	public UserVO getSessionUserVO() {
		SessionUser sessionUser = UserContext.getCurrentUser();
		if (null == sessionUser || StringUtils.isEmpty(sessionUser.getMoid())) {
			return null;
		}
		return cxfService.getAmsCXFService().getAccountInfo(sessionUser.getMoid());
	}

	/**
	 * 配置向导及许可证校验
	 */
	public String checkMcuConfigGuide(HttpServletRequest request, UserVO user, JmsConfigGuide jmsConfigGuide) {
		try {
			if (Constants.DEBUGGER_MOID.equals(user.getMoid())) { // 调试者账号屏蔽首次向导
				return null;
			}
			String baseUrl = request.getRequestURL().toString().replace(request.getRequestURI(), "");
			/*** 校验首次许可证导入及首次配置向导 **/
			if (Constants.ONE.equals(jmsConfigGuide.getJmsType())// 一体机场景
					|| Constants.ZERO.equals(configService.getDomainType())) {// 核心域门户
				// 向导校验
				if (!Constants.ONE.equals(jmsConfigGuide.getConfigureSuccess())) {
					if (!cxfService.getAmsCXFService().hasMachineRoomLicense()
							&& !StringUtils.isEmpty(jmsConfigGuide.getLicenseUrl())) {
						return baseUrl + jmsConfigGuide.getLicenseUrl();
					} else if (Constants.ONE.equals(jmsConfigGuide.getJmsType())) {// 非通用模式
						return baseUrl + jmsConfigGuide.getSguideUrl();// 简单JMS设置向导入口
					} else {
						return baseUrl + jmsConfigGuide.getGuideUrl();// JMS向导页
					}
				}
			}
			/*** 处理核心域账号下发到AP后，通过平台门户登陆后，无平台相关权限导致入口不存在问题 **/
			if (!Constants.ONE.equals(jmsConfigGuide.getDeployType())
					&& Constants.ONE.equals(configService.getDomainType())) {// 非单机环境,访问平台门户
				if (StringUtils.isEmpty(user.getUserDomainMoid())) {// 未绑定用户域的账号不允许登陆平台门户
					return baseUrl + PORTAL_CORE_HOME_URI;// 跳转到核心域门户
				}
			}
		} catch (Exception e) {
			logger.error("门户配置向导验证异常", e.getMessage());
		}
		return null;
	}

	/**
	 * 获取MCU配置信息
	 */
	public JmsConfigGuide getConfigGuide() {
		JmsConfigGuide jmsConfigGuide = null;
		try {
			jmsConfigGuide = cxfService.getJmsCXFService().getConfigGuide();
		} catch (Exception e) {
			logger.error("门户配置向导验证CXF接口异常", e.getMessage());
		}
		if (null == jmsConfigGuide) {
			jmsConfigGuide = new JmsConfigGuide();
			jmsConfigGuide.setConfigureSuccess(Constants.ONE);
		}
		if (StringUtils.isEmpty(jmsConfigGuide.getDeployType())) {
			jmsConfigGuide.setDeployType(Constants.ZERO);
		}
		if (StringUtils.isEmpty(jmsConfigGuide.getSguideUrl())) {
			jmsConfigGuide.setSguideUrl(DEFAULT_SJMS_GUIDE_URI);
		}
		if (StringUtils.isEmpty(jmsConfigGuide.getGuideUrl())) {
			jmsConfigGuide.setGuideUrl(DEFAULT_JMS_GUIDE_URI);
		}
		if (logger.isDebugEnabled()) {
			logger.debug("jms config guide : " + JSONObject.fromObject(jmsConfigGuide).toString());
		}
		return jmsConfigGuide;
	}

	/**
	 * 获取云模式
	 */
	public JSONArray getCloudModelInfo(UserVO user) {
		JSONArray cloudModelInfo = new JSONArray();
		if (null != user && user.getCloudModelDisplay() != null) {
			if (user.getCloudModelDisplay()) {// 公有云私有云
				try {
					List<CloudModelInfo> cloudModelInfoList = cxfService.getAmsCXFService().listAllCloudModel(
							user.getUserDomainMoid());
					cloudModelInfo = JSONArray.fromObject(cloudModelInfoList);
				} catch (Exception e) {
					logger.error("云模式获取失败", e);
				}
			}
		}
		if (null == cloudModelInfo) {
			cloudModelInfo = new JSONArray();
		}
		return cloudModelInfo;
	}

	/**
	 * 密码是否即将过期
	 */
	public int getPasswordExpired(UserVO user) {
		int[] promptDates = PortalConstants.allPromptDates;
		// 用户密码过期提醒
		int promptDate = -1;
		if (null != user.getUpdatePasswordDateTime()) {
			try {
				com.kedacom.platform.cxf.model.UserVOForSSO usercxf = cxfService.getAmsCXFService()
						.getAccountInfoForSSO(user.getMoid());
				if (null != usercxf && null != usercxf.getSecurityPolicy()) {
					SecurityPolicy securityPolicy = usercxf.getSecurityPolicy();
					if (null != securityPolicy.getEnableUpdateCycle() && securityPolicy.getEnableUpdateCycle()) {
						Integer days = securityPolicy.getExpireIn();
						if (null == days) {
							days = 0;
						}
						Calendar promptTime = Calendar.getInstance();
						Calendar nowTime = Calendar.getInstance();
						nowTime.setTime(new Date());

						for (int i : promptDates) {
							promptTime.setTime(usercxf.getUpdatePasswordDateTime());
							promptTime.add(Calendar.DAY_OF_YEAR, days - i);
							if (nowTime.get(Calendar.YEAR) == promptTime.get(Calendar.YEAR)
									&& nowTime.get(Calendar.MONTH) == promptTime.get(Calendar.MONTH)
									&& nowTime.get(Calendar.DAY_OF_MONTH) == promptTime.get(Calendar.DAY_OF_MONTH)) {
								promptDate = i;
								break;
							}
						}

						return promptDate;
					}
				}
			} catch (Exception e) {
				logger.error("用户密码有效期提醒处理异常", e);
			}
		}
		return promptDate;
	}

	/**
	 * 是否提示密码有效期
	 */
	public boolean hadPrompt(UserVO user, int date) {
		int[] promptDates = PortalConstants.onePromptDates;
		boolean hadPrompt = true;
		// 用户密码过期提醒
		if (null != user.getUpdatePasswordDateTime()) {
			try {
				com.kedacom.platform.cxf.model.UserVOForSSO usercxf = cxfService.getAmsCXFService()
						.getAccountInfoForSSO(user.getMoid());
				if (null != usercxf && null != usercxf.getSecurityPolicy()) {
					for (int i : promptDates) {
						if (i == date) {
							Integer hadPromptdDate = (Integer) CacheRedisUtils.get(PORTAL_ACCOUNT_PROPTDATE_
									+ user.getMoid());
							if (hadPromptdDate != null && date == hadPromptdDate) {
								hadPrompt = false;
							} else {
								// 缓存一天
								CacheRedisUtils.cache(PORTAL_ACCOUNT_PROPTDATE_ + user.getMoid(), 86400, date);
								hadPrompt = true;
							}
							break;
						}
					}
				}
			} catch (Exception e) {
				logger.error("用户密码有效期提醒处理异常", e);
			}
		}
		return hadPrompt;
	}

	/**
	 * 判断是否为管理员
	 */
	public boolean checkUserAdminPower(UserVO user) {
		boolean isTopAdmin = Constants.TOP_DEFAULT_ADMIN_MOID.equals(user.getMoid());
		// 判断当前用户是否是管理员用户
		return (isTopAdmin || user.getServiceDomainAdmin() || user.getDefaultServiceDomainAdmin()
				|| user.getDefaultUserDomainAdmin() || user.getUserDomainAdmin());
	}

	/**
	 * 获取用户网呈权限
	 */
	public boolean getEnableNexvision(UserVO user) {
		if (user.getUserDomainAdmin()) {// 网呈权限
			UserDomainVO userDomain;
			try {
				userDomain = cxfService.getAmsCXFService().getUserDomainInfo(user.getUserDomainMoid());
				return userDomain.getEnableNexvision();
			} catch (Exception e) {
				logger.error("网呈权限获取异常", e);
			}
		}
		return false;
	}

	/**
	 * 获取网呈ip地址
	 */
	public String getNexvisionTpsIp(HttpServletRequest request) {
		String tpsIP = "";
		try {
			tpsIP = getTpsIp(request);
			tpsIP = tpsIP == null ? "" : tpsIP;
		} catch (Exception e) {
			logger.error("网呈ip获取异常", e);
		}
		return tpsIP;
	}

	/**
	 * 获取网呈ip地址
	 */
	private String getTpsIp(HttpServletRequest request) {
		String tpsIp = null;
		SessionUser sessionUser = UserContext.getCurrentUser();
		String userDomainMoid = sessionUser.getUser().getUserDomainMoid();
		// 获取TPS的运营商
		String carrier = request.getHeader("proxy_carrier");
		if (!StringUtils.isEmpty(carrier)) {
			try {
				carrier = URLDecoder.decode(carrier, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				logger.error("运营商URL解码失败");
				e.printStackTrace();
			}
		}
		if (StringUtils.isEmpty(carrier)) {
			logger.error("cookies中无运营商信息");
		}
		if (StringUtils.isEmpty(userDomainMoid)) {
			logger.error("用户无用户域信息");
			return tpsIp;
		}
		String tpsServerType = ServerConstants.TMM;
		// 先获取所有TPS信息
		List<Server> tpsServers = serverService.getVrsServers(tpsServerType, sessionUser.getUser().getUserDomainMoid());
		if (tpsServers != null && tpsServers.size() > 0) {
			// 根据运营商获取返回的服务器ip
			tpsIp = serverService.getTpsIP(tpsServers.get(0), carrier);
		}
		return tpsIp;
	}

	/**
	 * 录播展示
	 */
	public boolean checkVrsShow(UserVO user) {
		if (StringUtil.isNotNullString(user.getUserDomainMoid())) {
			List<Server> servers = cxfService.getAmsCXFService().listVRSServerByUserDomain(ServerConstants.VRS,
					user.getUserDomainMoid());
			if (!CollectionUtils.isEmpty(servers)) {
				for (Server server : servers) {
					// 判断vrs服务是不是sso模式
					if (Constants.TWO.equals(server.getMode())) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * 录播地址
	 */
	public String getVrsIp(HttpServletRequest request, UserVO user) {
		String vrsIP = "";
		try {
			if (null != user.getEnableVRS() && user.getEnableVRS()) {
				String carrier = request.getHeader("proxy_carrier");
				if (!StringUtils.isEmpty(carrier)) {
					try {
						carrier = URLDecoder.decode(carrier, "UTF-8");
					} catch (UnsupportedEncodingException e) {
						logger.error("运营商URL解码失败");
						e.printStackTrace();
					}
				}
				vrsIP = cxfService.getAmsCXFService().getVrsIpByCarrier(user.getUserDomainMoid(), carrier);
				vrsIP = vrsIP == null ? "" : vrsIP;
			}
		} catch (Exception e) {
			logger.error("录播地址获取异常", e);
		}
		return vrsIP;
	}

	/**
	 * KIS地址
	 */
	public String getKisIp(HttpServletRequest request, UserVO user) {
		String kisIP = "";
		try {
			if (null != user.getEnableKIS() && user.getEnableKIS()) {
				String carrier = request.getHeader("proxy_carrier");
				if (!StringUtils.isEmpty(carrier)) {
					try {
						carrier = URLDecoder.decode(carrier, "UTF-8");
					} catch (UnsupportedEncodingException e) {
						logger.error("运营商URL解码失败", e);
					}
				}
				kisIP = cxfService.getAmsCXFService().getKisIpByCarrier(user.getUserDomainMoid(), carrier);
				kisIP = kisIP == null ? "" : kisIP;
			}
		} catch (Exception e) {
			logger.error("KIS地址获取异常", e);
		}
		return kisIP;
	}

	public String getCreateMeetingUrl() {
		String createMeetingUrl = configService.getMeeting();// 创建会议的url
		return createMeetingUrl.substring(0, createMeetingUrl.indexOf("home")) + "meeting/create";
	}

	public List<MeetingVO> getMeetingByDateTime(String moid, Date date) {
		try {
			return meetingService.getMeetingByDateTime(moid, date);
		} catch (Exception e) {
			logger.error("根据日期查询会议日程CXF接口异常", e.getMessage());
			return new ArrayList<MeetingVO>();
		}
	}

	/**
	 * 是否有MCU设置向导权限
	 */
	public String getMcuConfigGuideUrl(HttpServletRequest request, JmsConfigGuide jmsConfigGuide, UserVO user) {
		boolean checkMcuConfigGuide = false;
		if (null != jmsConfigGuide && null != user) {
			if (Constants.ONE.equals(jmsConfigGuide.getJmsType())) {// 简单JMS环境下才有向导权限
				if (Constants.ONE.equals(jmsConfigGuide.getDeployType())) {// 单机模式用户域管理员
					if (null != user.getUserDomainAdmin() && user.getUserDomainAdmin()) {
						checkMcuConfigGuide = true;
					}
				} else {// 多机模式超级管理员
					checkMcuConfigGuide = Constants.TOP_DEFAULT_ADMIN_MOID.equals(user.getMoid());
				}
			}
		}
		if (checkMcuConfigGuide) {
			return jmsConfigGuide.getSguideUrl();
		} else {
			return "";
		}
	}

	/**
	 * post请求APICORE执行更新操作
	 */
	public Object postToApiCore(String url, Map<String, String> params) {
		return sendRequestToPublicApi("POST", url, params, 0);
	}

	/**
	 * get请求APICORE执行查询操作
	 */
	public Object getToApiCore(String url) {
		return sendRequestToPublicApi("GET", url, null, 0);
	}

	/**
	 * 发送请求至核心域API
	 * @param method POST/GET
	 * @param url 请求uri
	 * @param params post请求时需要入参
	 * @param deep 迭代层级限制，最高3层
	 */
	@SuppressWarnings("unchecked")
	private Object sendRequestToPublicApi(String method, String url, Map<String, String> params, int deep) {
		try {
			if (StringUtils.isEmpty(configService.getApiCoreUrl())) {
				ExceptionUtil.error(MovisionError.PARAMS_EMPTY, "核心域API地址为空");
			}
			String accountToken = (String) CacheRedisUtils.get(PORTAL_ACCOUNT_TOKEN);
			if (logger.isDebugEnabled()) {
				logger.debug("Cache.get('{}', {});", PORTAL_ACCOUNT_TOKEN, accountToken);
			}
			if (StringUtils.isEmpty(accountToken)) {// 重新获取token
				accountToken = initAccountToken();
			}
			String uri = configService.getApiCoreUrl() + url;
			String jsonString = null;
			if ("POST".equals(method)) {
				params.put("account_token", accountToken);
				jsonString = SimpleHttpClientUtil.doPostJson(uri, params);
			} else {
				if (!StringUtils.isEmpty(url) && url.indexOf("?") != -1) {
					uri += "&account_token=" + accountToken;
				} else if (!StringUtils.isEmpty(url)) {
					uri += "?account_token=" + accountToken;
				}
				jsonString = SimpleHttpClientUtil.doGetJson(uri);
			}
			if (!StringUtils.isEmpty(jsonString)) {
				if (jsonString.indexOf("<errorCode>") != -1) {
					final XStream xStream = new XStream(new DomDriver("UTF-8", new XmlFriendlyNameCoder("$", "_")));
					xStream.alias("errorCode", ErrorCode.class);
					ErrorCode errorCode = (ErrorCode) xStream.fromXML(jsonString);
					if (null != errorCode) {
						if ("10002".equals(errorCode.getCode())) {// accountToken失效
							if (deep++ > 3) {
								ExceptionUtil.error(errorCode.getCode(),
										errorCode.getRequest() + ":" + errorCode.getError());
							}
							initAccountToken();
							Thread.sleep(500);
							return sendRequestToPublicApi(method, url, params, deep);
						} else {
							ExceptionUtil.error(errorCode.getCode(),
									errorCode.getRequest() + ":" + errorCode.getError());
						}
					} else {
						ExceptionUtil.error(MovisionError.PARAMS_EMPTY, "返回异常信息为空");
					}
				} else {
					AjaxMessage<Object> message = new AjaxMessage<Object>();
					message = JacksonUtils.getJsonConvertWithoutNull().fromJsonString(jsonString, message.getClass());
					if (null != message && message.getSuccess()) {
						return message.getData();
					} else {
						ExceptionUtil.error(message.getErrorCode(), message.getDescription());
					}
				}
			} else {
				ExceptionUtil.error(MovisionError.PARAMS_EMPTY, "返回报文为空");
			}
		} catch (BusinessException e) {
			ExceptionUtil.error(e.getCode(), e.getMessage());
		} catch (Exception e) {
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, e);
		}
		return null;
	}

	/**
	 * 初始化apiCore accountToken
	 * @param url
	 */
	private String initAccountToken() {
		String accountToken = null;
		try {
			if (StringUtils.isEmpty(configService.getApiCoreUrl())) {
				ExceptionUtil.error(MovisionError.PARAMS_EMPTY, "核心域API地址为空");
			}
			Map<String, String> params = new HashMap<String, String>();
			params.put("oauth_consumer_key", "PlatformDomain");
			params.put("oauth_consumer_secret", "12345678");
			String xml = HttpClientUtils.doPost(configService.getApiCoreUrl() + "/accountToken", params).getResponse();
			if (!StringUtils.isEmpty(xml) && xml.indexOf("accountToken") != -1) {
				accountToken = ProxyUtil.getContentFromXml(xml.toString(), "accountToken", 0);
				if (!StringUtils.isEmpty(accountToken)) {
					CacheRedisUtils.cache(PORTAL_ACCOUNT_TOKEN, 1700, accountToken);
					if (logger.isDebugEnabled()) {
						logger.debug("Cache.set('{}', {}, {});", PORTAL_ACCOUNT_TOKEN, accountToken, 1700);
					}
				}
			}
		} catch (BusinessException e) {
			logger.error("initAccountToken error", e);
			ExceptionUtil.error(e.getCode(), e.getMessage());
		} catch (Exception e) {
			logger.error("initAccountToken error", e);
			ExceptionUtil.error(MovisionError.CODE_SYS_EX, e);
		}
		return accountToken;
	}

	/**
	 * 请求apicore检查是否存在JDB服务器
	 * @return 布尔值
	 */
	public boolean hasJdbServer() {
		try {
			Object result = getToApiCore("/mcu/checkJdbServer");
			if (null != result && Constants.ONE.equals(result.toString())) {
				return true;
			}
		} catch (Exception e) {
			logger.error("查询JDB服务器异常：" + e.getMessage());
		}
		return false;
	}

	/**
	 * 执行linux单命令，并返回结果。
	 * @param cmd
	 * @return
	 */
	public Object executeLinuxCmd(String cmd) {
		try {
			logger.info(cmd + "start");
			String[] cmdA = {
					"/bin/sh", "-c", cmd
			};
			Process process = Runtime.getRuntime().exec(cmdA);
			LineNumberReader br = new LineNumberReader(new InputStreamReader(process.getInputStream()));
			LineNumberReader brError = new LineNumberReader(new InputStreamReader(process.getErrorStream()));
			StringBuffer sb = new StringBuffer();
			String line;
			while ((line = br.readLine()) != null) {
				sb.append(line).append("\n");
			}
			StringBuffer sbError = new StringBuffer();
			while ((line = brError.readLine()) != null) {
				sbError.append(line).append("\n");
			}
			logger.info("ll-sb:" + sb.toString());
			logger.info("ll-sbError:" + sbError.toString());
			logger.info(cmd + "end");
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public int executeLinuxFile(String path) throws Exception {
		String cmdString = "chmod +x " + path;
		// 文件权限设置
		Runtime.getRuntime().exec(cmdString);
		// 执行文件脚本
		Process psCmd = Runtime.getRuntime().exec(path);
		logger.info("export config file: cmd=" + cmdString);
		BufferedReader br = new BufferedReader(new InputStreamReader(psCmd.getInputStream()));
		LineNumberReader brError = new LineNumberReader(new InputStreamReader(psCmd.getErrorStream()));
		StringBuffer sb = new StringBuffer();
		String line;
		while ((line = br.readLine()) != null) {
			sb.append(line).append("\n");
		}
		StringBuffer sbError = new StringBuffer();
		while ((line = brError.readLine()) != null) {
			sbError.append(line).append("\n");
		}
		logger.info("ll-sb:" + sb.toString());
		logger.info("ll-sbError:" + sbError.toString());
		int exitValue = psCmd.waitFor();
		if (StringUtils.hasText(sb.toString())) {
			logger.info("export config file:" + sb.toString() + " exitValue=" + exitValue);
		}
		if (StringUtils.hasText(sbError.toString())) {
			logger.info("export config file error:" + sbError.toString() + " exitValue=" + exitValue);
			ExceptionUtil.error("执行错误：" + sbError.toString());
		}
		return exitValue;
	}

	/**
	 * 执行linux单命令，并返回结果。
	 * @param cmd
	 * @return
	 */
	public String getIpByLinuxCmd() {
		try {
			String[] cmdA = {
					"/bin/sh", "-c", "ifconfig"
			};
			Process process = Runtime.getRuntime().exec(cmdA);
			LineNumberReader br = new LineNumberReader(new InputStreamReader(process.getInputStream()));
			String line;
			boolean flag = false;
			Pattern pattern = Pattern
					.compile("^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)$");
			while ((line = br.readLine()) != null) {
				if (line.indexOf("eth0:") > -1 && line.indexOf("flags") > -1) {
					flag = true;
					continue;
				} else if (line.indexOf("flags") > -1) {
					flag = false;
				}
				if (flag) {
					if (line.indexOf("inet") > -1 && line.indexOf("secondary") == -1) {
						String[] split = line.split(" ");
						if (split != null && split.length > 0) {
							for (String s : split) {
								Matcher matcher = pattern.matcher(s);
								if (matcher.find()) {
									return s;
								}
							}
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取可ping通的集群机器ip
	 * @param cmd
	 * @return
	 */
	public List<String> getAllReachabledIpByServerInfo() {
		List<String> list = getAllIpByServerInfo();
		if (null != list && list.size() > 0) {
			Iterator<String> iterator = list.iterator();
			while (iterator.hasNext()) {
				String ip = iterator.next();
				try {
					InetAddress address = InetAddress.getByName(ip);
					if (!address.isReachable(2000)) {// 判断指点ip是否可ping同。
						iterator.remove();
					}
				} catch (IOException e) {
					logger.error(e.getMessage());
					iterator.remove();
				}
			}
		}
		return list;
	}

	/**
	 * 获取可ping通的集群机器ip
	 * @param cmd
	 * @return
	 */
	public List<String> getAllIpByServerInfo() {
		List<String> list = cxfService.getAmsCXFService().getAllPServerIp(
				Constants.ZERO.equals(serverInfo.getDomainType()) ? "portalCore" : "portal");
		return list;
	}

	/**
	 * 请求apicore检查是否支持端口会议
	 * @return 是否支持端口会议
	 */
	public boolean checkSupportPortMeeting(String moid, String type) {
		try {
			Map<String, String> params = new HashMap<String, String>();
			params.put("moid", moid);
			params.put("type", type);
			Object result = postToApiCore("/mcu/checkSupportPortMeeting", params);
			if (null != result && Constants.ONE.equals(result.toString())) {
				return true;
			}
		} catch (Exception e) {
			logger.error("查询是否支持端口会议异常: {}", e.getMessage());
		}
		return false;
	}

	/**
	 * 获取无效的证书信息
	 * @return 小于0-没有无效的证书; 等于0-没有证书; 大于0-证书因为异常还剩几天到期
	 */
	public int getInvalidLicenseDate(String serviceDomainMoid) {
		int result = -1;
		try {
			Map<String, String> params = new HashMap<String, String>();
			params.put("serviceDomainMoid", serviceDomainMoid);
			@SuppressWarnings("unchecked")
			List<LinkedHashMap<String, Object>> licenseList = (List<LinkedHashMap<String, Object>>) postToApiCore(
					"/bmc/getInvalidLicense", params);
			if (null == licenseList) {
				logger.error("查询证书有效性异常：结果为空");
			} else if (licenseList.isEmpty()) { // 没有证书
				result = 0;
			} else {
				int dayCount = 0;
				for (LinkedHashMap<String, Object> license : licenseList) {
					try {
						int days = Integer.parseInt((String) license.get(PortalConstants.LICENSE_FIELD_MCUDATE));
						if (days > dayCount) {
							dayCount = days;
						}
					} catch (NumberFormatException e) {
						logger.error("查询证书有效性异常，异常天数格式不正确：{}", e.getMessage());
					}
				}
				if (dayCount > 0) {
					logger.info("证书已异常{}天 ", dayCount);
					result = dayCount;
				}
			}
		} catch (Exception e) {
			logger.error("查询证书有效性异常", e);
		}
		return result;
	}

	/**
	 * 将License警告状态存入Redis
	 * @return 是否成功
	 */
	public boolean saveLicenseWarnState() {
		try {
			SessionUser user = UserContext.getCurrentUser();
			// 获取到第二天0点的时间
			Calendar expireDate = Calendar.getInstance();
			expireDate.add(Calendar.DAY_OF_YEAR, 1);
			expireDate.set(Calendar.HOUR_OF_DAY, 0);
			expireDate.set(Calendar.MINUTE, 0);
			expireDate.set(Calendar.SECOND, 0);
			int expireSeconds = (int) ((expireDate.getTimeInMillis() - System.currentTimeMillis()) / 1000);
			if (expireSeconds < 0) {
				logger.info("License提醒缓存到期时间异常：{}", expireSeconds);
				return false;
			}
			CacheRedisUtils.cache(CacheConstants.PREFIX_WARN_LICENSE + user.getMoid(), expireSeconds, Constants.ONE);
			return true;
		} catch (Exception e) {
			logger.error("保存License告警状态异常", e);
		}
		return false;
	}

	public void setPortraitDomain(UserVO user, ModelMap model) {
		if (null != user && StringUtils.hasText(user.getPortrait40())) { // 如果用户有头像则使用平台域网络域名下的头像
			PlatformDomain platformDomain = cxfService.getAmsCXFService().getCurrentPlatformDomain();
			if (null != platformDomain) {
				model.addAttribute("portraitDomain", platformDomain.getNetworkDomain());
			}
		}
	}

}
