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
            // nonceValue: '',
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
