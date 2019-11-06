import { Validation, Throttle } from '@/utils/utils'
import { MoAlert } from '@/components/popup'
import { DigestAuth } from '@/utils/digestAuth'
import Store from '@/store/index';

const ForcePwd = {
    init: function () {
        let { securityPolicy, systemSecurity } = Store.getState('user');
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

            // const BASE_URL = Store.getState('BASE_URL') 
            // let reg = new RegExp(`\\/${BASE_URL}\\/(\\S+?)\/`)
            // let username = location.href.match(reg)?.[1];

            data.username = Store.getState('user.account');

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
    ForcePwd
}
