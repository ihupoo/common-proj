const router = require('koa-router')()
let Mock = require('mockjs');

//强制修改密码，获取信息
router.get('/getpasswordinfo', async (ctx) => {
  ctx.body = Mock.mock({
    data: {
        strengthRegular: '',
        description: '',
        
        realmName:''
    },
    description: "",
    errorCode: "",
    success: true,
  })
})

module.exports = router
