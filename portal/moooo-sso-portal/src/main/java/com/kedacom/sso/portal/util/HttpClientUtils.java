package com.kedacom.sso.portal.util;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLException;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.kedacom.moooo.core.http.utils.HttpResult;

/**
 * HttpClientUtils
 * @author luocanfeng
 * @date 2014-7-16
 */
public class HttpClientUtils {

	protected static final Logger logger = LoggerFactory.getLogger(HttpClientUtils.class.getName());
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
	public static HttpResult doGet(String url) throws IOException {
		return doGet(url, null, null, false);
	}

	/**
	 * 处理HTTP GET请求
	 * @param url 请求的URL地址
	 * @param queryParams GET请求的请求参数，会以URL传参的方式进行传递
	 */
	public static HttpResult doGet(String url, Map<String, String> queryParams) throws IOException {
		return doGet(url, queryParams, null, false);
	}

	/**
	 * 处理HTTP GET请求
	 * @param url 请求的URL地址
	 * @param cookies 请求时需要带上（写入到请求头）的Cookies
	 */
	public static HttpResult doGet(String url, String[] cookies) throws IOException {
		return doGet(url, null, cookies);
	}

	/**
	 * 处理HTTP GET请求
	 * @param url 请求的URL地址
	 * @param queryParams GET请求的请求参数，会以URL传参的方式进行传递
	 * @param cookies 请求时需要带上（写入到请求头）的Cookies
	 */
	public static HttpResult doGet(String url, Map<String, String> queryParams, String[] cookies) throws IOException {
		return doGet(url, queryParams, cookies, false);
	}

	/**
	 * 处理HTTP GET请求
	 * @param url 请求的URL地址
	 * @param queryParams GET请求的请求参数，会以URL传参的方式进行传递
	 * @param cookies 请求时需要带上（写入到请求头）的Cookies
	 * @param retry 请求未得到响应时是否允许重试；默认不重试；设置为是则重试5遍
	 */
	public static HttpResult doGet(String url, Map<String, String> queryParams, String[] cookies, boolean retry)
			throws IOException {
		CloseableHttpClient httpClient = retry ? HttpClients.custom().setRetryHandler(retryHandler).build()
				: HttpClients.createDefault();
		HttpGet httpGet = new HttpGet(concatQueryString(url, queryParams));
		httpGet.setHeader("Connection", "close");

		if (ArrayUtils.isNotEmpty(cookies)) { // set Cookies
			for (String cookie : cookies) {
				httpGet.addHeader("Cookie", cookie);
			}
		}

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
					return doGet(location, ArrayUtils.addAll(cookies, readCookies(response)));
				}
			}

			HttpEntity entity = response.getEntity();
			return new HttpResult(readEntity(entity), ArrayUtils.addAll(cookies, readCookies(response)));
		} finally {
			httpClient.close();
			response.close();
		}
	}

	/**
	 * 处理HTTP POST请求
	 * @param url 请求的URL地址
	 */
	public static HttpResult doPost(String url) throws IOException {
		return doPost(url, null, null);
	}

	/**
	 * 处理HTTP POST请求
	 * @param url 请求的URL地址
	 * @param params POST请求的请求参数，会以Form表单的方式进行传参
	 */
	public static HttpResult doPost(String url, Map<String, String> params) throws IOException {
		return doPost(url, params, null, false);
	}

	/**
	 * 处理HTTP POST请求
	 * @param url 请求的URL地址
	 * @param cookies 请求时需要带上（写入到请求头）的Cookies
	 */
	public static HttpResult doPost(String url, String[] cookies) throws IOException {
		return doPost(url, null, cookies, false);
	}

	/**
	 * 处理HTTP POST请求
	 * @param url 请求的URL地址
	 * @param params POST请求的请求参数，会以Form表单的方式进行传参
	 * @param cookies 请求时需要带上（写入到请求头）的Cookies
	 */
	public static HttpResult doPost(String url, Map<String, String> params, String[] cookies) throws IOException {
		return doPost(url, params, cookies, false);
	}

	/**
	 * 处理HTTP POST请求
	 * @param url 请求的URL地址
	 * @param params POST请求的请求参数，会以Form表单的方式进行传参
	 * @param cookies 请求时需要带上（写入到请求头）的Cookies
	 * @param retry 请求未得到响应时是否允许重试；默认不重试；设置为是则重试5遍
	 */
	public static HttpResult doPost(String url, Map<String, String> params, String[] cookies, boolean retry)
			throws IOException {
		CloseableHttpClient httpClient = retry ? HttpClients.custom().setRetryHandler(retryHandler).build()
				: HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(url);
		httpPost.setHeader("Connection", "close");

		if (ArrayUtils.isNotEmpty(cookies)) { // set Cookies
			for (String cookie : cookies) {
				httpPost.addHeader("Cookie", cookie);
			}
		}

		if (params != null && params.size() > 0) {
			List<NameValuePair> formParams = new ArrayList<NameValuePair>();
			for (Map.Entry<String, String> item : params.entrySet()) {
				formParams.add(new BasicNameValuePair(item.getKey(), item.getValue()));
			}
			UrlEncodedFormEntity formEntity = new UrlEncodedFormEntity(formParams, UTF8);
			httpPost.setEntity(formEntity);
		}

		CloseableHttpResponse response = httpClient.execute(httpPost);
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
					return doGet(location, ArrayUtils.addAll(cookies, readCookies(response)));
				}
			}

			HttpEntity entity = response.getEntity();
			return new HttpResult(readEntity(entity), ArrayUtils.addAll(cookies, readCookies(response)));
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
	 * 从Response对象中读取服务器返回的Cookies值列表
	 * @param response http请求返回的Response对象
	 */
	protected static String[] readCookies(HttpResponse response) {
		Header[] headers = response.getHeaders("Set-Cookie");
		if (headers != null) {
			String[] cookies = new String[headers.length];
			int i = 0;
			for (Header header : headers) {
				cookies[i++] = header.getValue();
			}
			return cookies;
		}
		return null;
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
