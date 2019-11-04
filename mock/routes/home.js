const router = require('koa-router')()
let Mock = require('mockjs');

//user
router.get('/user', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            "id":7,
            "moid":"b89cd6ec-e828-4bc4-b0e7-c38171b78c6e",
            "email":"",
            "e164":"0512110000002",
            "account":"admin1",
            "mobile":"",
            "ipRegion":null,
            "jid":"b89cd6ec-e828-4bc4-b0e7-c38171b78c6e@sxhxxgf2",
            "encryptionPassword":"30388A05D9208210375CDEE08E719614",
            "password":"21218cca77804d2ba1922c33e0151105",
            "userDomainMoid":"eillmecl8tw73ybo50fqunsz",
            "userDomainName":"不要停用233的用户域",
            "serviceDomainMoid":"mooooooo-oooo-oooo-oooo-defaultserdo",
            "serviceDomainName":"默认服务域",
            "deviceGuid":null,
            "nuServerId":null,
            "deviceType":"561",
            "accountType":0,
            "binded":false,
            "enable":true,
            "isDeleted":false,
            "createdAt":null,
            "limited":false,
            "manageUserDomainMoid":null,
            "name":"admin1",
            "seat":"",
            "extNum":"",
            "brief":"ssss",
            "fullPy":null,
            "sex":"1",
            "jobNum":"",
            "dateOfBirth":null,
            "fax":"",
            "policyMoid":"mooooooo-oooo-oooo-oooo-security",
            "updatePasswordDateTime":1564502400000,
            "firstLogin":false,
            "validityPeriod":1924876800000,
            "restrictUsedOn":"SKY for Mac;SKY for Android TV;SKY for Windows;iPhone;iPad;Android_Phone;TrueLink",
            "restrictStrategy":null,
            "portrait32":"files/h/b89cd6ece8284bc4b0e7c38171b78c6e/h64.jpg?t=1568167198246",
            "portrait40":"files/h/b89cd6ece8284bc4b0e7c38171b78c6e/h40.jpg?t=1568167198246",
            "portrait64":"files/h/b89cd6ece8284bc4b0e7c38171b78c6e/h64.jpg?t=1568167198246",
            "portrait128":"files/h/b89cd6ece8284bc4b0e7c38171b78c6e/h128.jpg?t=1568167198246",
            "portrait256":"files/h/b89cd6ece8284bc4b0e7c38171b78c6e/h256.jpg?t=1568167198246",
            "enableHDMeeting":true,
            "enableHD":true,
            "enableFullHD":true,
            "enableUltraHD":false,
            "enableCall":false,
            "enableRoam":false,
            "enableSatellite":false,
            "enableSatelliteP2P":false,
            "userDomainAdmin":true,
            "enableWeibo":false,
            "enableWebRtc":false,
            "weiboAdmin":false,
            "enableMeeting":true,
            "meetingAdmin":true,
            "enableMeetingSMS":false,
            "enableBMC":false,
            "enableUMC":true,
            "enableDCS":true,
            "enableVRS":true,
            "enableNM":true,
            "enableDoms":false,
            "enableKIS":false,
            "enableVenueMonitor":false,
            "serviceDomainAdmin":false,
            "defaultServiceDomainAdmin":false,
            "defaultUserDomainAdmin":true,
            "enableOut":false,
            "enableIncoming":false,
            "dcsAdmin":true,
            "vrsAdmin":true,
            "vrsDefaultAdmin":true,
            "nmAdmin":true,
            "domsAdmin":false,
            "kisAdmin":false,
            "kisDefaultAdmin":false,
            "enableVideo":true,
            "enableLive":true,
            "enablePlay":true,
            "enableUnicat":true,
            "enableDownload":true,
            "enableWatch":true,
            "enableAutoCreateMeeting":false,
            "enablePublicCloudAccess":false,
            "cmsApproval":true,
            "editName":false,
            "rank":null,
            "accountSipIdentification":null,
            "account323Identification":null,
            "e164SipIdentification":null,
            "e164323Identification":null,
            "terminalRegistration":null,
            "virMachineroomMoid":"mooooooo-oooo-oooo-oooo-defaultplatf",
            "cloudModelDisplay":false,
            "cloudModelName":"私有云",
            "cloudModelType":1,
            "depts":[
                {
                    "departmentMoid":null,
                    "departmentId":4,
                    "departmentName":"未分组用户",
                    "fullPath":null,
                    "deptPosition":""
                }
            ],
            "empDepts":null,
            "portraitDomain":null,
            "systemSecurity":1,
            "securityPolicy":{
                "policyMoid":"mooooooo-oooo-oooo-oooo-security",
                "name":"通用规则",
                "policyType":0,
                "enableInitialLogin":false,
                "passwordStrength":1,
                "enableUpdateCycle":false,
                "expireIn":null,
                "enableLock":true,
                "errorCount":3,
                "lockExpireIn":5
            },
            "strengthRegular":`{"1":"^[A-Za-z0-9]{8,16}$","2":"(?!^([0-9]+|[a-zA-Z]+|[._]+)$)^[0-9a-zA-Z._?]{8,16}$","3":"^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[._])[0-9a-zA-Z._]{8,16}$"}`,
            "passwordExpire":null,
            "usualUser":false
        },
        description: "",
        errorCode: "",
        success: true,
    })
})


//user-menu
router.get('/userMenu', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            "show_sh":1,
            "cloudModelInfo":[
    
            ],
            "currentIps":[
                "172.16.185.233"
            ],
            "jmsType":0,
            "jmsConfigGuideUrl":""
        },
        description: "",
        errorCode: "",
        success: true,
    })
})


//menu
router.get('/menu', async (ctx) => {
    ctx.body = Mock.mock({
        data: {
            "weiboUrl":"/weibo/home",
            "meetingUrl":"/meeting/home",
            "vrsUrl":"/index.html",
            "liveUrl":"/live.html",
            "livingUrl":"/forthcom.html",
            "nmUrl":"/nms/home",
            "bmcUrl":"/bmc/home",
            "amcUrl":"/amc/home",
            "susUrl":"http://172.16.185.233:8080/susweb/home",
            "umcUrl":"/tps",
            "kisUrl":"/kis",
            "jmsUrl":"/luban",
            "sjmsUrl":"/jms",
            "cbsUrl":"/cbs",
            "domsUrl":"/doms",
            "vrsShow":1,
            "cbsShow":0,
            "domsShow":null,
            "enableNexvision":0,
            "tpsIP":"",
            "kisIP":"",
            "vrsIP":"10.67.16.29:80",
            "licenseInvalidWarn":0,
            "createMeetingUrl":"/meeting/meeting/create"
        },
        description: "",
        errorCode: "",
        success: true,
    })
})

module.exports = router
