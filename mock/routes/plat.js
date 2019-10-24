const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/getplat', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            editName: true,   
            strengthRegular: '',
        
            realmName:''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
