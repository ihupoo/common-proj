package com.kedacom.sso.portal.util;

import javax.annotation.Resource;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.springframework.stereotype.Component;

import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.vo.WebUrlVO;

@Component
public class MenuContext {
	
	@Resource
	private ConfigService configService;
	
	public WebUrlVO getUrl(){
		WebUrlVO webUrlVO = new WebUrlVO();
		webUrlVO.setWeiboUrl(configService.getWeibo());
		webUrlVO.setMeetingUrl(configService.getMeeting());
		webUrlVO.setVrsUrl(configService.getVrs());
		webUrlVO.setLiveUrl(configService.getLive());
		webUrlVO.setLivingUrl(configService.getLiving());
		webUrlVO.setNmUrl(getMyUrl(configService.getNm()));
		webUrlVO.setBmcUrl(getMyUrl(configService.getBmc()));
		webUrlVO.setAmcUrl(getMyUrl(configService.getAmc()));
		webUrlVO.setSusUrl(configService.getSus());
		webUrlVO.setJmsUrl(configService.getJms());
		webUrlVO.setSjmsUrl(configService.getSjms());
		webUrlVO.setUmcUrl(configService.getUmc());
		webUrlVO.setKisUrl(configService.getKis());
		webUrlVO.setCbsUrl(configService.getCbs());
		webUrlVO.setDomsUrl(configService.getDoms());
		return webUrlVO;
	}
	
	private String escape(String parm) throws ScriptException{
		ScriptEngineManager sem = new ScriptEngineManager();
		ScriptEngine engine = sem.getEngineByExtension("js");
		return (String)engine.eval("escape('"+parm+"')");
	}
	
	private String getMyUrl(String url){
		SessionUser sessionUser = UserContext.getCurrentUser();
		if("1".equals(configService.getDomainType()) && !sessionUser.getIsCurrentPlat4SSO()){
			SessionUser user = UserContext.getCurrentUser();
			try {
				url = url.replace("home", "login?account="+escape(user.getUser().getAccount()));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return url;
	}

	public ConfigService getConfigService() {
		return configService;
	}

	public void setConfigService(ConfigService configService) {
		this.configService = configService;
	}
	
	
}
