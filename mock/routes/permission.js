const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/edit', async (ctx) => {
  ctx.body = Mock.mock({
    "code": 0
  })
})

module.exports = router