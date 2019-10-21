const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/getresetpassword', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            email: '',
            sequenceNum: '',
            securityPolicy: {},
            strengthRegular: ''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
