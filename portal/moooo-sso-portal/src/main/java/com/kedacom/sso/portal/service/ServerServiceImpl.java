package com.kedacom.sso.portal.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.kedacom.movision.base.model.PeripheralIPInfo;
import com.kedacom.movision.base.model.Server;
import com.kedacom.movision.base.model.UserVO;
import com.kedacom.movision.common.MovisionError;
import com.kedacom.movision.common.util.ExceptionUtil;
import com.kedacom.movision.core.vo.EasyUiTreeNode;
import com.kedacom.sso.portal.util.NmsApiClient;
import com.kedacom.sso.portal.vo.NmsDomainBean;
import com.kedacom.sso.portal.vo.NmsServerBean;

@Service
public class ServerServiceImpl implements ServerService {

	Logger logger = LoggerFactory.getLogger(ServerServiceImpl.class);

	@Resource
	private CXFService cxfService;

	@Resource
	private PortalService portalService;

	@Resource
	private NmsApiClient nmsApiClient;

	@Override
	public String getVrsIP(List<Server> servers, String carrier) {
		String ip = null;
	
		List<PeripheralIPInfo> vrsMatchIPs = new ArrayList<PeripheralIPInfo>();
		List<PeripheralIPInfo> vrsOtherIPs = new ArrayList<PeripheralIPInfo>();
		for (Server server : servers) {
			String networkName = server.getNetworkName();
			if (StringUtils.isNotBlank(networkName)) {
				return networkName;
			}
			List<PeripheralIPInfo> piis = server.getPeripheralIP();
			if (piis != null && piis.size() > 0) {
				PeripheralIPInfo firstPii = piis.get(0);
				if (StringUtils.isNotBlank(firstPii.getIp())) {
					vrsOtherIPs.add(firstPii);
				}
				for (PeripheralIPInfo pii : piis) {
					if (pii.getOperator().equals(carrier)
							&& StringUtils.isNotBlank(pii.getIp())) {
						vrsMatchIPs.add(pii);
						break;
					}
				}
			}
		}

		Random random = new Random();
		if (vrsMatchIPs.size() > 0 && vrsMatchIPs != null) {
			if (vrsMatchIPs.size() == 1) {
				ip = getPeripheralIP(vrsMatchIPs.get(0));
			} else {
				// 随机一个
				int index = random.nextInt(vrsMatchIPs.size());
				ip = getPeripheralIP(vrsMatchIPs.get(index));
			}
		} else if (vrsOtherIPs.size() > 0 && vrsOtherIPs != null) {
			int index = random.nextInt(vrsOtherIPs.size());
			ip = getPeripheralIP(vrsOtherIPs.get(index));
		} else {
			return ip;
		}
		return ip;
	}

	private String getPeripheralIP(PeripheralIPInfo peripheralIP) {
		if (StringUtils.isNotBlank(peripheralIP.getIp())) {
			if (StringUtils.isNotBlank(peripheralIP.getPort())) {
				return peripheralIP.getIp() + ":" + peripheralIP.getPort();
			} else {
				return peripheralIP.getIp();
				}
			}
		return null;
	}
	@Override
	public List<Server> getVrsServers(String serverTypes, String userDomainMoid) {
		List<Server> servers = cxfService.getAmsCXFService()
				.listVRSServerByUserDomain(serverTypes, userDomainMoid);
		return servers;
	}

	@Override
	public List<Server> getServerByUserDomain(String serverType,
			String userDomainMoid) {
		List<Server> servers = cxfService.getAmsCXFService()
				.listServerByUserDomain(serverType, userDomainMoid);
		return servers;
	}

