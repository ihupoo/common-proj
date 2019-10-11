package com.kedacom.sso.portal.controller;

import java.awt.Rectangle;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kedacom.moooo.cipher.SMUtils;
import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.web.utils.DirectlyRenderUtils;
import com.kedacom.moooo.sso.authentication.DigestAuthenticationEntryPoint;
import com.kedacom.moooo.upload.PortraitService;
import com.kedacom.moooo.upload.PortraitStoragePolicy;
import com.kedacom.moooo.upload.file.exception.ImageProcessException;
import com.kedacom.moooo.upload.file.exception.UploadException;
import com.kedacom.moooo.upload.file.vo.PortraitFileVO;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.movision.common.Constants;
import com.kedacom.sso.portal.security.context.SessionUser;
import com.kedacom.sso.portal.security.context.UserContext;
import com.kedacom.sso.portal.service.CXFService;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.service.PortalService;
import com.kedacom.sso.portal.util.AjaxMessage;

import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/system/user")
public class UserControl {
	
	private final Logger logger = LoggerFactory.getLogger(UserControl.class);
	
	@Resource(name = "CXFService")
	private CXFService cxfService;
	
	@Resource
	private PortraitService portraitService;

	@Resource
	private ConfigService configService;
	
	@Resource
	private DigestAuthenticationEntryPoint digestAuthenticationEntryPoint;

	@Resource
	private PortalService portalService;

	@RequestMapping(value = "/updateuser", method = RequestMethod.POST)
	public void updateUser(HttpServletRequest request,HttpServletResponse response,UserVO userVO){
		AjaxMessage<String> message = new AjaxMessage<String>(true, "修改成功");
		try {
			Map<String, String> params = new HashMap<String, String>();
			params.put("moid", userVO.getMoid());
			params.put("email", userVO.getEmail());
			params.put("mobile", userVO.getMobile());
			params.put("seat", userVO.getSeat());
			params.put("account", userVO.getAccount());
			portalService.postToApiCore("/ams/updateAccountInfoForSSO", params);
		} catch (BusinessException e) {
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		}catch (Exception e) {
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription("修改用户信息异常，请联系系统管理员");
		}
		DirectlyRenderUtils.renderJson(response, message);
		
	}
	
