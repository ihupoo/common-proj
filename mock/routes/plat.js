const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/getplatedata', async (ctx) => {
  ctx.body = Mock.mock({
    data: {
        editName: false,
        realmName: 'kedacom',
        systemSecurity: '1',
        strengthRegular: {"1":"^[A-Za-z0-9]{8,16}$","2":"(?!^([0-9]+|[a-zA-Z]+|[._]+)$)^[0-9a-zA-Z._?]{8,16}$","3":"^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[._])[0-9a-zA-Z._]{8,16}$"},
        securityPolicy:{
            passwordStrength: '1'
        },
        portraitDomain: ''
    },
    description: "",
    errorCode: "",
    success: true,
  })
})

module.exports = router
