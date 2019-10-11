package com.kedacom.sso.portal.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kedacom.moooo.core.exception.BusinessException;

@Service
public class PasswordServiceImpl implements PasswordService {

	
	@Resource(name = "CXFService")
	private CXFService cxfService;
	
	@Resource(name = "portalService")
	private PortalService portalService;

	@Override
	public void sendEmail(String email, String source, String operator) throws BusinessException {
		cxfService.getPasswordCxfService().resetPasswordEmail(email, source, operator);
	}
	
	@Override
	public void sendPortalEmail(String email, String source, String systemModel, String operator)
			throws BusinessException {
		cxfService.getPasswordCxfService().resetPortalPasswordEmail(email, source, systemModel, operator);
	}
	
	@Override
	public void checkPasswordLink(String email, String sequenceNum) throws BusinessException {
		cxfService.getPasswordCxfService().checkResetPasswordLink(email, sequenceNum);
	}

	@Override
	public void resetPassword(String email, String password) throws BusinessException {
		cxfService.getPasswordCxfService().resetPassword(email, password);
	}

	@Override
	public Boolean checkAdministratorPassword(String password) throws BusinessException {
		final String requestUri = "/sso/checkAdministratorPassword";
		Map<String, String> params = new HashMap<String, String>();
		params.put("administratorPassword", password);
		return (Boolean) portalService.postToApiCore(requestUri, params);
	}

}
