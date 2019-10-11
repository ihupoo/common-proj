package com.kedacom.sso.portal.util;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.UnknownHostException;
import java.util.Map;

import javax.net.ssl.SSLException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * SimpleHttpClientUtils，不支持Cookie的简易HttpClientUtils,网管Api调用使用
 * @author wulinli
 * @date 2018年6月27日
 */
public class NmsHttpClientUtils {

	protected static final Logger logger = LoggerFactory.getLogger(NmsHttpClientUtils.class.getName());
	protected static final String UTF8 = "UTF-8";
	protected static final int MAX_RETRY_COUNT = 5;

	/**
	 * RetryHandler，处理重试逻辑
	 */
	protected static final HttpRequestRetryHandler retryHandler = new HttpRequestRetryHandler() {

		@Override
		public boolean retryRequest(IOException ex, int executionCount, HttpContext context) {
			// Do not retry if over max retry count
			if (executionCount >= MAX_RETRY_COUNT) {
				return false;
			}
			if (ex instanceof InterruptedIOException // Timeout
					|| ex instanceof UnknownHostException // Unknown host
					|| ex instanceof ConnectTimeoutException // Connection
																// refused
					|| ex instanceof SSLException // SSL handshake exception
			) {
				return false;
			}
			HttpClientContext clientContext = HttpClientContext.adapt(context);
			HttpRequest request = clientContext.getRequest();
			if (!(request instanceof HttpEntityEnclosingRequest)) {
				// Retry if the request is considered idempotent
				return true;
			}
			return false;
		}
	};

	/**
	 * 处理HTTP GET请求
	 * @param url 请求的URL地址
	 */
	public static String doGetNms(String url) throws IOException {
		return doGetNms(url, null);
	}
	
	/**
	 * 处理HTTP GET请求
	 * @param url 请求的URL地址
	 * @param queryParams GET请求的请求参数，会以URL传参的方式进行传递
	 */
	public static String doGetNms(String url, Map<String, String> queryParams) throws IOException {
		return doGetNms(url, queryParams, false);
	}
	
	/**
	 * 处理HTTP GET请求
	 * @param url 请求的URL地址
	 * @param queryParams GET请求的请求参数，会以URL传参的方式进行传递
	 * @param retry 请求未得到响应时是否允许重试；默认不重试；设置为是则重试5遍
	 */
	public static String doGetNms(String url, Map<String, String> queryParams, boolean retry) throws IOException {
		CloseableHttpClient httpClient = retry ? HttpClients.custom().setRetryHandler(retryHandler).build()
				: HttpClients.createDefault();
		HttpGet httpGet = new HttpGet(concatQueryString(url.replace(" ", "%20"), queryParams));
		httpGet.setHeader("Connection", "close");
		httpGet.setHeader("Accept", "application/json");

		CloseableHttpResponse response = httpClient.execute(httpGet);
		try {
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == HttpStatus.SC_MOVED_TEMPORARILY || statusCode == HttpStatus.SC_MOVED_PERMANENTLY
					|| statusCode == HttpStatus.SC_SEE_OTHER || statusCode == HttpStatus.SC_TEMPORARY_REDIRECT) {
				Header header = response.getFirstHeader("location");
				if (header != null) {
					String location = header.getValue();
					if (location == null || location.equals("")) {
						location = "/";
					}
					return doGetNms(location);
				}
			}

			HttpEntity entity = response.getEntity();
			return readEntity(entity);
		} finally {
			httpClient.close();
			response.close();
		}
	}


	/**
	 * 拼接URL和查询参数
	 * @param url 请求的URL地址
	 * @param queryParams GET请求的请求参数，会以URL传参的方式进行传递
	 */
	protected static String concatQueryString(String url, Map<String, String> queryParams) {
		String fullUrl = url;
		StringBuilder queryString = new StringBuilder();
		if (queryParams != null && queryParams.size() > 0) {
			for (Map.Entry<String, String> param : queryParams.entrySet()) {
				queryString.append("&").append(param.getKey()).append("=").append(param.getValue());
			}

			if (fullUrl.contains("?")) {
				fullUrl = fullUrl + queryString.toString();
			} else {
				fullUrl = fullUrl + "?" + queryString.deleteCharAt(0).toString();
			}
		}
		return fullUrl;
	}
	/**
	 * 从Response entity中读取返回的超文本内容
	 * @param entity http请求返回的Response对象中的entity实体对象
	 */
	protected static String readEntity(HttpEntity entity) throws IOException {
		String result = EntityUtils.toString(entity, UTF8);
		return result;
	}

}
