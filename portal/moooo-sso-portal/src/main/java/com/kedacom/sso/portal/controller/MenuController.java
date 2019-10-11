package com.kedacom.sso.portal.controller;



import javax.annotation.Resource;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.util.AjaxMessage;
import com.kedacom.sso.portal.util.DirectlyRenderUtils;

@Controller
@RequestMapping(value = "/menu")
public class MenuController {
	
	@Resource
	private ConfigService configService;
	
	@RequestMapping(value = "/weibo")
	public void goToWeibo(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<String> message = new AjaxMessage<String>(false,"操作失败");
		try {
			String weiboUrl = configService.getWeibo();
			message.setSuccess(true);
			message.setDescription(weiboUrl);
		}  catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("系统错误，请联系管理员");
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping(value = "/meeting")
	public void goToMeeting(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<String> message = new AjaxMessage<String>(false,"操作失败");
		try {
			String meetingUrl = configService.getMeeting();
			message.setSuccess(true);
			message.setDescription(meetingUrl);
		}  catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("系统错误，请联系管理员");
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping(value = "/vrs")
	public void goToVRS(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<String> message = new AjaxMessage<String>(false,"操作失败");
		try {
			String vrsUrl = configService.getVrs();
			message.setSuccess(true);
			message.setDescription(vrsUrl);
		}  catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("系统错误，请联系管理员");
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping(value = "/nm")
	public void goToNM(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<String> message = new AjaxMessage<String>(false,"操作失败");
		try {
			String nmUrl = configService.getNm();
			if("1".equals(configService.getDomainType())){
				SessionUser user = UserContext.getCurrentUser();
				nmUrl = nmUrl.replace("home", "login?account="+escape(user.getUser().getAccount()));
			}
			message.setSuccess(true);
			message.setDescription(nmUrl);
		}  catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("系统错误，请联系管理员");
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping(value = "/bmc")
	public void goToBMC(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<String> message = new AjaxMessage<String>(false,"操作失败");
		try {
			String bmcUrl = configService.getBmc();
			if("1".equals(configService.getDomainType())){
				SessionUser user = UserContext.getCurrentUser();
				bmcUrl = bmcUrl.replace("home", "login?account="+escape(user.getUser().getAccount()));
			}
			message.setSuccess(true);
			message.setDescription(bmcUrl);
		}  catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("系统错误，请联系管理员");
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping("/amc")
	public void goToAMC(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<String> message = new AjaxMessage<String>(false,"操作失败");
		try {
			String amcUrl = configService.getAmc();
			if("1".equals(configService.getDomainType())){
				SessionUser user = UserContext.getCurrentUser();
				amcUrl = amcUrl.replace("home", "login?account="+escape(user.getUser().getAccount()));
			}
			message.setSuccess(true);
			message.setDescription(amcUrl);
		}  catch (Exception e) {
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping(value = "/sus")
	public void goToSUS(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<String> message = new AjaxMessage<String>(false,"操作失败");
		try {
			String susUrl = configService.getSus();
			message.setSuccess(true);
			message.setDescription(susUrl);
		}  catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("系统错误，请联系管理员");
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	private String escape(String parm) throws ScriptException{
		ScriptEngineManager sem = new ScriptEngineManager();
		ScriptEngine engine = sem.getEngineByExtension("js");
		return (String)engine.eval("escape('"+parm+"')");
	}
}
