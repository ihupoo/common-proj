import movision from './movision';
import kedacom from './kedacom';
import telecom from './telecom';
import DX6000 from './DX6000';

export default {
    home: {
        user: {
            modify: {
                title: '修改个人资料',
                label: {
                    account: '账号',
                    mobile: '手机',
                    email: '电子邮箱',
                    address: '办公位置'
                },
                btn: {
                    confirm: '确定',
                    cancel: '取消',
                }
            }
        },
        password: {
            modify: {
                title: '修改密码',
                label: {
                    conPassword: '确认密码',
                    newPassword: '新密码',
                    oldPassword: '当前密码',
                },
                btn: {
                    confirm: '确定',
                    cancel: '取消',
                },
                info: {
                    format: '密码由1-32个字符组成，支持字母大小写、数字、"_"、"."(不包括空格)'
                }
            }
        },
        pagebase: {
            copyright: '版权所有',
            movision,
            kedacom,
            telecom,
            DX6000
        }
    },
    SSO: {
        login: {
            username: '用户名',
            password: '密码',
            submit: '登录',
            forgetPassword: '忘记密码',
        }
    }
}
