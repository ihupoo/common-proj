import Store from '@/store';
import { Throttle } from './utils';
import { MoAlert, MooAlert , MoTips, MoConfirm } from '@/components/popup';

const RebootTip = {
    intervalId: null,
    progressbar: null,
    progressId: null,
    runningFlag: true,
    show() {
        let msg = '系统重启中，请稍候...',
            timeout = 120000,
            progressTime = 300000;

        RebootTip.runningFlag = true;
        RebootTip.showProgressDialog(msg, progressTime);
        setTimeout(function() {
            if (RebootTip.runningFlag) {
                RebootTip.intervalId = setInterval(function() {
                    RebootTip.getStatus();
                }, 10000);
            }
        }, timeout);
    },
	getStatus(){
        const BASE_URL = Store.getState('BASE_URL');
        $.ajax({
            url: BASE_URL + '/check',
            method: 'GET',
            timeout: 7000,
            success: function() {
                let loginUrl = location.href.split(BASE_URL)[0] + '/portal/login';
                RebootTip.complete(loginUrl);
            }
        });
    },
    getDialogTemplate(msg) {
        return (
            `<div class="mo-msgbox-wrapper" style="display: block;">
                <div class="mo-msgbox-content mo-dialog-content" style="height:256px">
                    <div class="title">
                        <span>提示</span>
                    </div>
                    <div class="separater"></div>
                    <div class="info-wrap">
                        <div class="info" id="infoCustom" style="margin-left:25px">
                            ${msg}<div id="rebootProgressbar" style="margin-top:12px"></div>
                        </div>
                    </div>
                </div>
            </div>`
        );
    },
    showProgressDialog(msg, progressTime) {
        $.dialog({
            padding: 0,
            id: 'rebootProgressDialog',
            content: RebootTip.getDialogTemplate(msg),
            lock: true,
            opacity: 0.5,
            cancel: false,
            drag: false,
            esc: false
        });
        //todo
        RebootTip.progressbar = Portal.Progressbar('#rebootProgressbar', {
            width: 315
        });
        RebootTip.progressId = setInterval(function() {
            let progressbar = RebootTip.progressbar;
            let current = progressbar.getValue();
            if (current < 99) {
                progressbar.setValue(++current);
            } else {
                clearInterval(RebootTip.progressId);
            }
        }, progressTime / 100);
    },
    close: function() {
        $.dialog({ id: 'rebootProgressDialog' }).close();
        RebootTip.runningFlag = false;
        clearInterval(RebootTip.progressId);
        clearInterval(RebootTip.intervalId);
    },
    complete(loginUrl) {
        clearInterval(RebootTip.progressId);
        RebootTip.progressbar.setValue(100);
        clearInterval(RebootTip.intervalId);
        setTimeout(function() {
            $.dialog({ id: 'rebootProgressDialog' }).close();
            if (RebootTip.runningFlag) {
                MooAlert('重启完成，请重新登录生效！', function(r) {
                    if (r) {
                        window.onbeforeunload = null;
                        location.href = loginUrl;
                    }
                });
            }
        }, 1000);
    }
}



function beforeSave() {
    let needCheckPD = $.dialog.data("needCheckPD");
    $.dialog.data("needCheckPD", "");
    let needOperateIP = $.dialog.data("needOperateIP");
    $.dialog.data("needOperateIP", "");
    if (!needCheckPD) {
        return false;
    }
    return {
        "needCheckPD": needCheckPD,
        "needOperateIP": needOperateIP
    };
};

function rebootClusterEvent() {
    let url = Store.getState('BASE_URL') + "/reboot";
    if (Throttle.isLock(url)) {
        return false;
    }
    Throttle.lock(url); // 正在处理中...
    let data = beforeSave();
    $.post(url, data, function (t) {
        Throttle.unLock(url);
        if (t.success) {
            location.reload();
        } else {
            MoAlert(`重启失败，原因：${t.description}`);
        }
    }, "json").error(function () {
        setTimeout(function () {
            location.reload();
        }, 5000);
    });
}

function shutdownClusterEvent() {
    let url = Store.getState('BASE_URL') + "/shutdown";
    if (Throttle.isLock(url)) {
        return false;
    }
    Throttle.lock(url); // 正在处理中...
    let data = beforeSave();
    setTimeout(function () {
        getShutdownStatus();
    }, 3000);

    $.post(url, data, function (t) {
        Throttle.unLock(url);
        if (t.success) {
            location.reload();
        } else {
            MoAlert(`关机失败，原因：${t.description}`);
        }
    }, "json").error(function () {
        setTimeout(function () {
            location.reload();
        }, 5000);
    });
}

