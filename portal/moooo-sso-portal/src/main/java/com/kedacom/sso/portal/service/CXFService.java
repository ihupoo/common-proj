package com.kedacom.sso.portal.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kedacom.movision.base.constant.Constants;
import com.kedacom.platform.cxf.api.AmsCXFService;
import com.kedacom.platform.cxf.api.JmsCXFService;
import com.kedacom.sdk.meeting.cxf.MeetingCXFService;
import com.kedacom.sdk.passowrd.cxf.PasswordCxfService;
import com.kedacom.sdk.sso.cxf.SSOCXFService;
import com.kedacom.sso.portal.util.ServerInfo;

@Service("CXFService")
public class CXFService{
	
	@Resource
	private ServerInfo serverInfo;
	
	@Resource(name = "ssoCXFServiceCore")
	private SSOCXFService ssoCXFServiceCore;
	@Resource(name = "ssoCXFServicePlat")
	private SSOCXFService ssoCXFServicePlat;
	
	@Resource(name = "amsCXFServiceCore")
	private AmsCXFService amsCXFServiceCore;
	@Resource(name = "amsCXFServicePlat")
	private AmsCXFService amsCXFServicePlat;
	
	@Resource(name = "meetingCXFServicePlat")
	private MeetingCXFService meetingCXFServicePlat;
	
	@Resource(name = "passwordCxfServiceCore")
	private PasswordCxfService passwordCxfServiceCore;
	@Resource(name = "passwordCxfServicePlat")
	private PasswordCxfService passwordCxfServicePlat;
	
	@Resource(name = "jmsCXFServiceCore")
	private JmsCXFService jmsCXFServiceCore;
	@Resource(name = "jmsCXFServicePlat")
	private JmsCXFService jmsCXFServicePlat;

	public SSOCXFService getSSOCXFService(){
		return Constants.ZERO.equals(serverInfo.getDomainType()) ? ssoCXFServiceCore : ssoCXFServicePlat;
	}
	
	public AmsCXFService getAmsCXFService(){
		return Constants.ZERO.equals(serverInfo.getDomainType()) ? amsCXFServiceCore : amsCXFServicePlat;
	}
	
	public MeetingCXFService getMeetingCXFService(){
		return meetingCXFServicePlat;
	}
	
	public PasswordCxfService getPasswordCxfService(){
		return Constants.ZERO.equals(serverInfo.getDomainType()) ? passwordCxfServiceCore : passwordCxfServicePlat;
	}
	
	public JmsCXFService getJmsCXFService() {
		return Constants.ZERO.equals(serverInfo.getDomainType()) ? jmsCXFServiceCore : jmsCXFServicePlat;
	}

}