	@RequestMapping(value = "/updatepassword",method = RequestMethod.POST)
	public void resetPassword(HttpServletResponse response, String knonce, String ciphertext, String hmac, String key) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "修改成功");
		try {
			SessionUser sessionUser = UserContext.getCurrentUser();
			UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(sessionUser.getMoid());
			if (null == userVO) {
				throw new BusinessException("用户信息获取失败");
			}
			String oldPassword = null;
			String newPassword = null;
			if (StringUtils.isNotBlank(userVO.getEncryptionPassword())) {
				oldPassword = SMUtils.decrypt(userVO.getEncryptionPassword());
				newPassword = SMUtils.decrypt(SMUtils.getNewPassword(knonce, ciphertext, hmac,
						digestAuthenticationEntryPoint.getRealmName(), sessionUser.getMoid(),
						userVO.getEncryptionPassword()));
			} else {
				if (StringUtils.isNotBlank(key)) {
					String[] params = key.split(Constants.CHAR_UNDER_LINE);
					if (null == params || params.length < 3) {
						throw new BusinessException("密码修改失败");
					}
					oldPassword = SMUtils.getMWPassword(params[0], params[1], params[2],
							digestAuthenticationEntryPoint.getRealmName(), sessionUser.getMoid(), userVO.getPassword());
				} else {
					throw new BusinessException("密码修改失败");
				}
				newPassword = SMUtils.getMWPassword(knonce, ciphertext, hmac,
						digestAuthenticationEntryPoint.getRealmName(), sessionUser.getMoid(), userVO.getPassword());
			}

			boolean result = cxfService.getAmsCXFService().updatePassword(userVO.getMoid(), oldPassword, newPassword);
			if(!result){
				message.setSuccess(false);
				message.setDescription("密码修改失败");
			}
		}catch(BusinessException e){
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		}catch (Exception e) {
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription("密码修改失败，请联系系统管理员");
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping(value = "/updatePlatFormUser",method = RequestMethod.POST)
	public void updatePlatFormUser(HttpServletRequest request,HttpServletResponse response,UserVO userVO,String birthday){
		AjaxMessage<String> message = new AjaxMessage<String>(true, "修改成功");
		try {
			Map<String, String> params = new HashMap<String, String>();
			params.put("moid", userVO.getMoid());
			params.put("name", userVO.getName());
			params.put("email", userVO.getEmail());
			params.put("mobile", userVO.getMobile());
			params.put("extNum", userVO.getExtNum());
			params.put("sex", userVO.getSex());
			params.put("dateOfBirth", birthday);
			params.put("fax", userVO.getFax());
			params.put("seat", userVO.getSeat());
			params.put("account", userVO.getAccount());
			portalService.postToApiCore("/ams/updateAccountInfo", params);
		}catch(BusinessException e){
			logger.info(e.toString());
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		}catch (Exception e) {
			logger.info(e.toString());
			message.setSuccess(false);
			message.setDescription("修改失败，请联系系统管理员");
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, message);
	}
	
	@RequestMapping("/uploadPortrait")
	public void uploadPortrait(HttpServletRequest request,HttpServletResponse response){
		AjaxMessage<?> ret = null;
		PortraitStoragePolicy storagePolicy = null;
		try {
			String userId = UserContext.getCurrentUser().getMoid();
			storagePolicy = portraitService.upload(request, userId, true);
		} catch (Exception e) {
			logger.info(e.toString());
			ret = new AjaxMessage<String>(false, e.getMessage());// "未知原因导致上传失败"
			e.printStackTrace();
		}
		if (ret == null) {
			ret = new AjaxMessage<String>(true, "操作成功", storagePolicy.getUrl());
		}
		renderJson(response, ret);
	}
	
	@RequestMapping(value = "/confirmPortrait")
	public void confirmPortrait(HttpServletRequest request, HttpServletResponse response, Integer x1, Integer y1,
			Integer width, int height, String fileName) {
		// 接收源头像group和文件ID，上传新头像成功以后删除源先头像
		ServletContext context = request.getSession().getServletContext();
		String userId = UserContext.getCurrentUser().getMoid();
		PortraitFileVO portraitFileVO = null;
		AjaxMessage<?> ret = null;
		try {
			Rectangle imageBounds = new Rectangle(x1, y1, width, width);
			portraitFileVO = portraitService.cutImage(context, userId, imageBounds, fileName);
			long timePoint = System.currentTimeMillis();
			cxfService.getAmsCXFService().updateAccountPortrait(userId, 
					portraitFileVO.getPortraitUrl64().concat("?t="+String.valueOf(timePoint)), portraitFileVO.getPortraitUrl40().concat("?t="+String.valueOf(timePoint)),
					portraitFileVO.getPortraitUrl64().concat("?t="+String.valueOf(timePoint)), portraitFileVO.getPortraitUrl128().concat("?t="+String.valueOf(timePoint)), portraitFileVO.getPortraitUrl256().concat("?t="+String.valueOf(timePoint)));
		} catch (ImageProcessException e) {
			ret = new AjaxMessage<String>(e);
			e.printStackTrace();
			logger.info(e.toString());
		} catch (UploadException e) {
			ret = new AjaxMessage<String>(false, "保存文件失败");
			e.printStackTrace();
			logger.info(e.toString());
		} catch (NullPointerException e) {
			ret = new AjaxMessage<String>(false, "图片保存失败，请重试");
			logger.info(e.toString());
		} catch (Exception e) {
			ret = new AjaxMessage<String>(false, e.getMessage());// "未知原因导致上传失败"
			e.printStackTrace();
			logger.info(e.toString());
		}
		if (ret == null) {
			ret = new AjaxMessage<PortraitFileVO>(true, "操作成功", portraitFileVO);
		}

		DirectlyRenderUtils.renderJson(response, ret);
	}
	@RequestMapping(value="/updateCloudModel",method = RequestMethod.POST)
	public void updateCloudModel(HttpServletRequest request,HttpServletResponse response,String moid, String cloudModelName, 
	        String virMachineroomMoid){
		AjaxMessage<?> ret = new AjaxMessage<Boolean>(false, "更新云模式失败", false);
		try {
			boolean success = cxfService.getAmsCXFService().updateCloudModel(moid, cloudModelName, virMachineroomMoid);
			if(success){
				ret = new AjaxMessage<Boolean>(success, "更新云模式成功", success);
			}else{
				ret = new AjaxMessage<Boolean>(success, "更新云模式成功", success);
			}
		}catch(Exception e){
			logger.info(e.toString());
			e.printStackTrace();
		}
		DirectlyRenderUtils.renderJson(response, ret);
		
	}
	private void renderJson(HttpServletResponse response, Object obj) {
		String string = JSONObject.fromObject(obj).toString();
		response.setContentType("text/html;charset=UTF-8");
		try {
			response.getWriter().write(string);
		} catch (IOException e) {
			logger.info(e.toString());
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/checkNewPassword", method = RequestMethod.POST)
	@ResponseBody
	public AjaxMessage<String> checkNewPassword(String knonce, String ciphertext, String hmac) {
		AjaxMessage<String> message = new AjaxMessage<String>(true, "");
		try {
			String userMoid = UserContext.getCurrentUser().getMoid();
			UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(userMoid);
			if (null == userVO) {
				throw new BusinessException("用户信息获取失败");
			}
			String oldEncryptedPassword = userVO.getEncryptionPassword();
			String newPassword;
			if (StringUtils.isNotBlank(oldEncryptedPassword)) {
				newPassword = SMUtils.decrypt(
						SMUtils.getNewPassword(knonce, ciphertext, hmac, digestAuthenticationEntryPoint.getRealmName(),
								userMoid, oldEncryptedPassword));
			} else {
				newPassword = SMUtils
						.getMWPassword(knonce, ciphertext, hmac, digestAuthenticationEntryPoint.getRealmName(),
								userMoid, userVO.getPassword());
			}
			Map<String, String> params = new HashMap<String, String>();
			params.put("moid", userMoid);
			params.put("password", newPassword);
			Object result = portalService.postToApiCore("/ams/checkUsedPassword", params);
			if (null != result) {
				message.setData(result.toString());
			}
		} catch (BusinessException e) {
			e.printStackTrace();
			message.setSuccess(false);
			message.setDescription(e.getMessage());
		} catch (RuntimeException e) {
			message.setSuccess(false);
			message.setDescription("系统繁忙，请稍后再试！");
			logger.info(e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			message.setSuccess(false);
			message.setDescription("操作出现未知错误，请与系统管理员联系！");
			logger.info("操作失败，" + e.getMessage());
			e.printStackTrace();
		}
		return message;
	}
}
