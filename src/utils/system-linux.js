var userMoid = "${currentuser.moid}";
var cloudModelInfo = ${ cloudModelInfo };
var cloudData = { data: cloudModelInfo }
var cloudInfoHtml = template('cloud-names', cloudData);
$(".pullDownContent", ".public-private-cloud").html(cloudInfoHtml);
function cloudClick($this) {
    var text = $this.text
    var value = $this.getAttribute("value")
    var url = BP.config.SYSTEM_URL + "/system/user/updateCloudModel";
    var data = {
        moid: userMoid,
        cloudModelName: text,
        virMachineroomMoid: value
    }
    $.post(url, data, function (ret) {
        if (ret.success) {
            $(".cloud-name").text(text)
            $(".cloud-name").attr("value", value)
        }
    }, 'json').error(function () {
    })

}

var baseUrl = BP.config.SYSTEM_URL;
var onlyCurrentIp = "${onlyCurrentIp}"
$(document).ready(function () {
    // 重启
    $("#reboot").on('click', function () {
        checkADPassword(function () {
            if (!!onlyCurrentIp) {
                Mo.confirm("您将要重启设备" + onlyCurrentIp + ",重启过程中请勿切断电源！", function (result) {
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
            if (!!onlyCurrentIp) {
                Mo.confirm("您将要关闭设备" + onlyCurrentIp + ",关闭过程中请勿切断电源！", function (result) {
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
});


var rebootClusterEvent = function () {
    var url = baseUrl + "/reboot";
    if (Mo.Base.throttle.isLock(url)) {
        return false;
    }
    Mo.Base.throttle.lock(url); // 正在处理中...
    var data = beforeSave();
    $.post(url, data, function (t) {
        Mo.Base.throttle.unLock(url);
        if (t.success) {
            top.location.reload();
        } else {
            Mo.alert("重启失败，原因：" + t.description);
        }
    }, "json").error(function () {
        window.setTimeout(function () {
            top.location.reload();
        }, 5000);
    });
}

var shutdownClusterEvent = function () {
    var url = baseUrl + "/shutdown";
    if (Mo.Base.throttle.isLock(url)) {
        return false;
    }
    Mo.Base.throttle.lock(url); // 正在处理中...

    var data = beforeSave();
    window.setTimeout(function () {
        getShutdownStatus();
    }, 3000);

    $.post(url, data, function (t) {
        Mo.Base.throttle.unLock(url);
        if (t.success) {
            top.location.reload();
        } else {
            Mo.alert("关机失败，原因：" + t.description);
        }
    }, "json").error(function () {
        window.setTimeout(function () {
            top.location.reload();
        }, 5000);
    });
}

var rebootEvent = function () {
    var url = baseUrl + "/reboot";
    if (Mo.Base.throttle.isLock(url)) {
        return false;
    }
    Mo.Base.throttle.lock(url); // 正在处理中...
    var data = beforeSave();
    $.post(url, data, function (t) {
        Mo.Base.throttle.unLock(url);
        if (t.success) {
            Mo.RebootTip.show();
        } else {
            Mo.alert("重启失败，原因：" + t.description);
        }
    }, "json").error(function () {
        getRebootStatus(url);

    });
}

var shutdownEvent = function () {
    var url = baseUrl + "/shutdown";
    if (Mo.Base.throttle.isLock(url)) {
        return false;
    }
    Mo.Base.throttle.lock(url); // 正在处理中...

    var data = beforeSave();
    window.setTimeout(function () {
        getShutdownStatus();
    }, 3000);

    $.post(url, data, function (t) {
        Mo.Base.throttle.unLock(url);
        if (t.success) {
            Mo.tips.show("正在关机请稍后...", null, 200000);
        } else {
            Mo.alert("关机失败，原因：" + t.description);
        }
    }, "json").error(function () {
        Mo.Base.throttle.unLock(url);
    });
}


var getRebootStatus = function (url) {
    $.get(baseUrl + '/check', function () {
        window.setTimeout(function () {
            getRebootStatus();
        }, 3000);
    }, 'xml').fail(function (res) {
        if (!res.status || (res.status >= 400 && res.status < 500)) {
            Mo.Base.throttle.unLock(url);
            Mo.RebootTip.show();
        } else {
            window.setTimeout(function () {
                getRebootStatus();
            }, 3000);
        }
    });
}

var getShutdownStatus = function () {
    $.get(baseUrl + '/check', function () {
        window.setTimeout(function () {
            getShutdownStatus();
        }, 3000);
    }, 'xml').fail(function (res) {
        if (!res.status || (res.status >= 400 && res.status < 500)) {
            top.location.reload();
        } else {
            window.setTimeout(function () {
                getShutdownStatus();
            }, 3000);
        }
    });
}

var checkADPassword = function (callback) {
    $.dialog.open(baseUrl + "/checkADPassword", {
        id: "checkADPassword",
        lock: true,
        opacity: 0.50,  // 透明度
        title: "密码验证",
        padding: 0,
        width: 400,
        height: 260,
        close: function () {
            var action = $.dialog.data("action");
            var needCheckPD = $.dialog.data("needCheckPD");
            var needCheckPD = $.dialog.data("Cluster");
            if (action == "ok" && typeof (callback) == "function") {
                callback();
            }
        },
        cancel: false, // 隐藏关闭按钮
        drag: false // 不允许拖拽
    }, false);
};

var selectPserverIP = function (callback1, callback2) {
    $.dialog.open(baseUrl + "/selectPserverIP", {
        id: "selectPserverIP",
        lock: true,
        opacity: 0.50,  // 透明度
        title: "选择主机ip",
        padding: 0,
        width: 400,
        height: 260,
        close: function () {
            var action = $.dialog.data("action");
            var needOperateIPCount = $.dialog.data("needOperateIPCount");
            if (action == "ok" && typeof (callback1) == "function" && needOperateIPCount != 1) {
                callback2();
            }
            if (action == "ok" && typeof (callback2) == "function" && needOperateIPCount == 1) {
                callback1();
            }
        },
        cancel: false, // 隐藏关闭按钮
        drag: false // 不允许拖拽
    }, false);
};

var beforeSave = function () {
    var needCheckPD = $.dialog.data("needCheckPD");
    $.dialog.data("needCheckPD", "");
    var needOperateIP = $.dialog.data("needOperateIP");
    $.dialog.data("needOperateIP", "");
    if (!needCheckPD) {
        return false;
    }
    var data = {
        "needCheckPD": needCheckPD,
        "needOperateIP": needOperateIP
    };
    return data;
};