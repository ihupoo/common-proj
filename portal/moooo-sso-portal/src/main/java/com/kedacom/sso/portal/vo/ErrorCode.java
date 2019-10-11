/**
 * @(#)ApiCoreErrorCode.java 2018-10-19 Copyright 2018 it.kedacom.com, Inc. All rights
 *                    reserved.
 */

package com.kedacom.sso.portal.vo;

import java.io.Serializable;

import com.kedacom.movision.common.MovisionError;

/**
 * ApiCore错误XML
 * 
 * @author ranran.ye
 * @date 2018年10月19日
 */
public class ErrorCode implements Serializable {

	/** serialVersionUID */
	private static final long serialVersionUID = -4235002493542641664L;
	private String request;// 来源
	private String code;// 错误吗
	private String error;// 具体缘由

	public ErrorCode() {
	}

	public ErrorCode(String request) {
		this();
		this.request = request;
	}

	public ErrorCode(String code, String error) {
		this();
		this.code = code;
		this.error = error;
	}

	public ErrorCode(MovisionError merror) {
		this();
		this.code = merror.code();
		this.error = merror.text();
	}

	public ErrorCode(String request, String code, String error) {
		this();
		this.request = request;
		this.code = code;
		this.error = error;
	}

	/** @return the request */
	public String getRequest() {
		return request;
	}

	/** @param request the request to set */
	public void setRequest(String request) {
		this.request = request;
	}

	/** @return the code */
	public String getCode() {
		return code;
	}

	/** @param code the code to set */
	public void setCode(String code) {
		this.code = code;
	}

	/** @return the error */
	public String getError() {
		return error;
	}

	/** @param error the error to set */
	public void setError(String error) {
		this.error = error;
	}

}
