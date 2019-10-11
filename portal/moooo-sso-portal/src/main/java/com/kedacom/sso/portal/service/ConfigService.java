package com.kedacom.sso.portal.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kedacom.sso.portal.util.ServerInfo;

@Service
public class ConfigService {
	
	@Resource
	private ServerInfo serviceInfo;
	
	public String getDomainType(){
		return serviceInfo.getDomainType();
	}
	
	public String getSystemMode(){
		return serviceInfo.getSystemMode();
	}

	public String getBmc(){
		return "0".equals(serviceInfo.getDomainType())? serviceInfo.getCoreBmc() :serviceInfo.getPlatBmc();
	}
	
	public String getAmc(){
		return "0".equals(serviceInfo.getDomainType())? serviceInfo.getCoreAmc() : serviceInfo.getPlatAmc();
		
	}
	
	public String getNm(){
		return "0".equals(serviceInfo.getDomainType())? serviceInfo.getCoreNm() : serviceInfo.getPlatNm();
		
	}
	
	public String getMeeting(){
		return serviceInfo.getPlatMeeting();
	}
	
	public String getWeibo(){
		return serviceInfo.getPlatWeibo();
	}
	
	public String getVrs(){
		return serviceInfo.getPlatVrs();
	}
	
	public String getSus(){
		return serviceInfo.getSus();
	}
	
	public String getNms() {
		return serviceInfo.getNms();
	}
	
	public String getLive() {
		return serviceInfo.getPlatLive();
		
	}
	
	public String getLiving() {
		return serviceInfo.getPlatLiving();
		
	}
	
	public String getUmc() {
		return serviceInfo.getPlatUmc();
		
	}

	public String getKis() {
		return serviceInfo.getPlatKis();
	}

	public String getJms() {
		return serviceInfo.getJms();
		
	}

	public String getSjms(){
		return serviceInfo.getSjms();
	}

	public String getApiCoreUrl() {
		return serviceInfo.getApiCoreUrl();

	}

	public String getCbs(){
		return serviceInfo.getCbs();
	}

	public String getDoms(){
		return serviceInfo.getDoms();
	}
}
