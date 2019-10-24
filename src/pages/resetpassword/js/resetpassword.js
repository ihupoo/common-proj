import { Validation, Throttle } from '@/utils/utils'
import { MoAlert } from '@/components/popup'
import { DigestAuth } from '@/utils/digestAuth'
import Store from '@/store/index';

let { securityPolicy, nonce } = Store.getState('user');

function beforeSave() {
    let data = {
        newPassword: $.trim($("#newPassword").val()),
        confirmPassword: $.trim($("#confirmPassword").val()),
        email: $.trim($("#email").val()),
        sequenceNum: $.trim($("#sequenceNum").val())
    }

    if (data.newPassword == "" || data.newPassword == null) {
        $(".item-msg").html("请输入密码");
        $("#newPassword").focus();
        Throttle.unLock(url);
        return false;
    }

    if (data.newPassword && !Validation.check('password', data.newPassword)) {
        $(".item-msg").html('密码仅支持大小写字母、数字、"_"、"."');
        $("#newPassword").focus();
        Throttle.unLock(url);
        return false;
    }

    if (data.newPassword && !Validation.checkLength(data.newPassword, 16)) {
        $(".item-msg").html('密码长度不能大于16位字符');
        $("#newPassword").focus();
        Throttle.unLock(url);
        return false;
    }

    if ($.trim(data.newPassword) != $.trim(data.confirmPassword)) {
        $(".item-msg").html('两次输入密码不一致，请重新输入。');
        $("#confirmPassword").focus();
        Throttle.unLock(url);
        return false;
    }

    return data;
}

const ResetPwd = {
    init: function () {
        $(".confirm").on("click", function () {
            if ($(".confirm").hasClass("disabled")) {
                return false;
            }
            $(".item-msg").html("");
            let url = Store.getState('BASE_URL') + "/forgetpassword/resetpassword";
            let securityPolicyObj = { "弱": 1, "中": 2, "强": 3 };
            let passwordStrengthOfSecurityPolicy = securityPolicy.passwordStrength;
            let newPasswordStrength = securityPolicyObj[$(".newPasswordTip .tip-info").text()];
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
            if (Throttle.isLock(url)) {
                return false;
            }
            let data = beforeSave();
            if (!data) {
                Throttle.unLock(url);
                return false;
            }
            let mData = DigestAuth.makePassword(nonce, data.newPassword);
            mData.email = data.email;
            mData.sequenceNum = data.sequenceNum;
            Throttle.lock(url);
            $.post(url, mData, function (t) {
                if (t.success) {
                    $(".confirm").addClass("disabled")
                }
                MoAlert(t.description, function () {
                    location.href = "/login.html";
                });
                Throttle.unLock(url);
            }, 'json');
        });
    }
}

export { ResetPwd }