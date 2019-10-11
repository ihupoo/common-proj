package com.kedacom.sso.portal.util;

import javax.servlet.http.HttpServletRequest;



/**
 * portalUtils
 * @author yangxufeng
 * @date 2014-7-16
 */
public class portalUtils {
    
	/**
	 * 语言设置在session中界面用
	 * @param request
	 * @param lang
	 */
	public static void setCurLanguage(HttpServletRequest request,String lang){
		String curLang=(String) request.getSession().getAttribute("lang");//获取当前语言
		if(!lang.equals(curLang)){
			request.getSession().setAttribute("lang",lang);//重新设置语言
		}
	}

}
