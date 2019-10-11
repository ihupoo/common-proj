const router = require('koa-router')()
let Mock = require('mockjs');

router.post('/login',async (ctx) => {
  const { username } = ctx.request.body;
  ctx.body = {
    username
  }
})

module.exports = router
