<%@ include file="/inc/page_base_head.jsp"%>

<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/reset.css?t=6.0.3336199849"/>
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/ezmark.min.css?t=6.0.671217583"/>
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/common.css?t=6.0.3047861253">
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/js/jlib/artDialog/4.1.7/skins/simple.min.css?t=5.0.3808827147">
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/reset-artDialog.min.css?t=6.0.3128532573">
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/js/jlib/imgareaselect/imgareaselect-default.css?t=5.0.1277980685">
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/commonCSS.css?t=6.0.2250813937">
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/js/jlib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.min.css?t=6.0.1765382074">
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/reset-mCustomScrollbar.min.css?t=6.0.393555021">
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/reset-easyui.css?t=6.0.1503837568" type="text/css">


<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/jquery/3.4.1/jquery-3.4.1.min.js?t=6.0.1541703249"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/jquery/3.4.1/jquery-migrate-3.1.0.min.js?t=6.0.2784881030"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/i18n/1.1/jquery.i18n.properties.js?t=5.0.1080642804"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/namespace/1.0/jquery.namespace.min.js?t=5.0.3214755290"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/artDialog/4.1.7/jquery.artDialog.min.js?t=6.0.2288083125"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/artDialog/4.1.7/plugins/iframeTools.min.js?t=5.0.3699955660"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/jquery.easyui.min.js?t=6.0.2501531710"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/mousewheel/3.1.13/jquery.mousewheel.min.js?t=6.0.1689901820"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.min.js?t=6.0.3636375954"></script>

<script src="${RESOUCE_STATIC_URL}/js/jlib/template-web.js?t=6.0.3773348943"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/ezmark/1.0/jquery.ezmark.min.js?t=5.0.851139702"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/imgareaselect/jquery.imgareaselect.pack.js?t=5.0.1441039338" ></script>

<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/utils.js?t=6.0.2571896431"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/messagebox.js?t=6.0.3966687589"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/messageboxCustom.js?t=6.0.476928025"></script>


<script type="text/javascript">
$.namespace("BP.config");
BP.config = {
	SYSTEM_URL: "${pageContext.request.contextPath}",
	STATIC_URL: "${pageContext.request.contextPath}/static",
	FILE_TYPE_ALLOW:"[rar,zip,doc,xls,ppt,pps,pdf,txt,jpg,jpeg,bmp,gif,png]",
	LANG:'${lang}',
};
$.namespace("Mo.Config");
Mo.Config = {
		appUrl:"${APP_URL}",
};
//加载重启提示图片缓存
Mo.RebootTip.loadImgCache('${RESOUCE_STATIC_URL}/images/config-wizard.png?t=6.0.1979589880');
</script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/common.js?t=6.0.4136976962"></script>
