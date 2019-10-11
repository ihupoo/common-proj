package com.kedacom.sso.portal.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("serverInfo")
public class ServerInfo {
	
	@Value("${system.mode}")
	private String systemMode;

	@Value("${system.brand}")
	private String systemBrand;
	
	@Value("${domain.type}")
	private String domainType;
	
	@Value("${bmc.webserver.url}")
	private String coreBmc;
	
	@Value("${amc.webserver.url}")
	private String coreAmc;
	
	@Value("${nm.webserver.url}")
	private String coreNm;
	
	@Value("${core.sso.cxf.server}")
	private String coreSsoCxf;
	
	@Value("${core.moooo.service.cxf.server}")
	private String coreMooooCxf;
	
	@Value("${core.meeting.cxf.server}")
	private String coreMeetingCxf;
	
	@Value("${core.password.cxf.server}")
	private String corePasswordCxf;
	
	@Value("${bmc.webserver.url}")
	private String platBmc;
	
	@Value("${amc.webserver.url}")
	private String platAmc;
	
	@Value("${nm.webserver.url}")
	private String platNm;
	
	@Value("${plat.meeting.webserver.url}")
	private String platMeeting;
	
	@Value("${plat.weibo.webserver.url}")
	private String platWeibo;
	
	@Value("${plat.vrs.webserver.url}")
	private String platVrs;
	
	@Value("${plat.vrs.live.webserver.url}")
	private String platLive;
	
	@Value("${plat.vrs.living.webserver.url}")
	private String platLiving;
	
	@Value("${plat.umc.webserver.url}")
	private String platUmc;

	@Value("${plat.kis.webserver.url}")
	private String platKis;
	
	@Value("${plat.sso.cxf.server}")
	private String platSsoCxf;
	
	@Value("${plat.moooo.service.cxf.server}")
	private String platMooooCxf;
	
	@Value("${plat.meeting.cxf.server}")
	private String platMeetingCxf;
	
	@Value("${plat.password.cxf.server}")
	private String platPasswordCxf;
	
	@Value("${core.sus.webserver.url}")
	private String sus;

	@Value("${core.nms.webserver.url}")
	private String nms;
	
	@Value("${core.jms.webserver.url}")
	private String jms;

	@Value("${core.sjms.webserver.url}")
	private String sjms;

	@Value("${core.api.url}")
	private String apiCoreUrl;

	@Value("${core.cbs.webserver.url}")
	private String cbs;

	@Value("${core.doms.webserver.url}")
	private String doms;
	
	public String getNms() {
		return nms;
	}

	public void setNms(String nms) {
		this.nms = nms;
	}

	public String getSus() {
		return sus;
	}

	public void setSus(String sus) {
		this.sus = sus;
	}

	public String getSystemMode() {
		return systemMode;
	}

	public void setSystemMode(String systemMode) {
		this.systemMode = systemMode;
	}

	public String getDomainType() {
		return domainType;
	}

	public void setDomainType(String domainType) {
		this.domainType = domainType;
	}

	public String getCoreBmc() {
		return coreBmc;
	}

	public void setCoreBmc(String coreBmc) {
		this.coreBmc = coreBmc;
	}

	public String getCoreAmc() {
		return coreAmc;
	}

	public void setCoreAmc(String coreAmc) {
		this.coreAmc = coreAmc;
	}

	public String getCoreNm() {
		return coreNm;
	}

	public void setCoreNm(String coreNm) {
		this.coreNm = coreNm;
	}

	public String getPlatBmc() {
		return platBmc;
	}

	public void setPlatBmc(String platBmc) {
		this.platBmc = platBmc;
	}

	public String getPlatAmc() {
		return platAmc;
	}

	public void setPlatAmc(String platAmc) {
		this.platAmc = platAmc;
	}

	public String getPlatNm() {
		return platNm;
	}

	public void setPlatNm(String platNm) {
		this.platNm = platNm;
	}

	public String getPlatMeeting() {
		return platMeeting;
	}

	public void setPlatMeeting(String platMeeting) {
		this.platMeeting = platMeeting;
	}

	public String getPlatWeibo() {
		return platWeibo;
	}

	public void setPlatWeibo(String platWeibo) {
		this.platWeibo = platWeibo;
	}

	public String getPlatVrs() {
		return platVrs;
	}

	public void setPlatVrs(String platVrs) {
		this.platVrs = platVrs;
	}

	public String getCoreSsoCxf() {
		return coreSsoCxf;
	}

	public void setCoreSsoCxf(String coreSsoCxf) {
		this.coreSsoCxf = coreSsoCxf;
	}

	public String getCoreMooooCxf() {
		return coreMooooCxf;
	}

	public void setCoreMooooCxf(String coreMooooCxf) {
		this.coreMooooCxf = coreMooooCxf;
	}

	public String getCoreMeetingCxf() {
		return coreMeetingCxf;
	}

	public void setCoreMeetingCxf(String coreMeetingCxf) {
		this.coreMeetingCxf = coreMeetingCxf;
	}

	public String getCorePasswordCxf() {
		return corePasswordCxf;
	}

	public void setCorePasswordCxf(String corePasswordCxf) {
		this.corePasswordCxf = corePasswordCxf;
	}

	public String getPlatSsoCxf() {
		return platSsoCxf;
	}

	public void setPlatSsoCxf(String platSsoCxf) {
		this.platSsoCxf = platSsoCxf;
	}

	public String getPlatMooooCxf() {
		return platMooooCxf;
	}

	public void setPlatMooooCxf(String platMooooCxf) {
		this.platMooooCxf = platMooooCxf;
	}

	public String getPlatMeetingCxf() {
		return platMeetingCxf;
	}

	public void setPlatMeetingCxf(String platMeetingCxf) {
		this.platMeetingCxf = platMeetingCxf;
	}

	public String getPlatPasswordCxf() {
		return platPasswordCxf;
	}

	public void setPlatPasswordCxf(String platPasswordCxf) {
		this.platPasswordCxf = platPasswordCxf;
	}

	
	public String getSystemBrand() {
		return systemBrand;
	}

	
	public void setSystemBrand(String systemBrand) {
		this.systemBrand = systemBrand;
	}

	
	public String getPlatLive() {
		return platLive;
	}

	
	public void setPlatLive(String platLive) {
		this.platLive = platLive;
	}

	
	public String getPlatLiving() {
		return platLiving;
	}

	
	public void setPlatLiving(String platLiving) {
		this.platLiving = platLiving;
	}

	
	public String getPlatUmc() {
		return platUmc;
	}

	
	public void setPlatUmc(String platUmc) {
		this.platUmc = platUmc;
	}

	public String getPlatKis() {
		return platKis;
	}

	public void setPlatKis(String platKis) {
		this.platKis = platKis;
	}

	public String getJms() {
		return jms;
	}

	
	public void setJms(String jms) {
		this.jms = jms;
	}

	public String getSjms() {
		return sjms;
	}

	public void setSjms(String sjms) {
		this.sjms = sjms;
	}

	public String getApiCoreUrl() {
		return apiCoreUrl;
	}

	public void setApiCoreUrl(String apiCoreUrl) {
		this.apiCoreUrl = apiCoreUrl;
	}

	public String getCbs() {
		return cbs;
	}

	public void setCbs(String cbs) {
		this.cbs = cbs;
	}

	public String getDoms() {
		return doms;
	}

	public void setDoms(String doms) {
		this.doms = doms;
	}
}
