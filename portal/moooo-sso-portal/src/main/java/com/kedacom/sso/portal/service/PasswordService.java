package com.kedacom.sso.portal.service;

import com.kedacom.moooo.core.exception.BusinessException;

public interface PasswordService {

	/**
	 * 发送重置密码邮件
	 * @param email
	 * @param source
	 */
	public void sendEmail(String email, String source, String operator) throws BusinessException;
	
	/**
	 * 检查密码重置链接是否有效
	 * @param email
	 * @param sequenceNum
	 */
	public void checkPasswordLink(String email, String sequenceNum) throws BusinessException;
	
	/**
	 * 重置密码
	 * @param email
	 * @param password
	 */
	public void resetPassword(String email,String password) throws BusinessException;

	/**
	 * 核心域超管密码验证
	 */
	public Boolean checkAdministratorPassword(String password) throws BusinessException;

	void sendPortalEmail(String email, String source, String systemModel, String operator)
			throws BusinessException;
}