function rebootEvent() {
    let url = Store.getState('BASE_URL') + "/reboot";
    if (Throttle.isLock(url)) {
        return false;
    }
    Throttle.lock(url); // 正在处理中...
    let data = beforeSave();
    $.post(url, data, function (t) {
        Throttle.unLock(url);
        if (t.success) {
            RebootTip.show();
        } else {
            MoAlert(`重启失败，原因：${t.description || ''}`);
        }
    }, "json").error(function () {
        getRebootStatus(url);

    });
}

function shutdownEvent() {
    let url = Store.getState('BASE_URL') + "/shutdown";
    if (Throttle.isLock(url)) {
        return false;
    }
    Throttle.lock(url); // 正在处理中...

    let data = beforeSave();
    setTimeout(function () {
        getShutdownStatus();
    }, 3000);

    $.post(url, data, function (t) {
        Throttle.unLock(url);
        if (t.success) {
            MoTips.show("正在关机请稍后...", null, 200000);
        } else {
            MoAlert("关机失败，原因：" + t.description);
        }
    }, "json").error(function () {
        Throttle.unLock(url);
    });
}


function getRebootStatus(url) {
    $.get(Store.getState('BASE_URL') + '/check', function () {
        setTimeout(function () {
            getRebootStatus();
        }, 3000);
    }, 'xml').fail(function (res) {
        if (!res.status || (res.status >= 400 && res.status < 500)) {
            Throttle.unLock(url);
            RebootTip.show();
        } else {
            setTimeout(function () {
                getRebootStatus();
            }, 3000);
        }
    });
}

function getShutdownStatus() {
    $.get(Store.getState('BASE_URL') + '/check', function () {
        setTimeout(function () {
            getShutdownStatus();
        }, 3000);
    }, 'xml').fail(function (res) {
        if (!res.status || (res.status >= 400 && res.status < 500)) {
            location.reload();
        } else {
            setTimeout(function () {
                getShutdownStatus();
            }, 3000);
        }
    });
}

//todo
function checkADPassword(callback) {
    $.dialog.open(Store.getState('BASE_URL') + "/checkADPassword", {
        id: "checkADPassword",
        lock: true,
        opacity: 0.50,  // 透明度
        title: "密码验证",
        padding: 0,
        width: 400,
        height: 260,
        close: function () {
            let action = $.dialog.data("action");
            if (action == "ok") {
                callback();
            }
        },
        cancel: false, // 隐藏关闭按钮
        drag: false // 不允许拖拽
    }, false);
};

//todo
function selectPserverIP(callback1, callback2) {
    $.dialog.open(Store.getState('BASE_URL') + "/selectPserverIP", {
        id: "selectPserverIP",
        lock: true,
        opacity: 0.50,  // 透明度
        title: "选择主机ip",
        padding: 0,
        width: 400,
        height: 260,
        close: function () {
            let action = $.dialog.data("action");
            let needOperateIPCount = $.dialog.data("needOperateIPCount");
            if(action == "ok"){
                needOperateIPCount != 1 && callback2();
                needOperateIPCount == 1 && callback1();
            }
        },
        cancel: false, // 隐藏关闭按钮
        drag: false // 不允许拖拽
    }, false);
};


export default {
    init(){
        // 重启
        $("#reboot").on('click', function () {
            checkADPassword(function () {
                const onlyCurrentIp = Store.getState('user.onlyCurrentIp')
                if (!!onlyCurrentIp) {
                    MoConfirm(`您将要重启设备${onlyCurrentIp},重启过程中请勿切断电源！`, function (result) {
                        if (!result) {
                            return;
                        }
                        rebootEvent();
                    }
                    );
                } else {
                    $.dialog.data("operate", "reboot");
                    selectPserverIP(rebootEvent, rebootClusterEvent);
                }
            });
        });

        // 关机
        $("#shutdown").on('click', function () {
            checkADPassword(function () {
                const onlyCurrentIp = Store.getState('user.onlyCurrentIp')
                if (!!onlyCurrentIp) {
                    MoConfirm(`您将要关闭设备${onlyCurrentIp},关闭过程中请勿切断电源！`, function (result) {
                        if (!result) {
                            return;
                        }
                        shutdownEvent();
                    }
                    );
                } else {
                    $.dialog.data("operate", "shutdown");
                    selectPserverIP(shutdownEvent, shutdownClusterEvent);
                }
            });
        });
    }
}
