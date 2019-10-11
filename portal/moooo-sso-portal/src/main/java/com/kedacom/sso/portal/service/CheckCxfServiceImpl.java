package com.kedacom.sso.portal.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kedacom.movision.common.cache.ConfigConstants;
import com.kedacom.sso.portal.util.ServerInfo;
import com.kedacom.sso.portal.vo.CheckHolderCore;
import com.kedacom.sso.portal.vo.CheckHolderPlat;

@Service
public class CheckCxfServiceImpl implements CheckCxfService {

	private static Properties properties;
	private static String appName;
	private static String appVersion;
	private static CheckHolderCore checkHolderCore = new CheckHolderCore();
	private static CheckHolderPlat checkHolderPlat = new CheckHolderPlat();

	@Resource
	private ServerInfo serverInfo;

	static {
		properties = new Properties();
		InputStream inputStream = null;
		try {
			inputStream = ConfigConstants.class.getResourceAsStream("/version.properties");
			properties.load(inputStream);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		appName = properties.getProperty("app.name", "portal");
		appVersion = properties.getProperty("app.version", "5.0.0.0");
		checkHolderCore.setAppName(appName);
		checkHolderCore.setAppVersion(appVersion);
		checkHolderPlat.setAppName(appName);
		checkHolderPlat.setAppVersion(appVersion);

	}

	@Override
	public CheckHolderPlat getCheckHolderPlat() {
		return checkHolderPlat;
	}

	@Override
	public CheckHolderCore getCheckHolderCore() {
		return checkHolderCore;
	}

	@Override
	public String checkCore(CheckHolderCore checkHolderCore) {
		if (checkHolderCore == null)
			return "503";
		return "200";
	}

	@Override
	public String checkPlat(CheckHolderPlat checkHolderPlat) {
		if (checkHolderPlat == null)
			return "503";
		return "200";
	}

}
