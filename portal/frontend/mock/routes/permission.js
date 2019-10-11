const router = require('koa-router')()
let Mock = require('mockjs');


router.get('', async (ctx) => {
  ctx.body = Mock.mock({
    
  })
})

module.exports = router
