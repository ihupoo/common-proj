package com.kedacom.sso.portal.util;

import java.io.IOException;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.http.conn.HttpHostConnectException;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.kedacom.moooo.core.exception.BusinessException;
import com.kedacom.moooo.core.http.utils.HttpClientUtils;
import com.kedacom.movision.common.Constants;
import com.kedacom.sso.portal.CacheConstants;
import com.kedacom.sso.portal.aop.annotation.LoadFromRedis;
import com.kedacom.sso.portal.service.ConfigService;
import com.kedacom.sso.portal.vo.VrsApiRequest;

/**
 * 录播API接口入口
 * @author 方斌
 * @date 2018年6月4日
 */
@Component
public class VrsApiClient {

	@Resource
	private ConfigService configService;

	private Logger logger = Logger.getLogger(VrsApiClient.class);

	/**
	 * 获取直播室列表
	 */
	@LoadFromRedis(key = "${vrsIp}_${userDomainMoid}_${prgs1page}_${pageid}_${orderindex}_${desc}", prefix = CacheConstants.PREFIX_VRS
			+ "getVrsLiveRoom_")
	public VrsApiRequest getVrsLiveRoom(String vrsIp, String userDomainMoid, Integer prgs1page, Integer pageid,
			Integer orderindex, Integer desc, String token) throws BusinessException {
		// 设置调用接口URL
		String url = "http://" + vrsIp + "/api/v1/vrs/liveroom?userdomainmoid=" + userDomainMoid + "&prgs1page="
				+ prgs1page + "&pageid=" + pageid + "&includename=&orderindex=" + orderindex + "&desc=" + desc
				+ "&sso_token=" + token;
		String result;
		try {
			result = HttpClientUtils.doGet(url, null, false);
		} catch (HttpHostConnectException e) {
			throw new BusinessException("获取直播室列表: ", e);
		} catch (IOException e) {
			throw new BusinessException("获取直播室列表: 接口异常");
		}
		if (StringUtils.isNotEmpty(result) && JsonUtils.isJson(result)) {
			try {
				VrsApiRequest ret = VrsApiRequest.toObject(result);
				if (null != ret) {
					if (Constants.ONE.equals(ret.getSuccess())) {
						return ret;
					} else {
						throw new BusinessException("获取直播室列表:" + ret.getError_code());
					}
				} else {
					throw new BusinessException("获取直播室列表!");
				}
			} catch (Exception e) {
				throw new BusinessException("获取直播室列表:返回信息为空");
			}
		} else {
			throw new BusinessException("获取直播室列表:返回信息错误");
		}
	}

	/**
	 * 获取预约直播室列表
	 */
	@LoadFromRedis(key = "${vrsIp}_${userDomainMoid}_${prgs1page}_${pageid}", prefix = CacheConstants.PREFIX_VRS
			+ "getVrsResRoom_")
	public VrsApiRequest getVrsResRoom(String vrsIp, String userDomainMoid, Integer prgs1page, Integer pageid,
			String token) throws BusinessException {
		// 设置调用接口URL
		String url = "http://" + vrsIp + "/api/v1/vrs/resroom?userdomainmoid=" + userDomainMoid + "&prgs1page="
				+ prgs1page + "&pageid=" + pageid + "&includename=&sso_token=" + token;
		String result;
		try {
			result = HttpClientUtils.doGet(url, null, false);
		} catch (HttpHostConnectException e) {
			throw new BusinessException("获取预约直播室列表: ", e);
		} catch (IOException e) {
			throw new BusinessException("获取预约直播室列表: 接口异常");
		}
		if (StringUtils.isNotEmpty(result) && JsonUtils.isJson(result)) {
			try {
				VrsApiRequest ret = VrsApiRequest.toObject(result);
				if (null != ret) {
					if (Constants.ONE.equals(ret.getSuccess())) {
						return ret;
					} else {
						throw new BusinessException("获取预约直播室列表:" + ret.getError_code());
					}
				} else {
					throw new BusinessException("获取预约直播室列表!");
				}
			} catch (Exception e) {
				throw new BusinessException("获取预约直播室列表:返回信息为空");
			}
		} else {
			throw new BusinessException("获取预约直播室列表:返回信息错误");
		}
	}
}
