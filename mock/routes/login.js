const router = require('koa-router')()
let Mock = require('mockjs');

//页面通用数据realmName
router.get('/getreal', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            realmName: ''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

//登录之前，获取的数据
router.get('/info', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            showVerifyCode: '0',
            outAlter: '0',
            nonceValue: '',
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

//登录成功后，获取用户信息，存入缓存
router.get('/user', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            passwordExpire: '',
            cloudModeInfo: '',
            vrsShow: '',
            cbsShow: '',
            domsShow: '',
            enableNexvision: '',
            tpsIP: '',
            kisIP: '',
            vrsIP: '',
            show_sh: '',
            portraintDomain: '',
            isUserDomainAdmin: '',
            isServiceDomainAdmin: '',
            isUsualUser: '',
            jmsConfigGuideUrl: '',
            jmsType: '',
            licenseInvalidWarn: '',
            onlyCurrentIp: '',
            umoid: '',
            systemSecurity: '',
            securityPolicy: {},
            brithday: '',
            username: '',//和name取一
            //
            name: '',
            userDomainMoid: '',
            userDomainAdmin: '',
            moid: '',
            account: '',
            mobile: '',
            email: '',
            sex: '',
            seat: '',
            extNum: '',
            e164: '',
            depts: '',
            fax: '',
            meetingAdmin: '',
            serviceDomainMoid: '',
            enableMeeting: '',
            enableNM: '',
            enableWeibo: '',
            enableBMC: '',
            enableVRS: '',
            enableLive: '',
            enableKIS: '',
            enablePublicCloudAccess: '',
            cloudModelDisplay: '',
            virMachineroomMoid: '',
            cloudModelName: '',
            portrait40: '',
            portrait64: '',
            portrait128: '',
            portrait256: ''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
