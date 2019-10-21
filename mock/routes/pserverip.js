const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/getpserverip', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            currentIps: ''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
