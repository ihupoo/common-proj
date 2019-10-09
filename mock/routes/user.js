const router = require('koa-router')()
let Mock = require('mockjs');

// table
router.get('/delete', async (ctx, next) => {
  ctx.body = Mock.mock({
    "code": 0
  })
})

router.get('/add', async (ctx, next) => {
  ctx.body = Mock.mock({
    "code": 0,
    "result": "Ok"
  })
})

router.get('/edit', async (ctx, next) => {
  ctx.body = Mock.mock({
    "code": 0,
    "result": "Ok"
  })
})

router.get('/list', async (ctx) => {
  ctx.body = Mock.mock({
    "code": 0,
    "message": "",
    "result": {
      "item_list|10": [{
        "id|+1": 1,
        "username": "@cname",
        "sex|1-2": 1,
        "state|0-4": 0,
        "interest|0-7": 0,
        "isMarried|0-1": 1,
        "birthday": "2000-01-01",
        "address": "北京市海淀区",
        "time": "09:00:00"
      }],
      page: 1,
      page_size: 10,
      total_count: 30
    }
  })
})


router.post('/login',async (ctx) => {
  const { username } = ctx.request.body;
  ctx.body = {
    username
  }
})

module.exports = router