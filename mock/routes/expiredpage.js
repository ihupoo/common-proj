const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/getexpired', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            message: ''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
