<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta name="others" content="login_page">
    <%@ include file="/inc/page_common_head.jsp"%>
	<title>IP</title>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/jlib/portal/mo-portal.min.js?t=6.0.1135503165"></script>
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/jlib/portal/styles/css/mo-portal.min.css?t=6.0.2644823526" />
	<style>
		#turnOffWrapper #turnOff_info_wrap,#device-wrap{
			padding: 55px 0px 0px 40px;
		}
		#turnOffWrapper #turnOff_info_wrap .label,#device-wrap .label{
			vertical-align: top;
			display: inline-block;
			padding-right: 22px;
		}
		#turnOffWrapper #turnOff_info,#device-info{
			display: inline-block;
			height: 30px;
			vertical-align: top;
		}
		#turnOffWrapper #turnOff_info .inputWrap{
			width: 224px;
			border-bottom: 1px solid #333;
			margin-bottom: 13px;
			position: relative;
			height: 19px;
		}
		#turnOffWrapper #turnOff_info .inputWrap .pwdEye{
			display: none;
			/*display: inline-block;*/
			position: absolute;
			right: 0px;
			width: 18px;
			height: 12px;
			bottom: 2px;
			background:url("${RESOUCE_STATIC_URL}/images/pwd.png?t=6.0.1347910496") 0 0 no-repeat;
		}
		#turnOffWrapper #turnOff_info .inputWrap .pwdEye.active{
			background-position:  -20px 0;
		}
		#turnOffWrapper #turnOff_info input{
			outline:none;
			outline-style: none;
			width: 222px;
			line-height: 18px;
			height: 18px;
			background: none;
		    border: none;
		    /* border-bottom: 1px solid #949799; */
		}
		#turnOffWrapper #turnOff_info input::-ms-reveal{display:none;}
		#turnOff_info .errorTip,.inputTip{
			display: none;
		    color: #C5140D;
		}
		#turnOffFooter{
			text-align: center;
			margin-top: 45px;
		}
	</style>
	<script>
		var currentIps = ${currentIps};
		$(function() {
			var baseUrl =BP.config.SYSTEM_URL;
			$.dialog.data("action", "cancel");

			var operate = $.dialog.data("operate");
			if(operate == "reboot"){
				var tips={prompt:"请选择重启设备",friendTips:"注意：设备重启过程中，请勿切断电源。",label:"选择重启设备",title_name:"重启"}
			}else if(operate == "shutdown"){
				var tips={prompt:"请选择关机设备",friendTips:"注意：设备关机过程中，请勿切断电源。",label:"选择关机设备",title_name:"关机"}
			}
			$(".title_name").text(tips.title_name);
			$(".friendTips").text(tips.friendTips);
			$(".label").text(tips.label);
			
			var comb = portal.Combox("#device-info", {
	                width:160,
	                prompt:tips.prompt
	         });

			if(!!currentIps){
				comb.loadData(currentIps);
				if(!!currentIps[0]){
					comb.setValue(currentIps[0].value);
				}
			} 
			
			// 确定
			$(".confirm").click(function() {
				if(!comb.getValue()){
					$(".friendTips").html("<span style ='color:red'>请选择设备</span>");
				}
				$.dialog.data("needOperateIPCount",currentIps.length);
				$.dialog.data("needOperateIP",comb.getValue());
				$.dialog.data("operate",operate);
				$.dialog.data("action", "ok");
				$.dialog.close();
			});
	
			// 取消
			$(".cancel").click(function() {
				$.dialog.close();
			});
	
			// 关闭对话框
			$(".w-close").click(function() {
				$.dialog.close();
			});
		});
		
	</script>
</head>
<body>
	<div id="turnOffWrapper" style="width: 400px;height:260px;">
		<div class="about-content mo-dialog-content" style="overflow:visible;">
			<div class="title">
				<span class="title_name"></span>
				<a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
			</div>
			<div class="separater"></div>
			<div id="device-wrap">
				<span class="label"></span>
				<div id="device-info"></div>
				<p class="friendTips"></p>
			</div>
			<div id="turnOffFooter">
				<a class="mo-btn-gray confirm mo-btn-x mo-btn-x-left" data-action="ok" href="javascript:">确定</a>
				<a class="mo-btn-gray cancel mo-btn-x mo-btn-x-left" data-action="cancel" href="javascript:" style="margin-left:6px;">取消</a>
			</div>
		</div>
	</div>
</body>
</html>
