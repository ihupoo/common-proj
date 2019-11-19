<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="RESOUCE_STATIC_URL" value="${pageContext.request.contextPath}/static" />
<c:set var="WEIBO_RESOUCE_URL" value="/weibo" />
<c:set var="APP_RESOUCE_URL" value="/service" />
<c:set var="COMMON_RESOUCE_URL" value="${RESOUCE_STATIC_URL }/common" />

<c:set var="IS_DEBUG" value="<%=true || com.kedacom.web.utils.GlobalConstantForPage.IsDebug%>"></c:set>

<!-- 获取品牌信息  sysBrand取值:movison kedacom telecom dx6000详情见ConfigURLUtils类-->
<c:set var="sysBrand" value="<%=com.kedacom.meeting.utils.ConfigURLUtils.getSystemBrand()%>"></c:set>

