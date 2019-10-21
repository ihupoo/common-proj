const router = require('koa-router')()
let Mock = require('mockjs');

//menu
router.get('/getmenu', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            liveUrl: '',
            livingUrl: '',
            weiboUrl: '',
            bmcUrl: '',
            amcUrl: '',
            nmUrl: '',
            sjmsUrl: '',
            jmsUrl: '',
            meetingUrl: '',
            umcUrl: '',
            kisUrl: '',
            domsUrl: '',
            cbsUrl: '',
            
            createMeetingUrl: ''
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
