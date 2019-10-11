package com.kedacom.sso.portal;

public class PortalConstants {

	public static final String emailSource = "zhilin@kedacom.com";
	public static final String version = "6.0.0.4.0";

	public static final String canRebootServerType = "jd2000,jd4000,jd6000,jd10000,jds6000,umm,DX6000,DX10000,DX2000,DX4000";
	public static final String shellPath = "/opt/midware/tomcat/shells";

	// 提醒密码有效期的剩余时间
	public static final int[] allPromptDates = {
			30, 20, 10, 5, 4, 3, 2, 1
	};
	// 提醒一次密码有效期的剩余时间
	public static final int[] onePromptDates = {
			30, 20, 10
	};

	public static final String PORTAL_PATH = "/portal";
	public static final String PORTALCORE_PATH = "/portalCore";
	public static final String COOKIE_NAME_S = "_S";
	public static final String COOKIE_NAME_OUT = "_OUT";

	public static final String LICENSE_FIELD_MCUDATE = "mcuDate";
}
