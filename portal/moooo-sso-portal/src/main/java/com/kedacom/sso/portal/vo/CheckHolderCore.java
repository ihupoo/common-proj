package com.kedacom.sso.portal.vo;


import com.kedacom.movision.core.util.XStreamUtils;
import com.thoughtworks.xstream.XStream;

public class CheckHolderCore {
	
	private String appName;
	private String appVersion;
	
	static final XStream xstream = XStreamUtils.getXStream();
	static {
		xstream.alias("healthcheck", CheckHolderCore.class, CheckHolderCore.class);
	}

	public String toXml() {
		return xstream.toXML(this);
	}
	
	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	public String getAppVersion() {
		return appVersion;
	}
	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}

}
