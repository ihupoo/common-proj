$.namespace("Mo.SetFrame");
Mo.SetFrame = {
	default_detail_paddingTop : 0, // 默认详细表单顶部偏移量
	default_detail_paddingLeft : 0, // 默认详细表单左边偏移量
    main_min_width:1280,
    main_padding_left:128,
    main_min_height:650,
    main_padding_bottom:83,
    main_top_height:98,

    fixLineHeight:2,

    init:function(){
        this.setSize();
        SSO.common.headerEvent();
        this.initEvent();
        
    },

    initEvent:function(){
        var that = this;
        $(window).resize(function(){
            that.setSize();
        })
    },

    setSize:function(){
       var win = this.getWindowSize();
       if(win.w<this.main_min_width){
          win.w = this.main_min_width;
       }

      if(win.h<this.main_min_height){
          win.h = this.main_min_height;
       }
       var wrapW = win.w-(this.main_padding_left*2);
       var wrapH = win.h;
       var tabname = Mo.Set.getTabName();
	   $(".wrap-all").width(wrapW);
	   $(".wrap-all").height(win.h);
	   var innerHeight = win.h-this.main_top_height-this.main_padding_bottom;
	       
	   $("#inner-main").height(innerHeight);
	   var viewHeight = innerHeight-(this.fixLineHeight*2);
	   $("#main-content").height(viewHeight);
	   $(".detail-body").height(viewHeight-$(".detail-footer").height()-$(".detail-header").height());
    },
    loadPlatSet:function (){
    	var wH = $(window).height();
        var innerHeight =wH - this.main_top_height - this.main_padding_bottom;
        var viewHeight = innerHeight-(this.fixLineHeight*2)-80;
        $(".set-content").css("min-height",viewHeight);
        if('password'==$(".tabs .active").attr("data-tab")){
        	$("#detail-btn-save").addClass('disabled');
        }else{
        	$("#detail-btn-save").removeClass('disabled');
        }
    },
    getWindowSize:function(){
        var w = ($(window).width());
        var h = ($(window).height());
        return {w:w,h:h};
    },

    getSideW:function(){
      return 0;
    }
}
$.namespace("Mo.updataAccount")
Mo.updataAccount = {
    init:function(){
        this.initEvent()
    },
    accountInput:'',
    initEvent:function () {
        if(Mo.Base.DigestAuth.username=='mooooooo-oooo-oooo-oooo-defaultadmin'){//超管
            $('#account').show()
            $("#account-readonly").hide();
        }else{
            $('#account').hide()
            $("#account-readonly").show();
        }
        this.accountInput=portal.AccountInput("#account", {
            label:'账号',
            labelWidth:120,
            value:username,
            require:true,
            readonly:true,
            name:'account',
            placeholder:'请输入账号',
            tipMsg:'账号修改后，需使用新账号重新登录，请牢记新账号！',
            editFun:function(cb){
                $.dialog({
                    padding: 0,
                    id: "confirmAccount",
                    content: document.getElementById('confirmAccount'),
                    lock: true,
                    opacity: 0.50,	// 透明度
                    cancel:false, // 隐藏关闭按钮
                    drag: false // 不允许拖拽
                });
                $(".save", "#confirmAccount").off('click').on("click",function(){
                    $.dialog({id: 'confirmAccount'}).close();
                    cb();
                    $("#account .bmc-accountInput-tipMsg").show();
                    $("#detail-btn-save").addClass("disabled")
                });
            },
            comfirmFun:function(cb){
                var value=$('#account .base-input').val();
                if(!Mo.Base.account.checkAccount(value)){
                    return false
                }
                cb();
                $("#detail-btn-save").removeClass("disabled")
            },
        });
        $(".w-close", "#confirmAccount").off('click').on("click",function(){
            $.dialog({id: 'confirmAccount'}).close();
        });
        $(".cancel", "#confirmAccount").off('click').on("click",function(){
            $.dialog({id: 'confirmAccount'}).close();
        });
    }
}
$.namespace("Mo.Set")
Mo.Set = {
    profileHref:false,//记录是否从个人设置tab标签页进入的密码修改页面 默认false
	init:function(){
		Mo.Form.store.storePass = $(".password-form").html()
		$(".endDate").datebox({
            editable:false,
            panelWidth:300
        });
    	
    	$('input[type="radio"]').ezMark();
    	
    	$(".endDate").datebox({
    		editable:false,
    		panelWidth:300
    	});
    	$(".datebox :text").attr("readonly","readonly");
		this.initTab();
		this.initEvent();
		Mo.Set.change.init();
		SSO.Size.init();
	},
	initEvent:function(){
		
		$("#detail-btn-cancel").on("click",function(){
			location.href= BP.config.SYSTEM_URL+"/home";
		});
		$("#detail-btn-save").on("click",function(){
			if(!($("#detail-btn-save").hasClass("disabled"))){
				Mo.Set.save();
			}
		});
		$(".tab-item").on("click",function(){
			if('password'==$(this).attr("data-tab")){
	        	$("#detail-btn-save").addClass('disabled');
	        }else{
	        	$("#detail-btn-save").removeClass('disabled');
	        }
		});
		SSO.common.headerEvent();
	},
	save:function(){
		var tabname = this.getTabName();
		var that = this;
		switch(tabname){
			case "profile":{
				this.profileSave();
				break;
			}
			case "password":{
				this.passwordSave();
				break;
			}
			case "gmt":{
				this.gmtSave();
				break;
			}
			case "language":{
				this.languageSave();
				break;
			}
			case "portrait":{
				this.portraitSave();
				break;
			}
		}
	},
	getProfileData: function(){
        var newAccount=$('#account .base-input').val();
		var account="";//超管传
        if(Mo.Base.DigestAuth.username=='mooooooo-oooo-oooo-oooo-defaultadmin'){//超管
            if(username&&newAccount&&(username!=newAccount)){//并修改了账号
                account=newAccount
            }
        }
		var data = {
				moid: $("#moid").val(),
            	account:account,
				name:$.trim($("#username").val()),
				email:$.trim($("#email").val()),
				mobile:$.trim($("#mobile").val()),
				extNum:$.trim($("#extNum").val()),
				extNum1:$.trim($("#extNum1").val()),
				extNum2:$.trim($("#extNum2").val()),
				extNum3:$.trim($("#extNum3").val()),
				sex:$('input:radio[name=sex]:checked').val(),
				birthday:$('#birthday').datebox('getValue'),
				fax:$.trim($("#fax").val()),
				seat:$.trim($("#seat").val())
			};
            //校验用户账号
			if (newAccount == "") {
				alert('请输入账号', function() {
                    $('#account .base-input').focus();
				});
				return false;
			}
			//校验用户姓名
			if(editName){
				if (data.name == "") {
					alert('请输入姓名', function() {
						$('#name').focus();
					});
					return false;
				}
            }
			if(data.name.match(/\<|\>|"|'|\/|\\/ig)){
				alert('姓名不能包含敏感字符 >\'<\"\\\/', function() {
					$('#name').focus();
				});
				return false;
			}
			if(data.email && !SSO.verify.email(data.email)){
				alert("请输入正确的邮箱地址");
				$("#email").focus();
				return false;
			}
			
			if(data.email && !SSO.Base.validation.checkLength(data.email,64)){
				alert("邮箱地址长度不能大于64位字符");
				$("#email").focus();
				return false;
			}

			if(data.mobile && !SSO.verify.mobile(data.mobile)){
				// alert('手机长度不超过15,只允许输入"数字、.、_、-、*、#、空格"');
                alert('请输入11位数字的手机号码');
				$("#mobile").focus();
				return false;
			}
			// 若座机号码不为空则校验座机号码
			if(data.extNum1 && !SSO.Base.validation.isUnsignedInteger(data.extNum1)) {
				alert("区号-电话-分机只能为数字");
				$('#extNum1').focus();
				return false;
			}
			if(data.extNum2 && !SSO.Base.validation.isUnsignedInteger(data.extNum2)) {
				alert("区号-电话-分机只能为数字");
				$('#extNum2').focus();
				return false;
			}
			if(data.extNum3 && !SSO.Base.validation.isUnsignedInteger(data.extNum3)) {
				alert("区号-电话-分机只能为数字");
				$('#extNum3').focus();
				return false;
			}
			data.extNum = data.extNum1 +"-"+ data.extNum2 +"-"+ data.extNum3;
			data.extNum = data.extNum == "--" ? "" : data.extNum ;
			
			if(data.fax && !SSO.verify.fax(data.fax)) {
				alert("传真只能为数字");
				$('#fax').focus();
				return false;
			}
			if(data.seat){
                if(!(data.seat.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]+$/))){
                    alert('办公位置只能为中英文和数字及下划线组成', function() {
                        $('#seat').focus();
                    });
                    return false;
                }
			}
			return data;
	} ,
	profileSave:function(){
		var url = BP.config.SYSTEM_URL+"/system/user/updatePlatFormUser";
		if(Mo.Base.throttle.isLock(url)){
			return false;
		}
		Mo.Base.throttle.lock(url);
		
		var data = this.getProfileData();
		if(!data){
			Mo.Base.throttle.unLock(url);
			return false;
		}
		
		
		$("#moid").attr("value",data.moid);
		$("#username").attr("value",data.name);
		$("#mobile").attr("value",data.mobile);
		$("#email").attr("value",data.email);
		$("#extNum").attr("value",data.extNum);
		$("#extNum1").attr("value",data.extNum1);
		$("#extNum2").attr("value",data.extNum2);
		$("#extNum3").attr("value",data.extNum3);
		$("#birthday").attr("value",data.birthday);
		$("#fax").attr("value",data.fax);
		$("#seat").attr("value",data.seat);
		
		
		$.ajax({
				type: 'post',
				url: url,
				data: data,
				dataType: 'json',
				success: function(msg){
					if(msg.success) {
						Mo.Form.store.set("profile");
					}
					alert(msg.description);
					Mo.Base.throttle.unLock(url);
                    var newAccount=$('#account .base-input').val();
                    if(username&&newAccount&&(username!=newAccount)){//修改了账号 回到登陆页面
                        setTimeout(function () {
                            window.location.href = "./loginout"
                        },1000)
                    }
				},
				error: function(){
					alert("修改个人资料失败，请与系统管理员联系！");
					Mo.Base.throttle.unLock(url);
				}
			});
	},

	portraitSave:function(){
		var url = BP.config.SYSTEM_URL+"/system/user/confirmPortrait";
		if(Mo.Base.throttle.isLock(url)){
			return false;
		}
		Mo.Base.throttle.lock(url);
		
		var selection_str = $("#selection").val();
		if(!selection_str){
			alert("请先选择图片");
			Mo.Base.throttle.unLock(url);
			return false;
		}
		var selection = JSON.parse(selection_str);
		$.ajax({
			type: 'post',
			url: url,
			data: {
				x1: selection.x1 ? selection.x1 : 0,
				y1: selection.y1 ? selection.y1 : 0,
				width: selection.width,
				height : selection.height,
				fileName :$("#fileName").val()
			},
			dataType: 'json',
			success: function(msg){
				if(msg.success){
					Mo.alert("头像修改成功",function(){
						Mo.Set.loadPage(msg.data);
					});
				}else{
					alert(msg.description);
				}
				Mo.Base.throttle.unLock(url);
			},
			error: function(){
				alert("头像修改失败");
				Mo.Base.throttle.unLock(url);
			}
		});
	},
	loadPage:function(data){
        SSO.common.initPortrait(data.portraitUrl40, window.portraitDomain);
    },
	passwordSave:function(){
		var url = BP.config.SYSTEM_URL+"/system/user/updatepassword";
		var securityPolicyObj = {"弱":1,"中":2,"强":3};
		var newPasswordStrength = securityPolicyObj[$(".newPasswordTip .tip-info").text()];
		if(passwordStrengthOfSecurityPolicy!=""){
			if(newPasswordStrength<passwordStrengthOfSecurityPolicy){
				if(passwordStrengthOfSecurityPolicy==3){
					Mo.alert("密码等级必须为强");
				}
				if(passwordStrengthOfSecurityPolicy==2){
					Mo.alert("密码等级至少为中");
				}
				if(passwordStrengthOfSecurityPolicy==1){
					Mo.alert("密码等级至少为弱");
				}
				return ;
			}
		}else{
			Mo.alert("未获取到用户密码等级强度");
			return ;
		}
		if(Mo.Base.throttle.isLock(url)){
			return false;
		}
		Mo.Base.throttle.lock(url);
		var data = {
				moid: $("#moid").val(),
				oldPassword: $.trim($("#oldPassword").val()),
				newPassword: $.trim($("#newPassword").val()),
				confirmPassword: $.trim($("#confirmPassword").val())
		};
		
		if('' == $.trim(data.oldPassword)){
			alert("当前密码不能为空，请输入当前密码。");
			$("#oldPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		if('' == $.trim(data.newPassword)){
			alert("新密码不能为空，请输入新密码。");
			$("#newPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		
		if(data.newPassword && !SSO.verify.password(data.newPassword)){
			alert('密码仅支持大小写字母、数字、"_"、"."');
			$("#newPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		
		if(data.newPassword && !SSO.Base.validation.checkLength(data.newPassword,32)){
			alert('密码长度不能大于32位字符');
			$("#newPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		
		
		if($.trim(data.oldPassword) == $.trim(data.newPassword)){
			alert("新密码不能与旧密码一致");
			$("#newPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		if($.trim(data.newPassword) != $.trim(data.confirmPassword)){
			alert("两次输入密码不一致，请重新输入。");
			$("#confirmPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		
		var cdata = {};
		if('1'==systemSecurity){
			cdata = Mo.Base.DigestAuth.makePassword(data.oldPassword,data.newPassword);
		}else{
			cdata = Mo.Base.DigestAuth.makePassword(hex_md5(data.oldPassword),data.newPassword);
			var params = Mo.Base.DigestAuth.makePassword(hex_md5(data.oldPassword),data.oldPassword);
			cdata['key'] = params['knonce']+'_'+params['ciphertext']+'_'+params['hmac'];
		}
		
		$.ajax({
			type: 'post',
			url: url,
			data: cdata,
			dataType: 'json',
			success: function(msg){
				if(msg.success){
					Mo.Form.store.reset();
					alert("密码修改成功，请重新登录。", function () {
						location.href = BP.config.SYSTEM_URL+"/loginout";
					});
				}else{
					alert(msg.description);
				}
				Mo.Base.throttle.unLock(url);
			},
			error: function(){
				alert("密码修改失败");
				Mo.Base.throttle.unLock(url);
			}
		});
	},
	gmtSave:function(){
		alert("Build3实现");
	},
	
	languageSave:function(){
		alert("Build3实现");
	},
	





	getHash:function(){
		var hash; 
		hash=(!window.location.hash)?"#perfile":window.location.hash; 
		return hash.substring(1,hash.length);
	},
	initTab:function(){
		var hash = this.getHash();
		this.activeTab("."+hash);
		
		var that = this;
		$(".tab-item").on("click",function(){
			return that.activeTab(this);
		})
		$(".nav-tab-item").on("click",function(){
			return that.activeTab($(this).attr("href").replace("set#","."));
		})
	},
	activeTab:function(tab){
        if(tab=='.profile'){
            this.profileHref=true;
        }
		var name = $(tab).data("tab");
		var userMoids = $("#moid").val();
        var newAccount=$('#account .base-input').val();
        if(name=='password'){
            if(username&&newAccount&&(username!=newAccount)){//修改了账号
                if($('.bmc-accountInput-edit').css("display")=="none"){//是编辑状态
                    alert('账号已修改，请先确认新账号');
                    return false;
                }
            }
        }
        if(this.before(name)){
            Mo.Set.change.show(name);
            return false;
        }
        if(name=='password'){//切换至修改密码时 个人信息中账号要还原至原状态
            Mo.updataAccount.accountInput.setValue(username);
            Mo.updataAccount.accountInput.setReadonly();//账号设置只读状态
        }else if(name=='profile'){
            Mo.updataAccount.init();
        }
		 if(userMoids =='mooooooo-oooo-oooo-oooo-defaultadmin'){
		 	var _this=this;
			 if(name=='password'){
				 $(".tipPass").show();
				 // Moo.alert('密码修改后，请牢记新密码！'+'<br/>'+'未配置邮箱将密码丢失后无法找回，需要返厂进行初始化。',function(){
					//  $(".showTip").show();
			     // },'重置密码','取消')
                 $.dialog({
                     padding: 0,
                     id: "passwordUpdate",
                     content: document.getElementById('passwordUpdate'),
                     lock: true,
                     opacity: 0.50,	// 透明度
                     cancel:false, // 隐藏关闭按钮
                     drag: false // 不允许拖拽
                 });
                 $(".save", "#passwordUpdate").off('click').on("click",function(){
                     $.dialog({id: 'passwordUpdate'}).close();
                     $(".showTip").show();
                 });
                 $(".w-close", "#passwordUpdate").off('click').on("click",function(){
                     $.dialog({id: 'passwordUpdate'}).close();
                     if(_this.profileHref){//从个人信息tab标签来
                         $("#modifyUser").click();
                     }else{
                         window.location.href=window.document.referrer;
                     }
                 });
                 $(".cancel", "#passwordUpdate").off('click').on("click",function(){//取消 从哪里来的返回哪个页面
                     $.dialog({id: 'passwordUpdate'}).close();
                     if(_this.profileHref){//从个人信息tab标签来
                         $("#modifyUser").click();
                     }else{
                         window.location.href=window.document.referrer;
                     }
                 });
			 }else{
				 $(".tipPass").hide();
				 $(".showTip").hide();	
			 }
		 }
		
		
		if($(tab).hasClass("active")){
				return false;
		}
		

		// if(this.before(name)){
		// 	Mo.Set.change.show(name);
		// 	return false;
		// }

		$(".tab-item").removeClass("active");
		$(tab).addClass("active");
		
		$("form").hide();
		$("."+name+"-form").show();
		$(".tab-tip").hide();
		$("."+name+"-tip").show();
		
		if($(".imgareaselect-selection").length != 0){
			if(name == "portrait"){
				$(".imgareaselect-selection").parent().css("display","block");
				$(".imgareaselect-outer").css("display","block");
			}else{
				$(".imgareaselect-selection").parent().css("display","none");
				$(".imgareaselect-outer").css("display","none");
			}
		}
		Mo.Form.store.set(name);
	},
	
	getTabName:function(){
		return $(".tab-item.active").data("tab");
	},

	dialog:null,
	before:function(name){
		return Mo.Form.store.isChange();
	}
}


$.namespace("Mo.Set.change")
Mo.Set.change={
	init: function(){
		this.initEvent();
	},
	name : null,
	initEvent: function(){
		var that = this;
		//取消
		$(".w-close", "#changeWrapper").on("click",function(){
			that.close();
			Mo.Form.store.resetText();
			Mo.Set.activeTab("."+that.name);
		});
		$(".cancel", "#changeWrapper").on("click",function(){
			that.close();
			Mo.Form.store.resetText();
			Mo.Set.activeTab("."+that.name);
		});

		$(".save", "#changeWrapper").on("click",function(){
			that.close();
			Mo.Set.save();
		});
	},

	show:function(name){
		$.dialog({
			padding: 0,
			id: "changeWindow",
			content: document.getElementById('changeWrapper'),
			lock: true,
			opacity: 0.50,	// 透明度
			cancel:false, // 隐藏关闭按钮
			drag: false // 不允许拖拽
		});
		this.name = name;
	},
	close: function(){
		$("#detail-btn-save").removeClass("disabled");
		$.dialog({id: 'changeWindow'}).close();
	}
};

$.namespace("Mo.Form.store")
Mo.Form.store = {
	store:[],
	storeH:[],
	storePass:[], 
	lastKey:null,
	getSerialize:function(name){
		var data_serialize= "";
		if(name == "profile"){
			var data = {
					moid: $("#moid").val(),
					name:$.trim($("#username").val()),
					email:$.trim($("#email").val()),
					mobile:$.trim($("#mobile").val()),
					extNum:$.trim($("#extNum").val()),
					extNum1:$.trim($("#extNum1").val()),
					extNum2:$.trim($("#extNum2").val()),
					extNum3:$.trim($("#extNum3").val()),
					sex:$('input:radio[name=sex]:checked').val(),
					birthday:$('#birthday').datebox('getValue'),
					fax:$.trim($("#fax").val()),
					seat:$.trim($("#seat").val())
				};
			data_serialize = JSON.stringify(data);
		}else{
			data_serialize = $("."+name+"-form").serialize();
		}
		
		return data_serialize;
	},
	getHtml:function(name){
		return $("."+name+"-form").html();
	},
	reset:function(){
		if(this.lastKey=="password"){
			$("."+this.lastKey+"-form").html(Mo.Form.store.storePass)
		}else{
			$("."+this.lastKey+"-form").html(this.storeH[this.lastKey]);
		}
		Mo.Password.init(options);
   		Mo.Password.capitalTip("oldPassword")
   		Mo.Password.capitalTip("newPassword")
   		Mo.Password.capitalTip("confirmPassword");
	},
	set:function(name){
		this.lastKey = name;
		this.store[name] = this.getSerialize(name);
		this.storeH[name] = this.getHtml(name);
	},
	isChange:function(name){
		if(this.lastKey==null){
			return false;
		}
		return this.store[this.lastKey] != this.getSerialize(this.lastKey);
	},
	resetText: function(){
		/*Mo.Password.init(options);
   		Mo.Password.capitalTip("oldPassword")
   		Mo.Password.capitalTip("newPassword")
   		Mo.Password.capitalTip("confirmPassword");*/
		if(this.lastKey == "profile"){
			var dataStore = JSON.parse(this.store[this.lastKey]);
			$("#username").val(dataStore.name);
			$("#email").val(dataStore.email);
			$("#mobile").val(dataStore.mobile);
			$("#extNum").val(dataStore.extNum);
			$("#extNum1").val(dataStore.extNum1);
			$("#extNum2").val(dataStore.extNum2);
			$("#extNum3").val(dataStore.extNum3);
			if(dataStore.sex == "0"){
				$("#sex_w").click();
			}else{
				$("#sex_m").click();
			}
			$('#birthday').datebox('setValue',dataStore.birthday);
			$("#fax").val(dataStore.fax);
			$("#seat").val(dataStore.seat);
			Mo.ExtNum.initExtNum();
		}else{
			this.reset();
		}
	}
}

//座机
$.namespace("Mo.ExtNum");
Mo.ExtNum = {
	init : function(){
		this.tiplabel();
		this.initExtNum();
	},
	tiplabel : function(){
		$("#extNum1").on("focus", function() {
			var dom = $(this);
			var pDom = dom.parent(".extNum_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function() {
			var dom = $(this);
			var val = dom.val();
			if (null == val || "" == val) {
				var pDom = dom.parent(".extNum_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});
		$("#extNum2").on("focus", function() {
			var dom = $(this);
			var pDom = dom.parent(".extNum_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function() {
			var dom = $(this);
			var val = dom.val();
			if (null == val || "" == val) {
				var pDom = dom.parent(".extNum_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});
		$("#extNum3").on("focus", function() {
			var dom = $(this);
			var pDom = dom.parent(".extNum_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function() {
			var dom = $(this);
			var val = dom.val();
			if (null == val || "" == val) {
				var pDom = dom.parent(".extNum_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});
		
		$(".extNum_input_wrapper .tip_label").on("click", function() {
			var dom = $(this);
			var inputDom = dom.prev("input");
			inputDom.focus();
		});
	},
	
	initExtNum : function(){
		var extNum = $("#extNum").val();
		if(extNum != "" && extNum != null){
			var parNum = extNum.split("-");
			$("#extNum1").val(parNum[0]);
			$("#extNum2").val(parNum[1]);
			$("#extNum3").val(parNum[2]);
		}
		
		$(".tip_label").each(function(i,item){
			var dom = $(this);
			var inputDom = dom.prev("input");
			if(inputDom.val() != null && inputDom.val() != ""){
				dom.hide();
			}else{
				dom.show();
			}
		});
	}

};
