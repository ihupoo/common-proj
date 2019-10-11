package com.kedacom.sso.portal.security;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.utils.BeanUtils;
import com.kedacom.moooo.sso.helper.SSOSourceHelper;
import com.kedacom.moooo.sso.service.UserDetailsService;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.service.CXFService;
import com.kedacom.sso.portal.service.ConfigService;

@Service("customUserDetailService")
public class CustomUserDetailService implements UserDetailsService {


//	@Resource(name = "ssoCXFService")
//	private SSOCXFService ssoCXFService;

//	@Resource(name = "amsCXFService")
//	private AmsCXFService amsCXFService;
	
	@Resource(name = "CXFService")
	private CXFService cxfService;
	
	@Resource
	private ConfigService configService;

	private int accessLimit = 0;

	/**
	 * arg0 --->登录的账号
	 */
	@Override
	public UserDetails loadUserByUsername(String username, String password) throws UsernameNotFoundException {
		SessionUser sessionUser = new SessionUser();
		com.kedacom.sdk.sso.vo.UserVO ssoUser;
//		ssoUser = ssoCXFService.userLogin(username, password, "");
		// ssoUser = cxfService.getSSOCXFService().userLoginForMd5(username,
		// password, "");
		String source = SSOSourceHelper.get().getSource();
		ssoUser = cxfService.getSSOCXFService().userLoginNew(username, password, source);
		if (ssoUser == null) {
			throw new RuntimeException("您输入的账号或密码有误！");
		}
		sessionUser.setIsCurrentPlat4SSO(ssoUser.getIsCurrentPlatformAccount());
		//若当前系统是核心域并且用户具有核心域权限则不进行跳转
		if("0".equals(configService.getDomainType())){
			if(checkCorePermission(ssoUser)){
				ssoUser.setIsCurrentPlatformAccount(true);
			}else{
				throw new BusinessException("您没有使用当前系统的权限！");
			}
		}
		if (null != ssoUser.getLimited() && ssoUser.getLimited()) {
			throw new BusinessException("您没有使用当前系统的权限！");
		}
		sessionUser.setToken(ssoUser.getToken());
		sessionUser.setUsername(username);
		sessionUser.setPassword(password);
		sessionUser.setEncryptionPassword(ssoUser.getEncryptionPassword());
		sessionUser.setIsCurrentPlatForm(ssoUser.getIsCurrentPlatformAccount());
//		UserVO uservo = amsCXFService.getUserByMoid(ssoUser.getMoid());
		if(ssoUser.getIsCurrentPlatformAccount()){
			UserVO uservo = cxfService.getAmsCXFService().getAccountInfo(ssoUser.getMoid());
			if(uservo == null){
				throw new BusinessException("账号异常");
			}
			if("mooooooo-oooo-oooo-oooo-defaultadmin".equals(uservo.getMoid())){
				sessionUser.setEnableSUS(true);
			}
			if(StringUtils.isBlank(uservo.getPortrait40())){
				uservo.setPortrait40("static/images/avator.png");
			}
			//2.6微博全部开通权限.
			//需求变更，改为正常验证2016-1-27
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


		return sessionUser;
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
//		this.ssoCXFService = ssoCXFService;
//	}


	public void setAccessLimit(int accessLimit) {
		this.accessLimit = accessLimit;
	}

	public static void main(String[] argus) {
		printAccess(1);
		printAccess(2);
		printAccess(4);
		printAccess(8);
	}

	private static void printAccess(int limit) {
		for (int i = 0; i < 16; i++) {
			int value = i & limit;
			if (value == limit) {
				System.out.println(i + " & " + limit + " = " + value);
			}
		}
	}
	
	private boolean checkCorePermission(com.kedacom.sdk.sso.vo.UserVO user){
		//user.getEnableUMC() || 
		return user.getUserDomainAdmin() ||user.getDefaultUserDomainAdmin()||user.getEnableBMC() || user.getEnableNM() || "mooooooo-oooo-oooo-oooo-defaultadmin".equals(user.getMoid());
	}

	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {

		SessionUser sessionUser = new SessionUser();
		com.kedacom.sdk.sso.vo.UserVO ssoUser = new com.kedacom.sdk.sso.vo.UserVO();
		UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(username);
		if (userVO == null) {
			throw new RuntimeException("您输入的账号或密码有误！");
		}
		BeanUtils.copyProperties(userVO, ssoUser);
		sessionUser.setIsCurrentPlat4SSO(ssoUser.getIsCurrentPlatformAccount());
		// 若当前系统是核心域并且用户具有核心域权限则不进行跳转
		if ("0".equals(configService.getDomainType())) {
			if (checkCorePermission(ssoUser)) {
				ssoUser.setIsCurrentPlatformAccount(true);
			} else {
				throw new BusinessException("您没有使用当前系统的权限！");
			}
		}
		if (null != ssoUser.getLimited() && ssoUser.getLimited()) {
			throw new BusinessException("您没有使用当前系统的权限！");
		}
		sessionUser.setToken(ssoUser.getToken());
		sessionUser.setUsername(username);
		sessionUser.setPassword(userVO.getPassword());
		sessionUser.setEncryptionPassword(userVO.getEncryptionPassword());
		sessionUser.setIsCurrentPlatForm(ssoUser.getIsCurrentPlatformAccount());
		if (ssoUser.getIsCurrentPlatformAccount()) {
			UserVO uservo = cxfService.getAmsCXFService().getAccountInfo(ssoUser.getMoid());
			if (uservo == null) {
				throw new BusinessException("账号异常");
			}
			if ("mooooooo-oooo-oooo-oooo-defaultadmin".equals(uservo.getMoid())) {
				sessionUser.setEnableSUS(true);
			}
			if (StringUtils.isBlank(uservo.getPortrait40())) {
				uservo.setPortrait40("static/images/avator.png");
			}
			sessionUser.setUser(uservo);
		} else {
			sessionUser.setUsername(ssoUser.getAccount());
			sessionUser.setPlatformInfo(ssoUser.getPlatformInfo().getNetworkDomain());
		}

		/*************************** 权限控制 *****************************/
		List<GrantedAuthority> auths = new ArrayList<GrantedAuthority>();

		GrantedAuthority general = new SimpleGrantedAuthority("0");
		auths.add(general);

		sessionUser.setAuthorities(auths);

		return sessionUser;

	}

	@Override
	public UserDetails loadUserByUsernameForMD5(String username, String password) throws UsernameNotFoundException {
		SessionUser sessionUser = new SessionUser();
		com.kedacom.sdk.sso.vo.UserVO ssoUser;
		String source = SSOSourceHelper.get().getSource();
		ssoUser = cxfService.getSSOCXFService().userLoginForMd5New(username, password, source);
		if (ssoUser == null) {
			throw new RuntimeException("您输入的账号或密码有误！");
		}
		sessionUser.setIsCurrentPlat4SSO(ssoUser.getIsCurrentPlatformAccount());
		//若当前系统是核心域并且用户具有核心域权限则不进行跳转
		if("0".equals(configService.getDomainType())){
			if(checkCorePermission(ssoUser)){
				ssoUser.setIsCurrentPlatformAccount(true);
			}else{
				throw new BusinessException("您没有使用当前系统的权限！");
			}
		}
		sessionUser.setToken(ssoUser.getToken());
		sessionUser.setUsername(username);
		sessionUser.setPassword(password);
		sessionUser.setEncryptionPassword(ssoUser.getEncryptionPassword());
		sessionUser.setIsCurrentPlatForm(ssoUser.getIsCurrentPlatformAccount());
		if(ssoUser.getIsCurrentPlatformAccount()){
			UserVO uservo = cxfService.getAmsCXFService().getAccountInfo(ssoUser.getMoid());
			if(uservo == null){
				throw new BusinessException("账号异常");
			}
			if("mooooooo-oooo-oooo-oooo-defaultadmin".equals(uservo.getMoid())){
				sessionUser.setEnableSUS(true);
			}
			if(StringUtils.isBlank(uservo.getPortrait40())){
				uservo.setPortrait40("static/images/avator.png");
			}
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


		return sessionUser;
	
	}

}
