<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<div id="modifyUserWrapper" style="display:none;">
		<div class="modifyUser-content mo-dialog-content">
			<div class="title">
				<span><spring:message code='home.user.modify.title' /></span>
				<a href="javascript:void(0);" class="W_close" hidefocus="true"></a>
				<input type="hidden" id="oldAccount" name="oldAccount" value="${currentuser.account}"/>
				<input type="hidden" id="oldMobile" name="oldMobile" value="${currentuser.mobile}"/>
				<input type="hidden" id="oldEmail" name="oldEmail" value="${currentuser.email}"/>
				<input type="hidden" id="oldOfficeLocation" name="oldOfficeLocation" value="${fn:escapeXml(currentuser.seat)}"/>
			</div>
			<div class="separater"></div>
			<div class="info clearfix">
				<div class="setting-item">
					<label><spring:message code='home.user.modify.label.account' /></label>
					<div class="setting-item-main">
						<input type="text" id="account" name="account" class="input-text" value="${currentuser.account}" readonly="readonly"/>
					</div>
				</div>
				<div class="setting-item">
					<label><spring:message code='home.user.modify.label.mobile' /></label>
					<div class="setting-item-main">
						<input type="text" id="mobile" name="mobile" class="input-text" value="${currentuser.mobile}" />
					</div>
				</div>
				<div class="setting-item">
					<label><spring:message code='home.user.modify.label.email' /></label>
					<div class="setting-item-main">
						<input type="text" id="email" name="email" class="input-text" value="${currentuser.email}" />
					</div>
				</div>
				<div class="setting-item">
					<label><spring:message code='home.user.modify.label.address' /></label>
					<div class="setting-item-main">
						<input type="text" id="officeLocation" name="officeLocation" class="input-text" value="${fn:escapeXml(currentuser.seat)}" />
					</div>
				</div>
				<div class="item-msg">
					<div class="msg"></div>
				</div>
				<div class="btn-wrapper">
					<a class="btn-gray confirm btn-x btn-x-left" href="javascript:"><spring:message code='home.user.modify.btn.confirm' /></a>
					<a class="btn-gray cancel btn-x" href="javascript:"><spring:message code='home.user.modify.btn.cancel' /></a>
				</div>
			</div>
		</div>
</div>
	
<div id="modifyPasswordWrapper" style="display:none;">
		<div class="modifyPassword-content mo-dialog-content">
			<div class="title">
				<span><spring:message code='home.password.modify.title' /></span>
				<a href="javascript:void(0);" class="W_close" hidefocus="true"></a>
			</div>
			<div class="separater"></div>
			<div class="info">
				<div class="setting-item">
					<label><spring:message code='home.password.modify.label.oldPassword' /></label>
					<div class="setting-item-main">
						<input type="password" id="oldPassword" name="oldPassword" class="input-text item-old-password" value="" />
					</div>
				</div>
				<div class="setting-item">
					<label><spring:message code='home.password.modify.label.newPassword' /></label>
					<div class="setting-item-main">
						<input type="password" id="newPassword" name="newPassword" class="input-text item-new-password" value="" maxlength="16"/>
						<div class="text-tips"><spring:message code='home.password.modify.info.password.format' /></div>
					</div>
				</div>

				<div class="setting-item">
					<label><spring:message code='home.password.modify.label.conPassword' /></label>
					<div class="setting-item-main">
						<input type="password" id="confirmPassword" name="confirmPassword" class="input-text item-confirm-password" value="" maxlength="16"/>
					</div>
				</div>
				<div class="item-msg">
					<div class="msg"></div>
				</div>
				<div class="btn-wrapper">
					<a class="btn-gray confirm btn-x btn-x-left" href="javascript:"><spring:message code='home.user.modify.btn.confirm' /></a>
					<a class="btn-gray cancel btn-x" href="javascript:"><spring:message code='home.user.modify.btn.cancel' /></a>
				</div>
			</div>
		</div>
</div>

<div id="modifyUserPortaitWrapper" style="display:none;">
    <div class="mo-dialog-content">
        <div class="title">
            <span>设置头像</span>
            <a href="javascript:void(0);" class="W_close" hidefocus="true"></a>
        </div>
        <div class="separater"></div>
        <div class="info" style="width: 1000px; height: 400px;">
	        <div id="file-uploader" class="clearfix">            
	        </div>
	        <span style="float: left; margin-bottom: 15px;  margin-top: -5px;">仅支持JPG、JPEG、PNG、GIF、BMP图片文件，且文件大小为3840x3840~64x64</span>
	        <span style="float: left; margin-bottom: 10px; clear: both;">上传的图片将生成4种尺寸</span>
	        <div class="side_256"><img alt=""></div>
	        <div class="side_128"><img alt=""></div>
	        <div class="side_64"><img alt=""></div>
	        <div class="side_32"><img alt=""></div>
	        <div class="side_320">
	           <img class="img_side_320" src="${pageContext.request.contextPath}/static/images/changehead_bg.png?t=6.0.3528474740">
	        </div>
	        <div style="float: left; clear: both;">
	        <span style="margin-left: 98px;">256x256</span>
	        <span style="margin-left: 182px;">128x128</span>
	        <span style="margin-left: 84px;">64x64</span>  
	        <span style="margin-left: 44px;">32x32</span>
	        </div>
        </div>
     </div>  
</div>
