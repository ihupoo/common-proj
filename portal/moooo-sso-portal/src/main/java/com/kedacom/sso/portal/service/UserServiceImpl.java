package com.kedacom.sso.portal.service;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kedacom.movision.base.model.UserVO;

@Service
public class UserServiceImpl implements UserService {

	@Resource
	private PortalService portalService;

	@Override
	public void updateUser(UserVO userVO) {

	}

	@Override
	public void resetPassword(String Moid, String password) {

	}

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, String> getPersonalSetting(String userMoid) {
		Map<String, String> data = new HashMap<String, String>();
		Object result = portalService.getToApiCore("/person/personalSetting/" + userMoid);
		if (null != result) {
			data = (Map<String, String>) result;
		}
		return data;
	}

	@Override
	public void updatePersonalSetting(String userMoid, String type, String value) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("type", type);
		params.put("value", value);
		portalService.postToApiCore("/person/personalSetting/" + userMoid, params);
	}

	@Override
	public void savePersonalPhysicalServer(String userMoid, String type, String servers) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("type", type);
		params.put("servers", servers);
		portalService.postToApiCore("/person/personalPhysicalServer/" + userMoid, params);
	}

}
