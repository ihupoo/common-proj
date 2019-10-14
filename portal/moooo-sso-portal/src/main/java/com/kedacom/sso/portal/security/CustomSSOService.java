/**
 * 
 */
package com.kedacom.sso.portal.security;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.model.User;
import com.kedacom.moooo.core.utils.BeanUtils;
import com.kedacom.moooo.core.utils.CookieUtils;
import com.kedacom.moooo.sso.service.AbstractSSOService;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.service.CXFService;
import com.kedacom.sso.portal.service.ConfigService;

@Service("customSSOService")
public class CustomSSOService extends AbstractSSOService {

//	@Resource(name = "ssoCXFService")
//	private SSOCXFService ssoCXFService;
//	
//	@Resource(name = "amsCXFService")
//	private AmsCXFService amsCXFService;
	
	@Resource(name = "CXFService")
	private CXFService cxfService;
	
	@Resource
	private ConfigService configService;
	
	private int accessLimit = 0;

	@Override
	protected UserDetails processAutoLoginToken(String token, HttpServletRequest request, HttpServletResponse response)
			throws BusinessException {
		SessionUser sessionUser = new SessionUser();
		com.kedacom.sdk.sso.vo.UserVO ssoUser;
		ssoUser = cxfService.getSSOCXFService().validationToken(token);

		if (ssoUser == null) {
			throw new RuntimeException("SSO Token已失效！");
		}
		sessionUser.setIsCurrentPlat4SSO(ssoUser.getIsCurrentPlatformAccount());
		// 若当前系统是核心域并且用户具有核心域权限则不进行跳转
		if("0".equals(configService.getDomainType())){
			if(checkCorePermission(ssoUser)){
				ssoUser.setIsCurrentPlatformAccount(true);
			}else{
				throw new BusinessException("您没有使用当前系统的权限！");
			}
		}
        
		sessionUser.setIsCurrentPlatForm(ssoUser.getIsCurrentPlatformAccount());
		sessionUser.setToken(ssoUser.getToken());
		
		if(ssoUser.getIsCurrentPlatformAccount()){
			// UserVO uservo =
			// cxfService.getAmsCXFService().getAccountInfo(ssoUser.getMoid());
			// if(uservo == null){
			// throw new BusinessException("账号异常");
			// }
			UserVO uservo = new UserVO();
			BeanUtils.copyProperties(ssoUser, uservo);
			if("mooooooo-oooo-oooo-oooo-defaultadmin".equals(uservo.getMoid())){
				sessionUser.setEnableSUS(true);
			}
			if(StringUtils.isBlank(uservo.getPortrait40())){
				uservo.setPortrait40("static/images/avator.png");
			}
			// 2.6微博全部开通权限
			// 需求变更，改为正常验证2016-1-27
			//if("1".equals(configService.getSystemVersion())){
			//	uservo.setEnableWeibo(true);
			//}
			sessionUser.setUser(uservo);
		}else{
			sessionUser.setUsername(ssoUser.getAccount());
			sessionUser.setPlatformInfo(ssoUser.getPlatformInfo().getNetworkDomain());
		}

		/*************************** 权限控制 *****************************/
		List<GrantedAuthority> auths = new ArrayList<GrantedAuthority>();

		GrantedAuthority general = new SimpleGrantedAuthority("0");
		auths.add(general);

		sessionUser.setAuthorities(auths);

		try {
			Cookie cookie = new Cookie("loginUserName", URLEncoder.encode(ssoUser.getLoginName(), "UTF-8"));
			cookie.setPath(request.getContextPath());
			cookie.setMaxAge(14*24*3600);
			cookie.setHttpOnly(true);
			response.addCookie(cookie);
		} catch (Exception e) {
			e.printStackTrace();
		}
		try {
			String host = request.getHeader("Referer");
			String contextPath = request.getContextPath();
			Cookie cookie2 = new Cookie("portal", URLEncoder.encode(StringUtils.isEmpty(host) ? "" : getDomain(host)
					+ contextPath, "UTF-8"));
			cookie2.setPath("/");
			cookie2.setMaxAge(14 * 24 * 3600);
			response.addCookie(cookie2);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return sessionUser;
	}

	/**
	 * 获取请求的域名端口信息
	 */
	private String getDomain(String url) {
		// 使用正则表达式过滤，
		String re = "((http|https)://)(([a-zA-Z0-9._-]+)|([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}))(([a-zA-Z]{2,6})|(:[0-9]{1,4})?)";
		String str = "";
		// 编译正则表达式
		Pattern pattern = Pattern.compile(re);
		// 忽略大小写的写法
		Matcher matcher = pattern.matcher(url);
		if (matcher.matches()) {
			str = url;
		} else {
			String[] split2 = url.split(re);
			if (split2.length > 1) {
				String substring = url.substring(0, url.length() - split2[1].length());
				str = substring;
			} else {
				str = split2[0];
			}
		}
		return str;
	}

	// 判断用户是否可访问系统
	private boolean canUserAccess(UserVO userVO) {
		if (canDefaultServiceDomainAdminAccess() && userVO.getDefaultServiceDomainAdmin()) {
			return true;
		}
		if (canServiceDomainAdminAccess() && userVO.getServiceDomainAdmin()) {
			return true;
		}
		if (canDefaultUserDomainAdminAccess() && userVO.getDefaultUserDomainAdmin()) {
			return true;
		}
		if (canUserDomainAdminAccess() && userVO.getUserDomainAdmin()) {
			return true;
		}

		return false;
	}

	// 判断默认服务域管理员是否可访问
	private boolean canDefaultServiceDomainAdminAccess() {
		return (accessLimit & 1) == 1;
	}

	// 判断服务域管理员是否可访问
	private boolean canServiceDomainAdminAccess() {
		return (accessLimit & 2) == 2;
	}

	// 判断默认用户域管理员是否可访问
	private boolean canDefaultUserDomainAdminAccess() {
		return (accessLimit & 4) == 4;
	}

	// 判断用户域管理员是否可访问
	private boolean canUserDomainAdminAccess() {
		return (accessLimit & 8) == 8;
	}

//	public void setSsoCXFService(SSOCXFService ssoCXFService) {
//		this.cxfService.getSSOCXFService() = ssoCXFService;
//	}

	public void setAccessLimit(int accessLimit) {
		this.accessLimit = accessLimit;
	}
	
	private boolean checkCorePermission(com.kedacom.sdk.sso.vo.UserVO user){
		return user.getUserDomainAdmin() ||user.getDefaultUserDomainAdmin()|| user.getEnableBMC() || user.getEnableNM() || "mooooooo-oooo-oooo-oooo-defaultadmin".equals(user.getMoid());
	}

	@Override
	protected void onLoginSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication successfulAuthentication) {
		String token = ((User) successfulAuthentication.getPrincipal()).getToken();
		CookieUtils.setCookie(token, 1209600, request, response);
	}

	@Override
	protected void onLogout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		String ssoToken = CookieUtils.getTokenCookie(request);
		cxfService.getSSOCXFService().userLogout("", ssoToken);
	}

}