	@Override
	public String getTpsIP(Server server, String carrier) {
		String ip = null;
		String networkName = server.getNetworkName();
		if (StringUtils.isNotBlank(networkName)) {
				return networkName;
		}
		List<PeripheralIPInfo> piis = server.getPeripheralIP();
		if (piis != null && piis.size() > 0) {
			for (PeripheralIPInfo pii : piis) {
				if (pii.getOperator().equals(carrier)
						&& StringUtils.isNotBlank(pii.getIp())) {
					ip = getPeripheralIP(pii);
					return ip;
				}
			}
			PeripheralIPInfo firstPii = piis.get(0);
			if (StringUtils.isNotBlank(firstPii.getIp())) {
				ip = getPeripheralIP(firstPii);
				return ip;
			}
		}
		return ip;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getPersonalPhysicalServer(String userMoid, String type) {
		Map<String, List<String>> result = (Map<String, List<String>>) portalService
				.getToApiCore("/person/personalPhysicalServer/" + userMoid + "?type=" + type);
		if (null != result && !result.isEmpty() && result.containsKey("server")) {
			return result.get("server");
		}
		return null;
	}

	@Override
	public List<EasyUiTreeNode> getPhysicalServerTree(String userMoid, String type) {
		List<EasyUiTreeNode> nodes = new ArrayList<EasyUiTreeNode>();
		UserVO userVO = cxfService.getAmsCXFService().getAccountInfo(userMoid);
		if (null == userVO) {
			ExceptionUtil.error(MovisionError.USER_NOT_EXIST);
		}
		List<NmsDomainBean> domains = nmsApiClient.listDomains(userVO.getServiceDomainMoid());
		if (null != domains && domains.size() > 0) {
			Map<String, String> platMap = new HashMap<String, String>();// 服务域与平台域关系存储
			List<NmsDomainBean> serviceDomains = this.getServiceDomainList(domains, platMap);// 获取所有服务器列表并初始化服务域与平台域关系
			Map<String, List<EasyUiTreeNode>> serverMap = this.getDomainServerMap(userMoid, type, serviceDomains,
					platMap);
			nodes = listDomainRoot(serviceDomains, serverMap);
		}
		return nodes;
	}

	/**
	 * 组装上级域列表
	 */
	private List<EasyUiTreeNode> listDomainRoot(List<NmsDomainBean> serviceDomains,
			Map<String, List<EasyUiTreeNode>> serverMap) {
		List<EasyUiTreeNode> nodes = new ArrayList<EasyUiTreeNode>(0);
		if (serviceDomains != null) {
			String moidList = getMoidList(serviceDomains);
			for (int i = 0, len = serviceDomains.size(); i < len; i++) {
				NmsDomainBean vo = serviceDomains.get(i);
				// 若不存在上级服务域，或者找不到上级域数据，则都定义为树的根节点
				if (vo.getParentMoid() == null || moidList.indexOf(vo.getParentMoid()) == -1
						|| vo.getParentMoid().isEmpty()|| "-1".equals(vo.getParentMoid())) {

					// 查询子集服务域
					List<EasyUiTreeNode> children = this.listDomainChildren(serviceDomains, vo.getMoid(), serverMap);
					// 追加服务器信息
					if (serverMap.containsKey(vo.getMoid()) && null != serverMap.get(vo.getMoid())) {
						children.addAll(serverMap.get(vo.getMoid()));
					}
					EasyUiTreeNode node = new EasyUiTreeNode();
					node.setId(i + 1);
					node.setChecked(false);
					node.setAttributes(vo);
					node.setIconCls("icon-empty");
					node.setState("open");
					node.setText(vo.getName());
					node.setChildren(children);
					nodes.add(node);
				}
			}
		}
		return nodes;
	}

	/**
	 * 组装下级域列表及服务器列表
	 */
	private List<EasyUiTreeNode> listDomainChildren(List<NmsDomainBean> serviceDomains, String parentMoid,
			Map<String, List<EasyUiTreeNode>> serverMap) {
		List<EasyUiTreeNode> nodes = new ArrayList<EasyUiTreeNode>(0);
		for (int i = 0, len = serviceDomains.size(); i < len; i++) {
			NmsDomainBean vo = serviceDomains.get(i);
			if (!parentMoid.equals(vo.getParentMoid())) {
				continue;
			}
			// 查询子集服务域
			List<EasyUiTreeNode> children = listDomainChildren(serviceDomains, vo.getMoid(), serverMap);
			// 追加服务器信息
			if (serverMap.containsKey(vo.getMoid()) && null != serverMap.get(vo.getMoid())) {
				children.addAll(serverMap.get(vo.getMoid()));
			}
			EasyUiTreeNode node = new EasyUiTreeNode();
			node.setId(i + 1);
			node.setChecked(false);
			node.setAttributes(vo);
			node.setIconCls("icon-empty");
			node.setState("open");
			node.setText(vo.getName());
			node.setChildren(children);
			nodes.add(node);
		}
		return nodes;
	}

	/**
	 * 获取Moid列表，格式为：,aaa,bbb,ccc,ddd,
	 * 
	 * @param voList
	 * @return
	 */
	private String getMoidList(List<NmsDomainBean> voList) {
		StringBuffer retBuf = new StringBuffer(",");
		for (NmsDomainBean vo : voList) {
			retBuf.append(vo.getMoid());
			retBuf.append(",");
		}
		return retBuf.toString();
	}

	/**
	 * 获取纯服务域数据 并 初始化平台域与服务域关系数据
	 */
	private List<NmsDomainBean> getServiceDomainList(List<NmsDomainBean> domains, Map<String, String> platMap) {
		List<NmsDomainBean> serviceDomains = new ArrayList<NmsDomainBean>();
		if (null != domains && domains.size() > 0) {
			for (int i = 0; i < domains.size(); i++) {
				NmsDomainBean vo = domains.get(i);
				if ("platform".equals(vo.getType())) {// 平台域
					platMap.put(vo.getParentMoid(), vo.getMoid());
				} else if ("service".equals(vo.getType()) || "kernel".equals(vo.getType())) {// 服务域
					serviceDomains.add(vo);
				} else {
					continue;
				}
			}
		}
		return serviceDomains;
	}

	/**
	 * 查询所有服务域下服务器节点
	 */
	private Map<String, List<EasyUiTreeNode>> getDomainServerMap(String userMoid, String type,
			List<NmsDomainBean> serviceDomains, Map<String, String> platMap) {
		Map<String, List<EasyUiTreeNode>> serverMap = new HashMap<String, List<EasyUiTreeNode>>();
		// 获取当前用户自定义的服务器列表
		Map<String, String> checkedServerMap = this.getCustomCheckedServerMap(userMoid, type);
		// 查询所有服务域下的服务器列表信息
		if (null != serviceDomains && serviceDomains.size() > 0) {
			for (int i = 0; i < serviceDomains.size(); i++) {
				NmsDomainBean vo = serviceDomains.get(i);
				String serviceDomainMoid = vo.getMoid();
				if (platMap.containsKey(serviceDomainMoid) && StringUtils.isNotBlank(platMap.get(serviceDomainMoid))) {
					List<NmsServerBean> physicals = nmsApiClient.listPhysicals(platMap.get(serviceDomainMoid));
					if (null != physicals && physicals.size() > 0) {
						List<EasyUiTreeNode> serverNodes = new ArrayList<EasyUiTreeNode>();
						for (int z = 0; z < physicals.size(); z++) {
							NmsServerBean server = physicals.get(z);
							server.setServiceDomainMoid(vo.getMoid());
							boolean checked = false;
							if (checkedServerMap.containsKey(server.getMoid())) {
								checked = true;
							}
							EasyUiTreeNode serverNode = new EasyUiTreeNode();
							serverNode.setId(i * 100000 + z);
							serverNode.setChecked(checked);
							serverNode.setAttributes(server);
							serverNode.setIconCls("icon-empty");
							serverNode.setState("open");
							serverNode.setText(server.getName());
							serverNode.setChildren(new ArrayList<EasyUiTreeNode>());
							serverNodes.add(serverNode);
						}
						serverMap.put(serviceDomainMoid, serverNodes);
					}
				}
			}
		}
		return serverMap;
	}

	/**
	 * 获取被选中的自定义服务器列表
	 */
	private Map<String, String> getCustomCheckedServerMap(String userMoid, String type) {
		List<String> serverMoids = this.getPersonalPhysicalServer(userMoid, type);
		Map<String, String> checkedServerMap = new HashMap<String, String>();
		if (null != serverMoids && serverMoids.size() > 0) {
			for (int i = 0; i < serverMoids.size(); i++) {
				checkedServerMap.put(serverMoids.get(i), serverMoids.get(i));
			}
		}
		return checkedServerMap;
	}

}
