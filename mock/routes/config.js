const router = require('koa-router')()
let Mock = require('mockjs');

//获取页面通用数据，存入缓存
router.get('/', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            systemMode: '0',
            domainType: '1',
            lang: 'zn-CN',
            sysBrand: 'kedacom',
            versionYear: '2019',
            realmName: ''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
