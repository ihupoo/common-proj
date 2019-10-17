const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/info', async (ctx) => {
  ctx.body = Mock.mock({
    data: {
        showVerifyCode: '',
        realmName: 'kedacom',
        nonceValue: '',
        outAlter: '0',
        versionYear: '2019',
        loginUserName: '',
        sysBrand: 'kedacom'
    },
    description: "",
    errorCode: "",
    success: true,
  })
})

module.exports = router
