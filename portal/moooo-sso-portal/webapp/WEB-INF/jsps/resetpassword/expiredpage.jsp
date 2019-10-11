<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
	    <meta name="others" content="login_page">
		<%@ include file="/inc/page_common_head.jsp"%>
		<title>链接失效</title>
		<style type="text/css">
			 .setting-msg {
		       /* border-radius: 8px; */
       		   color: #4e4e4e;
               font-size: 14px;
              /* margin-bottom: 20px; */
              margin-top: 12px;
              /* padding: 15px 30px; */
              font-family: "Microsoft Yahei";
              line-height: 14px;
              display: block;
		   }
			#wrap{
	           padding: 0 0 0;
	        }
	        #footer{
	        }
	        #header{
	        padding:0;
	        }
	        .logo .companyName {
			    font-size: 13px;
			    color: #4b4b4b;
			}
			.logo .sep {
			    margin-left: 8px;
			    margin-right: 10px;
			}
			/**解决邮件中打开效果与浏览器打开效果不一致问题**/
		   .company-header-title{
				line-height:20px;
				height:20px;
				margin-top:35px;
		   }
	</style>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/home.css?t=6.0.2615990444" />
	  <script type="text/javascript">
		$(document).ready(function(){
			Mo.common.homeInit(Mo.CompanyInfo);
		});
	 </script>
	</head>
	<body>  
	<div id="wrap-all" class="wrap-all" style="height: 500px;">
	<div id="header" class="hd-main clearfix">
		<!-- 科达视讯（摩云视讯）和电信（阿里云电信和DX6000电信）有区别 -->
        <a id="header_title_logo" href="javascript:"></a>
	</div>
	<div class="line"></div>
	<div class="clearfix" style="margin:70px auto; width: 600px;text-align: center;">
    	<img class="expiredImg" src="${RESOUCE_STATIC_URL}/images/expiredPage_img.png?t=6.0.229543160"></img>
    	<span class="setting-msg">${message}</span>
    </div>
	</div>
	<div id="footer" class="clearfix">
		 <div class="footer_content">
         </div>
     </div>
	<script id="enterprise_introduce" type="text/html">
		        <p class="clearfix company_info">
		        	<!-- 公司名称-->
					<span class="companyName">{{companyName}}</span>
					<span class="copyright" >Copyright &copy;<span class="establishYear">{{establishYear}}</span><span class="version_year">${versionYear}</span><span class="companyDomainName">{{companyDomainName}}</span><span>.&nbspAll rights reserved.</span>
					<!-- 科达视讯无备案号 摩云视讯有备案号 阿里云电信有备案号 DX6000无备案号 -->
					<span class="icp">
						<a  href="{{icpInfoHref}}" target="_blank">{{icpInfoTxt}}</a>
					</span>				
	            </p>
	</script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/home.js?t=6.0.4291316485"></script>
	<script type="text/javascript">
	var footerHtml = template('enterprise_introduce',Mo.CompanyInfo);
	$(".footer_content","#footer").html(footerHtml);
	$(function(){
	   SSO.Size.experirdpageInit();
	});
	</script>
  </body> 
</html>
