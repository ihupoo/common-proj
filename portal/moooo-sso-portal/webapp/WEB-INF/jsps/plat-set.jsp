<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta name="others" content="login_page">
    <%@ include file="/inc/page_common_head.jsp"%>
    <title></title>
    <style type="text/css">
        a:link {
            color:#000000;
            text-decoration:none;
        }
        a:visited {
            color:#000000
        }
        .icp a{
            font-family:"Microsoft Yahei";
            color:#606060;
            margin-left:22px;
        }
        .icp a:hover{
            color:#007ac0;
            text-decoration:underline;
        }
        .meun-short{
            width: 775px;
            height: 82px;
            margin:0 auto;
            overflow: hidden;
            float : left;
        }
        .menu-long{
            height: 82px;
            /*     text-align: left; */
            margin: auto;
        }

        #sys_nav .menu-long a{
            text-align: center;
            margin-left: 48px;
            margin-right: 48px;
        }

        .a_left{
            float : left;
            margin-top: 10px;
            visibility: hidden;
        }

        .a_right{
            float : left;
            margin-top: 10px;
            margin-left: 20px;
            visibility: hidden;
        }

        #sys_nav {
            margin: 0 auto;
            width: 900px;
        }

        .detail-header {
            color: #4e4e4e;
            height: 59px;
        }
        .detail-header .tab-item.active {
            background: #69bef0 url("${RESOUCE_STATIC_URL}/images/btn-bg-large.png?t=6.0.4050818801") repeat-y scroll 0 0;
            border-color: transparent;
            color: #fff;
        }
        .mo-btn-x {
            border: 1px solid #dcdfe1;
            cursor: pointer;
            display: inline-block;
            font-size: 12px;
            height: 23px;
            line-height: 23px;
            padding: 0 22px;
            text-align: center;
        }

        .set-content{
            margin: 0 auto;
            min-width: 1024px;
            padding-bottom:80px;
        }

        .detail-header .operate {
            float: right;
            margin-top: 14px;
        }
        .btn-wrapper .mo-btn-gray {
            background-color: #eff2f4;
            color: #5f5f5f;
        }

        .mo-btn-x-left {
            margin-right: 6px;
        }
        .detail-content .data-li {
            list-style-type: none;
            min-height: 30px;
            padding: 6px 0;
        }

        .data-li .title {
            line-height: 30px;
            text-align: left;
            width: 123px;
        }

        .data-li .input {
            vertical-align: middle;
            width: 303px;
        }

        .e-input {
            -moz-border-bottom-colors: none;
            -moz-border-left-colors: none;
            -moz-border-right-colors: none;
            -moz-border-top-colors: none;
            background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
            border-color: -moz-use-text-color -moz-use-text-color #949799;
            border-image: none;
            border-style: none none solid;
            border-width: medium medium 1px;
            color: #616060;
            font-size: 12px;
            vertical-align: middle;
        }

        .detail-content td input {
            line-height: 14px;
            outline: 0 none;
            width: 100%;
        }

        .extNum_input_wrapper .tip_label {
            top: 0px;
            height: 15px;
            position: absolute;
            bottom: 4px;
            color: #616060;
            cursor: text;
            text-align: center;
            line-height: 11px;
            font-size: 11px;
        }

        .hidden {
            display: none;
        }

        .checkDiv .space {
            display: inline-block;
            width: 30px;
        }
        .color-6{
            color : #616060
        }
        div.preview_div{
            overflow:hidden;
        }

        .about-content.mo-dialog-content{
            padding-top: 0px;
            padding-bottom: 0px;
            padding-left: 16px;
            padding-right: 16px;
        }
        .about-content.mo-dialog-content .title{
            margin-top: 0px;
        }

        .mo-dialog-content .info{
            margin-left: 34px;
            margin-right: 34px;
            margin-top: 0px;
        }
        .about_x .about_netAddress1 {
            color: #007ac0;
            text-decoration: underline;
        }
        .public-private-cloud-content{
            display: none;
        }
        .change-account .warn-info {
            position: relative;
            top: 55px;
            text-align: left;
            line-height: 21px;
            color: #4e4e4e;
            font-size: 12px;
            margin-left: 27px;
        }
        .change-account .tipImage{
            top:55px;
            height: 28px;
            margin-left: 0;
        }
        .base-input-wrap .bmc-accountInput-tipMsg{
            top:18px;
        }
        .mo-btn-gray:hover{
            color:#fff;
        }
        #editor-ui .combo-arrow{
            height: 19px!important;
            width: 19px!important;
            position: relative;
            /*left: -4px;*/
        }
        .footerWrap{
            padding-left: 128px;
            padding-right: 128px;
        }
        .mo-btn-gray:hover {
            background-size: cover;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/fileuploader-min.css?t=6.0.1517919198"/>
    <link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/set.css?t=6.0.249790700"/>
    <script type="text/javascript" src="${pageContext.request.contextPath }/static/js/fileuploader.js?t=6.0.981451528"></script>
    <%@ include file="/inc/plugins/plugin_easyui.jsp"%>
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/plat-set.js?t=6.0.2293669324"></script>
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/browser-polyfill.min.js?t=6.0.299853946"></script>
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/md5.min.js?t=6.0.3467134369"></script>
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/sm.min.js?t=6.0.3747877542"></script>
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/digestAuth.min.js?t=6.0.444683133"></script>
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/password.js?t=6.0.3033644830"></script>
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/home.css?t=6.0.2615990444" />
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/password.css?t=6.0.3974162316" />
    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/jlib/portal/mo-portal.min.js?t=6.0.1135503165"></script>
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/jlib/portal/styles/css/mo-portal.min.css?t=6.0.2644823526" />
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/js/jlib/components/styles/css/mo-portal.min.css?t=6.0.112740787"/>
    <script src="${RESOUCE_STATIC_URL}/js/jlib/components/mo-portal.min.js?t=6.0.2184442885"></script>
</head>
<body class="bg">
<input type="hidden" id="moid" value="${currentuser.moid}">
<div id="wrap" class="clearfix">
    <%@ include file="/inc/page_head_nav.jsp"%>

    <div id="inner-main-content" class="inner-main-content">
        <div class="line"></div>
        <div id="main-nav" class="main-nav">
            <ul>
                <li><a herf=""></a></li>
            </ul>
        </div>
        <div id="main-content">
            <div class="set-content">
                <div class="detail-header">
                    <div class="tabs" style="border-style: none; width: 500px; padding-left: 0px;">
                        <a href="#profile" class="tab-item profile mo-btn-x" data-tab="profile">个人信息</a>
                        <a href="#portrait" class="tab-item portrait mo-btn-x" data-tab="portrait">头像</a>
                        <a href="#password" class="tab-item password mo-btn-x" data-tab="password">修改密码</a>
                        <a class="tipPass"  style="color:#d21e1e; display:none"><c:if test="${currentuser.moid=='mooooooo-oooo-oooo-oooo-defaultadmin'}">请设置强度等级为中或强的密码</c:if></a>
                        <span class="password-tip tab-tip hidden" style="height:23px;line-height:23px;color:#d21e1e;font-weight:bold;"><c:if test="${securityPolicy.passwordStrength==2}">密码等级应为中或者强</c:if><c:if test="${securityPolicy.passwordStrength==3}">密码等级应为强</c:if></span>

                        <!--  <a href="#language" class="tab-item language mo-btn-x" data-tab="language">语言选择</a>
                         <a href="#gmt" class="tab-item gmt mo-btn-x" data-tab="gmt">时区</a> -->
                    </div>
                    <div class="operate">
                        <div id="detail-btn-save" class="mo-btn-gray mo-btn-x mo-btn-x-left">保存</div>
                        <div id="detail-btn-cancel" class="mo-btn-gray mo-btn-x">取消</div>
                    </div>

                </div>

                <div class="detail-body">
                    <div class= "detail-content">
                        <form class="profile-form">
                            <ul id="editor-ui" >

                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <div id="account"></div>
                                        <tr id="account-readonly">
                                            <td class="title">账号</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <span class="color-6">${currentuser.account}</span>
                                                </div>
                                            </td>
                                            <td class="operate"></td>
                                        </tr>
                                    </table>
                                </li>

                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">姓名</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <c:if test="${editName}"> <input id="username" name="username" class="e-input" value="${fn:escapeXml(currentuser.name)}" maxlength="21"/></c:if>
                                                    <c:if test="${!editName}"> <span class="color-6">${fn:escapeXml(currentuser.name)}</span></c:if>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">电子邮箱</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <input type="text" id="email" name="email" class="e-input" value="${currentuser.email}" maxlength="64"/>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">手机</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <input type="text" id="mobile" name="mobile" class="e-input" value="${currentuser.mobile}" maxlength="11"/>
                                                </div>
                                            </td>
                                            <td class="operate">
                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">座机</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <input type="hidden" id="extNum" name="extNum" class="e-input" value="${currentuser.extNum}" />
                                                    <div style="float: left;" class="extNum_input_wrapper">
                                                        <input type="text" id="extNum1" name="extNum1" class="e-input" value="" style="width: 60px" maxlength="4">
                                                        <label class="tip_label" style="width: 60px; left: 0px;">区号</label>
                                                    </div>
                                                    <div style="float: left; width: 19px; text-align: center;">-</div>

                                                    <div style="float: left;" class="extNum_input_wrapper">
                                                        <input type="text" id="extNum2" name="extNum2" class="e-input" value="" style="width: 125px" maxlength="16"/>
                                                        <label class="tip_label" style="width: 125px; left: 80px;">电话</label>
                                                    </div>
                                                    <div style="float: left; width: 19px; text-align: center;">-</div>

                                                    <div style="float: left;" class="extNum_input_wrapper">
                                                        <input type="text" id="extNum3" name="extNum3" class="e-input" value="" style="width: 80px" maxlength="10"/>
                                                        <label class="tip_label" style="width: 80px; left: 220px;">分机</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">E164号码</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <span class="color-6">${currentuser.e164}</span>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <%--性别 null或者空或者1都默认男 0才是女--%>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">性别</td>
                                            <td class="input">
                                                <div class="checkDiv">
                                                    <input type="radio" id="sex_m" name="sex" value="1" <c:if test="${currentuser.sex==1||currentuser.sex==''||currentuser.sex==null}">checked</c:if>/>
                                                    <label for="" style="margin-left: 10px;">男</label>
                                                    <div class="space"></div>
                                                    <input type="radio" id="sex_w" name="sex" value="0" <c:if test="${currentuser.sex!=''&&currentuser.sex==0}">checked</c:if>/>
                                                    <label for="" style="margin-left: 10px;">女</label>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">出生日期</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <input type="text" id="birthday" name="birthday" value="${brithday}" class="input-text sep endDate" style="width: 303px"/>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">传真</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <input id="fax" name="fax" class="e-input" value="${currentuser.fax}" maxlength="32"/>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">办公位置</td>
                                            <td class="input">
                                                <div class="inputDiv">
                                                    <input id="seat" name="seat" class="e-input" value="${currentuser.seat}" maxlength="60"/>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">所属部门</td>
                                            <td class="input">
                                                <div class="inputDiv">
                           <span class="color-6">
                           <c:forEach items="${currentuser.depts}" var="dept" >
                               <c:if test="${flagName}">,</c:if>
                               ${dept.departmentName}
                               <c:set var="flagName" value="true" scope="request"/>
                           </c:forEach>
                           </span>
                                                </div>
                                            </td>
                                            <td class="operate">
                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">职位</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                          <span class="color-6">
                           <c:forEach items="${currentuser.depts}" var="dept" >
                               <c:if test="${not empty dept.deptPosition}">
                                   <c:if test="${flagPosition}">,</c:if>
                                   ${dept.deptPosition}
                                   <c:set var="flagPosition" value="true" scope="request"/>
                               </c:if>
                           </c:forEach>
                           </span>
                                                </div>
                                            </td>
                                            <td class="operate">

                                            </td>
                                        </tr>
                                    </table>
                                </li>

                            </ul>
                        </form>
                        <!--password---->
                        <form class="password-form">
                            <ul id="editor-ui" >
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">当前密码</td>
                                            <td class="input" style="position: relative;">
                                                <div  class="inputDiv">
                                                    <input type="password" id="oldPassword" name="oldPassword" class="e-input item-old-password" value="" maxlength="16" />
                                                    <span class="showHidePassword eye-bg"></span>
                                                    <div class="capitals-tip displayNone" id="capital_oldPassword"><span>大写已开启</span></div>
                                                </div>
                                                <span class ="showTip" style="color:#d21e1e; display:none;position:absolute;"><c:if test="${currentuser.moid=='mooooooo-oooo-oooo-oooo-defaultadmin'}">密码修改后，需使用新密码重新登录，请牢记新密码！</c:if></span>
                                            </td>
                                            <td class="oldPasswordTip" style="vertical-align:middle">
                                                <div class="tipWrapper">
                                                    <span class="tip-icon"></span>
                                                    <span class="tip-info"></span>
                                                </div>
                                            </td>
                                            <td class="operate">
                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li" style="height: 30px;">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">新密码</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <input type="password" id="newPassword" name="newPassword" class="e-input item-new-password" value="" maxlength="16"/>
                                                    <span class="showHidePassword eye-bg" ></span>
                                                    <div class="text-tips displayNone" style="position: absolute">
                                                        长度8-16个字符，包含数字、大小写字母、符号"_" "."
                                                    </div>
                                                    <div class="capitals-tip displayNone" id="capital_newPassword"><span>大写已开启</span></div>
                                                </div>
                                            </td>
                                            <td class="newPasswordTip">
                                                <div class="tipWrapper">
                                                    <span class="tip-icon"></span>
                                                    <span class="tip-info"></span>
                                                    <a class="help displayNone">帮助</a>
                                                    <div class="help-info displayNone">
                                                        <ul>
                                                            <li class="help-title">密码安全</li>
                                                            <li class="weak-help help-li">
                                                                <p>弱：包含数字或字母字符两种类型中的一种。</p>
                                                                <p class="help-first">示例：66666666</p>
                                                                <p class="help-none-first">aaaabbbccc</p>
                                                            </li>
                                                            <li class="medium-help help-li">
                                                                <p>中：包含数字或字母或特殊字符三种类型中的两种。</p>
                                                                <p class="help-first">示例：6342a423</p>
                                                                <p class="help-none-first">1.1233.2</p>
                                                                <p class="help-none-first">A123131</p>
                                                            </li>
                                                            <li class="strong-help help-li">
                                                                <p>强：必须包含数字、字母和特殊字符三种类型。</p>
                                                                <p class="help-first">示例：1231.1aA</p>
                                                                <p class="help-none-first">1231.2a</p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="operate">
                                            </td>
                                        </tr>
                                    </table>
                                </li>
                                <li class="data-li">
                                    <table style="table-layout:fixed">
                                        <tbody>
                                        <tr>
                                            <td class="title">确认密码</td>
                                            <td class="input">
                                                <div  class="inputDiv">
                                                    <input type="password" id="confirmPassword" name="confirmPassword" class="e-input item-confirm-password" value="" maxlength="16"/>
                                                    <span class="showHidePassword eye-bg" ></span>
                                                    <div class="capitals-tip displayNone" id="capital_confirmPassword"><span>大写已开启</span></div>
                                                </div>
                                            </td>
                                            <td class="confirmPasswordTip">
                                                <div class="tipWrapper">
                                                    <span class="tip-icon"></span>
                                                    <span class="tip-info"></span>
                                                </div>
                                            </td>
                                            <td class="operate">
                                            </td>
                                        </tr>
                                    </table>
                                </li>
                            </ul>
                        </form>
                        <!--portrait---->
                        <form class="portrait-form">
                            <input type="hidden" id="fileName">
                            <input type="hidden" id="selection">
                            <div class="mo-dialog-content" style="padding-top: 32px;">
                                <div style="width: 1000px; height: 400px;">
                                    <div id="file-uploader" class="clearfix">
                                    </div>
                                    <span style="float: left; margin-bottom: 20px;  margin-top: 10px;">仅支持JPG、PNG、GIF、BMP图片文件，且文件大小为3840x3840~64x64</span>
                                    <span style="float: left; margin-bottom: 10px; clear: both;">上传的图片将生成4种尺寸</span>
                                    <div class="side_256 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_256"></div>
                                    <div class="side_128 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_128"></div>
                                    <div class="side_64 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_64"></div>
                                    <div class="side_32 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_32"></div>
                                    <div class="side_320" style="position:relative;">
                                        <img id="img_side_320" class="img_side_320" src="${pageContext.request.contextPath}/static/images/changehead_bg.png?t=6.0.3528474740">
                                    </div>
                                    <span class="img_span">您要上传的图片</span>
                                    <div style="float: left; clear: both;">
                                        <span style="margin-left: 98px;">256x256</span>
                                        <span style="margin-left: 182px;">128x128</span>
                                        <span style="margin-left: 84px;">64x64</span>
                                        <span style="margin-left: 44px;">32x32</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <!--language-->
                        <!-- <form class="language-form">
                      <ul id="editor-ui" >
                         <li>语言包Build3实现</li>
                      </ul>
                      </form>

                      <form class="gmt-form">
                      <ul id="editor-ui" >
                         <li>时区Build3实现</li>
                      </ul>
                      </form> -->



                    </div>
                </div>
                <!--             <div class="detail-footer"></div> -->
            </div>

        </div>

        <div class="line"></div>

    </div>


</div>
<div class="hidden">
    <div id="confirmAccount">
        <div class="change-content mo-dialog-content w400h260">
            <div class="title" style="margin-top: 0px;margin-bottom: 3px;">
                <span>提示</span>
                <a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
            </div>
            <div class="separater"></div>
            <div class="info change-account">
                <div class="tipImage"></div>
                <div class="warn-info">账号修改后，请牢记新账号！<br/>账号丢失后无法找回，需返厂进行初始化。</div>
            </div>
            <div class="btn-wrapper">
                <a class="mo-btn-gray save mo-btn-x  color-6" href="javascript:">修改账号</a>
                <a class="mo-btn-gray cancel mo-btn-x color-6" href="javascript:">取消</a>
            </div>
        </div>
    </div>
    <div id="passwordUpdate">
        <div class="change-content mo-dialog-content w400h260">
            <div class="title" style="margin-top: 0px;margin-bottom: 3px;">
                <span>提示</span>
                <a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
            </div>
            <div class="separater"></div>
            <div class="info change-account">
                <div class="tipImage"></div>
                <div class="warn-info">密码修改后，请牢记新密码！<br/>未配置邮箱将密码丢失后无法找回，需返厂进行初始化。</div>
            </div>
            <div class="btn-wrapper">
                <a class="mo-btn-gray save mo-btn-x mo-btn-x-left color-6" href="javascript:">重置密码</a>
                <a class="mo-btn-gray cancel mo-btn-x color-6" href="javascript:">取消</a>
            </div>
        </div>
    </div>
    <div id="changeWrapper">
        <div class="change-content mo-dialog-content w400h260">
            <div class="title">
                <span>提醒</span>
                <a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
            </div>
            <div class="separater"></div>
            <div class="info">
                <div class="msg"><span>内容已修改，是否保存？</span></div>

            </div>
            <div class="btn-wrapper">
                <a class="mo-btn-gray save mo-btn-x mo-btn-x-left" href="javascript:">保存</a>
                <a class="mo-btn-gray cancel mo-btn-x" href="javascript:">取消</a>
            </div>
        </div>
    </div>
</div>
<div id="footer" class="clearfix footerWrap" style="height:85px">
    <div class="footer_content">
    </div>
</div>
<%@ include file="/inc/page_base_nav_menu_pop.jsp"%>
</body>
<%--   <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/artTemplate/1.4/template.min.js?t=5.0.4284117368"></script> --%>
<%--   <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/artTemplate/1.4/template-syntax.min.js?t=5.0.4213305808"></script> --%>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/home.js?t=6.0.4291316485"></script>
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
<script type="text/javascript">
    var username = "${currentuser.account}";
    var editName= ${editName};
    var userMoids = $("#moid").val();
    Mo.Base.DigestAuth.realm = "${realmName}";
    Mo.Base.DigestAuth.username = "${currentuser.moid}";
    var footerHtml = template('enterprise_introduce',Mo.CompanyInfo);
    $(".footer_content","#footer").html(footerHtml);
    var systemSecurity = "${systemSecurity}";
    var strengthRegular = ${strengthRegular};
    var passwordStrengthOfSecurityPolicy = "${securityPolicy.passwordStrength}";
    var portrait40 = '${currentuser.portrait40}';
    var portrait64 = '${currentuser.portrait64}';
    var portrait128 = '${currentuser.portrait128}';
    var portrait256 = '${currentuser.portrait256}';
    var portraitDomain = '${portraitDomain}';
    var options = {
        oldPasswordId:"#oldPassword",
        newPasswordId:"#newPassword",
        confirmPasswordId:"#confirmPassword",
        strongAuthentication: true,
        checkUsed: true
    }
    $(document).ready(function(){
        Mo.updataAccount.init();
        Mo.ExtNum.init();
        Mo.Set.init();
        SSO.common.modifyPortait.initUpLoad();
        /*  Mo.SetFrame.init(); */
        Mo.SetFrame.loadPlatSet();
        $(window).resize(function(){
            Mo.SetFrame.loadPlatSet();
        });
        SSO.common.setDefaultImg('.user-info');
        SSO.common.initPortrait(portrait40, portraitDomain);
        if (portrait256 && portraitDomain) {
            var domain = '//' + portraitDomain + '/';
            $('.img_32').attr('src', domain + portrait40);
            $('.img_64').attr('src', domain + portrait64);
            $('.img_128').attr('src', domain + portrait128);
            $('.img_256').attr('src', domain + portrait256);
        }
        $("#help").attr("href","${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html");
        Mo.common.homeInit(Mo.CompanyInfo);
        Mo.common.aboutInit(Mo.CompanyInfo);
        Mo.Password.init(options);
        Mo.Password.capitalTip("oldPassword")
        Mo.Password.capitalTip("newPassword")
        Mo.Password.capitalTip("confirmPassword");
    });
</script>
</html>
