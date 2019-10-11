package com.kedacom.sso.portal.service;

import java.util.Map;

import com.kedacom.movision.base.model.UserVO;

public interface UserService {
	
	/**
	 * 修改用户个人信息
	 * @param userVO
	 */
	public void updateUser(UserVO userVO);
	
	/**
	 * 修改用户密码
	 * @param Moid
	 * @param password
	 */
	public void resetPassword(String Moid,String password);

	/**
	 * 查询用户个性化配置
	 * 
	 * @param userMoid
	 */
	public Map<String, String> getPersonalSetting(String userMoid);

	/**
	 * 设置用户自定义参数
	 * 
	 * @param userMoid
	 * @param type
	 *            参数类型
	 * @param value
	 *            参数值
	 * 
	 */
	public void updatePersonalSetting(String userMoid, String type, String value);

	/**
	 * 保存自定义服务器列表
	 */
	public void savePersonalPhysicalServer(String userMoid, String type, String servers);

}
