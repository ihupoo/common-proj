import TemplatePasswordDialog from './password-dialog.art';
import Store from '@/store';
import { Throttle } from '@/utils/utils';
import { MoAlert } from '@/components/popup';
import '@/lib/artDialog'
import './password-dialog.scss'


function eventBind(){
    $.dialog.data("action", "cancel");
    
    $("#turnOffWrapper input").on("keyup",function(){
        if($(this).val()){
            $('#turnOffWrapper .pwdEye').show()
            $(".errorTip").hide();
            $(".friendTips").show();
            $(".inputTip").hide();
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
        const BASE_URL = Store.getState('BASE_URL')

        var url = BASE_URL + "/checkADPassword/check";

        if (Throttle.isLock(url)) {
            return false;
        }

        let val = $.trim($(".turnOff_password").val());

        if(!val){
            $(".errorTip").hide();
            $(".friendTips").hide();
            $(".inputTip").show();
            return;
        }
        var data = {
            "needCheckPD": val 
        };

        Throttle.lock(url); // 正在处理中...
        $.post(url, data, function(t) {
            Throttle.unLock(url);
            if (t.success) {
                $.dialog.data("needCheckPD", data.needCheckPD);
                $.dialog.data("action", "ok");
                $.dialog({id: 'checkADPassword'}).close();
            }else{
                $(".friendTips").hide();
                $(".inputTip").hide();
                $(".errorTip").show();
            }
        }, "json").error(function() {
            MoAlert("出现未知错误，请检查网络是否正常！");
            Throttle.unLock(url);
        });
    });

    // 取消
    $(".cancel").click(function() {
        $.dialog({id: 'checkADPassword'}).close();
    });

    // 关闭对话框
    $(".w-close").click(function() {
        $.dialog({id: 'checkADPassword'}).close();
    });
}

export default {
    show(okFn) {
        const content = $(TemplatePasswordDialog({})).localize().prop("outerHTML");

        $.dialog({
            id: "checkADPassword",
            content,
            lock: true,
            opacity: 0.50,  // 透明度
            title: "密码验证",
            padding: 0,
            width: 400,
            height: 260,
            close: function () {
                let action = $.dialog.data("action");
                if (action == "ok") {
                    okFn();
                }
            },
            cancel: false, // 隐藏关闭按钮
            drag: false // 不允许拖拽
        }, false);

        eventBind()

    },  
}
