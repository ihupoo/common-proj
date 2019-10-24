import { Validation, Throttle } from '@/utils/utils'
import { MoAlert } from '@/components/popup'
import { DigestAuth } from '@/utils/digestAuth'
import Store from '@/store/index';

let { securityPolicy, username, systemSecurity } = Store.getState('user');

const CoreSetFrame = {
    default_detail_paddingTop: 0, // 默认详细表单顶部偏移量
    default_detail_paddingLeft: 0, // 默认详细表单左边偏移量
    main_min_width: 1280,
    main_padding_left: 128,
    main_min_height: 650,
    main_padding_bottom: 0,
    main_top_height: 98,

    fixLineHeight: 2,

    initCoreSetPage: function () {
        let wH = $(window).height();
        let innerHeight = wH - this.main_top_height - this.main_padding_bottom;
        let viewHeight = innerHeight - (this.fixLineHeight * 2) - 80;
        $(".wrapcontent").css("min-height", viewHeight);
        if ('password' == $(".tabs .active").attr("data-tab")) {
            $("#detail-btn-save").addClass('disabled');
        } else {
            $("#detail-btn-save").removeClass('disabled');
        }
    }
}

const ForcePwd = {
    init: function () {
        $("#detail-btn-save").click(function () {
            if ($(this).hasClass("disabled")) {
                return;
            }
            let securityPolicyObj = {
                "弱": 1,
                "中": 2,
                "强": 3
            };
            let newPasswordStrength = securityPolicyObj[$(".newPasswordTip .tip-info").text()];
            let passwordStrengthOfSecurityPolicy = securityPolicy.passwordStrength;
            if (passwordStrengthOfSecurityPolicy != "") {
                if (newPasswordStrength < passwordStrengthOfSecurityPolicy) {
                    if (passwordStrengthOfSecurityPolicy == 3) {
                        MoAlert("密码等级必须为强");
                    }
                    if (passwordStrengthOfSecurityPolicy == 2) {
                        MoAlert("密码等级至少为中");
                    }
                    if (passwordStrengthOfSecurityPolicy == 1) {
                        MoAlert("密码等级至少为弱");
                    }
                    return;
                }
            } else {
                MoAlert("未获取到用户密码等级强度");
                return;
            }
            let url = Store.getState('BASE_URL') + "/modifypassword/reset";
            if (Throttle.isLock(url)) {
                return false;
            }

            Throttle.lock(url); // 正在处理中...
            let data = {};
            if ('1' == systemSecurity) {
                data = DigestAuth.makePassword($("#oldPassword").val(), $("#newPassword").val());
            } else {
                data = DigestAuth.makePassword(hex_md5($("#oldPassword").val()), $("#newPassword").val());
                let params = DigestAuth.makePassword(hex_md5($("#oldPassword").val()), $("#oldPassword").val());
                data['key'] = params['knonce'] + '_' + params['ciphertext'] + '_' + params['hmac'];
            }

            data.username = username;

            $.post(url, data, function (t) {
                if (t.success) {
                    MoAlert("修改密码成功", function () {
                        location.href = Store.getState('BASE_URL') + "/login";
                    })
                } else {
                    MoAlert(t.description);
                }
                Throttle.unLock(url);
            }, "json").error(function () {
                MoAlert("获取失败!")
                Throttle.unLock(url);
            });
        })
    }
}


export {
    CoreSetFrame,
    ForcePwd
}
