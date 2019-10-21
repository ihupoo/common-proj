const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/getcore', async (ctx) => {
  ctx.body = Mock.mock({
    data: {
      strengthRegular: '',
        
      realmName:''
    },
    description: "",
    errorCode: "",
    success: true,
  })
})

module.exports = router
