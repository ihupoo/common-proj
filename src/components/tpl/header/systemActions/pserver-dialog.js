import TemplatePserverDialog from './pserver-dialog.art';
import Store from '@/store';
import { Throttle } from '@/utils/utils';
import { MoAlert } from '@/components/popup';
import '@/lib/artDialog'
import '@/lib/portal'
import './pserver-dialog.scss'


function eventBind(currentIps){

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
    
    var comb = Portal1.Combox("#device-info", {
            width:160,
            prompt:tips.prompt
        });

    if(currentIps){
        comb.loadData(currentIps);
        if(currentIps[0]){
            comb.setValue(currentIps[0]);
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
        $.dialog({id: 'selectPserverIP'}).close();;
    });

    // 取消
    $(".cancel").click(function() {
        $.dialog({id: 'selectPserverIP'}).close();;
    });

    // 关闭对话框
    $(".w-close").click(function() {
        $.dialog({id: 'selectPserverIP'}).close();;
    });
    
}


export default {
    show(okFn1, okFn2, currentIps) {
        const content = $(TemplatePserverDialog({})).localize().prop("outerHTML");

        $.dialog({
            id: "selectPserverIP",
            lock: true,
            content,
            opacity: 0.50,  // 透明度
            title: "选择主机ip",
            padding: 0,
            width: 400,
            height: 260,
            close: function () {
                let action = $.dialog.data("action");
                let needOperateIPCount = $.dialog.data("needOperateIPCount");
                if(action == "ok"){
                    needOperateIPCount != 1 && okFn2();
                    needOperateIPCount == 1 && okFn1();
                }
            },
            cancel: false, // 隐藏关闭按钮
            drag: false // 不允许拖拽
        }, false);

        eventBind(currentIps)

    },  
}
