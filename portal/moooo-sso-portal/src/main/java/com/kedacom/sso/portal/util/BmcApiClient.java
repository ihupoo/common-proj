package com.kedacom.sso.portal.util;

import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.kedacom.moooo.core.http.utils.HttpClientUtils;
import com.kedacom.moooo.core.http.utils.HttpResult;
import com.kedacom.sso.portal.core.BusinessException;

/**
 * BMC api
 * @author ranran.ye
 * @date 2018年6月14日
 */
public class BmcApiClient {

	private static final String BMC_HOST = "http://127.0.0.1:8080";

	private static Logger logger = Logger.getLogger(BmcApiClient.class);

	/**
	 * 判断是否为首次登陆JMS,并返回后续跳转url
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> getJMSEntranceInfo(String cookies) {
		try {
			HttpResult result = HttpClientUtils.doGet(BMC_HOST + "/bmc/api/getJMSEntrance", new String[] {
				cookies
			});
			if (null != result && StringUtils.isNotBlank(result.getResponse())) {
				Map<String, Object> ret = JSONObject.fromObject(result.getResponse());
				if (null != ret && !ret.isEmpty() && null != ret.get("success")
						&& "true".equals(ret.get("success").toString())) {
					return JSONObject.fromObject(ret.get("data"));
				}
			}
		} catch (Exception e) {
			throw new BusinessException("判断是否为首次登陆JMS: ", e);
		}
		return null;
	}

}
