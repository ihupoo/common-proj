<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
 <head>
 	<%@ include file="/inc/page_common_head.jsp"%>
	<meta http-equiv="X-UA-Compatible"  content="IE=Edge" />
	<meta http-equiv="Content-Type"  content="text/html; charset=utf-8"/>
	<meta http-equiv="Content-Language" content="UTF-8" />
 	
	<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/reset_error.min.css?t=5.0.0.0.3555531398" />
	<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/master.min.css?t=5.0.0.0.1985908250" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/error/error.min.css"/>	
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/utils.js?t=5.0.695118352"></script>
	<script type="text/javascript">
		var path = SSO.utils.getSystemUrl('home');
		var c = 30;
		var url = "http://"+location.host+path;	
		function go(){
			document.getElementById('font_color').innerHTML = c
			c = c-1
			if(c > -1){
				if(c == 0){
					location.href = url;
				}
				t=setTimeout("go()",1000);		
			}
			document.getElementById('home').href = url;
		}
		
	</script>
   <title>404页面</title>
</head>

<body onload="go()">
<div id="wrap">
	<div id="head-nav">
		<div class="logo"></div>
	</div>
	<div id="main" class="group">
		<div class="angel left"></div>
		<div class="left" style="margin: 123px 0 0 24px;">
			<dl>
				<dt class="dt1">呃，好像出错了，休息一下先：）</dt>
				<dt class="dt2"><span id="font_color"></span>&nbsp;&nbsp;秒之后页面将自动跳转，或直接点击下方的链接直接跳转：</dt>
				<dt><a id="home" href="">返回首页</a></dt>
				<dt class="dt3">500</dt>
			</dl>
		</div>
	</div>
</div>

</body>
</html>

