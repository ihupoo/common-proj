package com.kedacom.sso.portal.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.stereotype.Repository;
import com.kedacom.sso.portal.PortalConstants;

@Repository
public class VersionInfo {
	public String getVersionYear() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		Date date = new Date();
		String versionYear = sdf.format(date);
		return versionYear;
	}

	public String getVersion() {
		return PortalConstants.version;
	}
}
