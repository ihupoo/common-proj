package com.kedacom.sso.portal.service;

import java.util.List;

import com.kedacom.movision.base.model.Server;
import com.kedacom.movision.core.vo.EasyUiTreeNode;

public interface ServerService {

	public List<Server> getVrsServers(String serverTypes, String userDomainMoid);

	public String getVrsIP(List<Server> servers, String carrier);

	public List<Server> getServerByUserDomain(String serverTypes,
			String userDomainMoid);

	public String getTpsIP(Server servers, String carrier);

	/**
	 * 查询用户自定义物理服务器moid列表
	 */
	public List<String> getPersonalPhysicalServer(String userMoid, String type);

	/**
	 * 查询用户待选物理服务器列表
	 */
	public List<EasyUiTreeNode> getPhysicalServerTree(String userMoid, String type);

}
