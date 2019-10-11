<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<meta content="IE=Edge"  http-equiv="X-UA-Compatible" />
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<meta name="renderer" content="webkit">
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Content-Security-Policy" content="default-src *;style-src 'self' 'unsafe-inline';script-src 'self' 'unsafe-inline' 'unsafe-eval';img-src 'self' data: http: https:;">
<%@ include file="/WEB-INF/jsps/myArtTemplate.jsp"%>
<c:set var="RESOUCE_STATIC_URL" value="${pageContext.request.contextPath}/static" />
<%@ page import="com.kedacom.movision.common.cache.ConfigConstants"%>

<c:set var="SYSTEM_MODE" value="<%=ConfigConstants.SYSTEM_MODE%>" />
<c:set var="SYSTEM_BRAND" value="<%=ConfigConstants.SYSTEM_BRAND%>" />
<c:set var="APP_URL" value="${pageContext.request.contextPath}" />
<c:set var="sysBrand">
    <c:if test="${SYSTEM_BRAND == 0}">movision</c:if>
    <c:if test="${SYSTEM_BRAND == 1}">kedacom</c:if>
    <c:if test="${SYSTEM_BRAND == 2}">telecom</c:if>
    <c:if test="${SYSTEM_BRAND == 3}">DX6000</c:if>
</c:set>
