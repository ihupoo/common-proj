package com.kedacom.sso.portal.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.StringUtils;


public class TimeUtil {

	private final static String dateFormat = "yyyy-MM-dd";
	private final static String dateTimeFormat = "yyyy-MM-dd hh:mm:ss";
	
	public static String dateTime2String(Date date,String format){
		if(StringUtils.isBlank(format)){
			format = dateFormat;
		}
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}
	
	public static Date string2DateTime(String date,String format) throws ParseException{
		if(StringUtils.isBlank(format)){
			format = dateTimeFormat;
		}
		DateFormat sdf = new SimpleDateFormat(format);
		return sdf.parse(date);
	}
}
