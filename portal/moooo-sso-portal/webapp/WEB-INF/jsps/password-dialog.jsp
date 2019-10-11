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
			padding: 47px 0px 0px 40px;
		}
		#turnOffWrapper #turnOff_info_wrap .label,#device-wrap .label{
			vertical-align: top;
			display: inline-block;
			padding-right: 22px;
		}
		#turnOffWrapper #turnOff_info,#device-info{
			display: inline-block;
			height: 70px;
		}
		#turnOffWrapper #turnOff_info .inputWrap{
			width: 224px;
			border-bottom: 1px solid #333;
			margin-bottom: 13px;
			position: relative;
			height: 19px;
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
		$(function() {
			var baseUrl =BP.config.SYSTEM_URL;
			$.dialog.data("action", "cancel");
			var currentIp = "${currentIp}"

			var friendTip = $.dialog.data("friendTip");
			if(friendTip == 'reboot'){
				$(".friendTips").text("你将要重启设备"+currentIp+"，重启过程中请勿切电源！");
			}else if(friendTip== 'shutdown'){
				$(".friendTips").text("你将要关闭设备"+currentIp+"，关机过程中请勿切电源！");
			}
			
			$("#turnOffWrapper input").on("keyup",function(){
	            if($(this).val()){
	                $('#turnOffWrapper .pwdEye').show()
	                restShow();
	            }else{
	                $('#turnOffWrapper .pwdEye').hide()
	            }
	        });
			 
	        $("#turnOffWrapper .pwdEye").on("click",function(){
				$(this).toggleClass('active')
				if($(this).hasClass('active')){
	                $("#turnOffWrapper input").prop("type",'text')
				}else{
	                $("#turnOffWrapper input").prop("type",'password')
				}
	        });
			
			// 确定
			$(".confirm").click(function() {
				var url = baseUrl + "/checkADPassword/check";
				if (Mo.Base.throttle.isLock(url)) {
					return false;
				}
				if(''==$.trim($(".turnOff_password").val())){
					hidenAll();
					$(".inputTip").show();
					return;
				}
				var data = {"needCheckPD":$.trim($(".turnOff_password").val())};
				Mo.Base.throttle.lock(url); // 正在处理中...
				$.post(url,data,function(t) {
					Mo.Base.throttle.unLock(url);
					if (t.success) {
						$.dialog.data("needCheckPD",data.needCheckPD);
						$.dialog.data("action", "ok");
						$.dialog.close();
					}else{
						hidenAll();
						$(".errorTip").show();
					}
				}, "json").error(function() {
					Mo.alert("出现未知错误，请检查网络是否正常！");
					Mo.Base.throttle.unLock(url);
				});
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
		
		var hidenAll = function() {
			$(".errorTip").hide();
			$(".friendTips").hide();
			$(".inputTip").hide();
		};
		
		var restShow = function() {
			$(".errorTip").hide();
			$(".friendTips").show();
			$(".inputTip").hide();
		};
	
	</script>
</head>
<body>
	<div id="turnOffWrapper" style="width: 400px;height:260px;">
		<div class="about-content mo-dialog-content" style="overflow:visible;">
			<div class="title">
				<span>提示</span>
				<a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
			</div>
			<div class="separater"></div>
			<div id="turnOff_info_wrap">
				<span class="label">密码</span>
				<div id="turnOff_info">
					<div class="inputWrap">
						<input type="password" style="display: none">
						<input class = "turnOff_password" type="password" autocomplete="new-password" placeholder="请输入密码" >
						<a href="javascript:void(0);" class="pwdEye"></a>
					</div>
					<p class="friendTips"></p>
					<p class="errorTip">密码错误，请输入超级管理员密码</p>
					<p class="inputTip">请输入超级管理员密码</p>
				</div>
			</div>
			<div id="turnOffFooter">
				<a class="mo-btn-gray confirm mo-btn-x mo-btn-x-left" data-action="ok" href="javascript:">确定</a>
				<a class="mo-btn-gray cancel mo-btn-x mo-btn-x-left" data-action="cancel" href="javascript:" style="margin-left:6px;">取消</a>
			</div>
		</div>
	</div>
</body>
</html>
