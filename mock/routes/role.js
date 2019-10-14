const router = require('koa-router')()
let Mock = require('mockjs');

router.get('/user', async (ctx) => {
  ctx.body = Mock.mock({
   
  })
})

module.exports = router
