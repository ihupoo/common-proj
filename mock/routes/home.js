const router = require('koa-router')()
let Mock = require('mockjs');


router.get('/getallmodules', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            "weibo": {
                "name": "社交网络SNS",
                "value": false,
                "show": "",
                "url": "http:///weibo/home"
            },
            "bmc": {
                "name": "业务管理系统",
                "value": false,
                "show": "",
                "url": "http:///bmc/home"
            },
            "amc": {
                "name": "账号管理系统",
                "value": true,
                "show": "",
                "url": "/amc/home"
            },
            "nms": {
                "name": "网管系统",
                "value": true,
                "show": "",
                "url": "/nms/home"
            },
            "jms": {
                "name": "配置管理",
                "value": true,
                "show": "",
                "url": "/jms"
            },
            "cmc": {
                "name": "会议管理系统",
                "value": true,
                "show": "",
                "url": "/meeting/home"
            },
            "vrs": {
                "name": "会议录播系统",
                "value": true,
                "show": "",
                "url": "//10.67.0.1:22/index.html"
            },
            "live": {
                "name": "会议直播系统",
                "value": false,
                "show": "",
                "url": "//10.67.0.1:22/index.html"
            },
            "umc": {
                "name": "网呈管理系统",
                "value": true,
                "show": "",
                "url": "/tps?ip="
            },
            "vrs_live": {
                "name": "",
                "value": "",
                "show": "",
                "url": ""
            },
            "kis": {
                "name": "智能会议平台",
                "value": false,
                "show": "",
                "url": "/kis"
            },
            "doms": {
                "name": "大数据运维系统",
                "value": false,
                "show": "",
                "url": "/doms"
            },
            "cbs": {
                "name": "大数据管理系统",
                "value": false,
                "show": "",
                "url": "/cbs"
            }
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

router.get('/getuserinfo', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            currentuser:{
                account: 'jihuiqin',
                moid: '2cd61302-fafe-45b0-883b-f0671929b974',
                portrait40: '',
                portrait64: '',
                portrait128: '',
                portrait256: ''
            }
        },
        description: '',
        errorCode: "",
        success: true,
    })
})

module.exports = router
