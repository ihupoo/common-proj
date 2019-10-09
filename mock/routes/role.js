const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/create',async (ctx) => {
  ctx.body = Mock.mock({
    "code": 0
  })
})

router.get('/list', async (ctx) => {
  ctx.body = Mock.mock({
    "code": 0,
    "result": {
      "page": 1,
      "page_size": 10,
      "total_count": 25,
      "page_count": 3,
      "item_list|7": [{
        "id|+1": 1,
        "role_name": /(管理人员)|(客服专员)|(财务专员)|(市场专员)|(人力专员)|(研发)|(测试)|(系统管理员)/,
        "status|0-1": 1,
        "authorize_user_name": "@cname",
        "authorize_time": 1521270166000,
        "create_time": 1499305790000,
        "menus": ["/admin/home", "/admin/ui/buttons", "/admin/ui/modals", "/admin/ui/loadings", "/admin/ui/notification", "/admin/ui/messages", "/admin/ui/tabs", "/admin/ui/gallery", "/admin/ui/carousel", "/admin/ui"]
      }]
    }
  })
})

router.get('/user_list', async (ctx) => {
  ctx.body = Mock.mock({
    "code": 0,
    "result|20": [{
      "status|0-1": 0,
      "user_id|+1": 1,
      "user_name": "@cname"
    }]
  })
})

router.get('/user_role_edit', async (ctx) => {
  ctx.body = Mock.mock({
    "code": 0
  })
})

module.exports = router