$.namespace("Home.Data");
Home.Data = {
    sysmode: 'buildSelf',
    domainType: 'coreDomain',
    passwordExpire: '',
    userDomainMoid: 'mvisiomdefaultuserdomain',
    userMoid: 'mooooooo-oooo-oooo-oooo-defaultadmin',
    serviceDomainMoid: 'mooooooo-oooo-oooo-oooo-defaultserdo',
    currentDateStr: new Date().toDateString(),
    isUserDomainAdmin: true,
    isServiceDomainAdmin: true,
    isUsualUser: false,
    enableMeeting: true,
    meetingAdmin: true,
    enableNM: true,
    moid: this.isServiceDomainAdmin?this.serviceDomainMoid:(this.isUserDomainAdmin?this.userDomainMoid:this.userMoid),
    vrsIP: '',
    kisIP: '',
    cbsShow: '',
    domsShow: '',
    jmsConfigGuideUrl: '',
    jmsType: '1',
    licenseInvalidWarn: '',
    portraitDomain: '',
    isSimpleMcu: '${jmsType}' === '1' ? true : false,
    panelData: '',
    adminData: {
        resource_load: {
            head_titles: ["资源负载"],
            contentId: "resource_load",
            resourceData: [
                { name: "虚拟会议室资源", percent: 0, showInfo: false },
                { name: "会议并发接入终端数AP", percent: 0 },
                { name: "媒体终端授权数MP", percent: 0 },
                { name: "媒体资源", percent: 0, showInfo: false }
            ],
            head_more: [{ more: "更多", url: "/nms/home/?path=platformdevice&domainMoid=" + this.moid }],
            subscribe_alarm: {
                head_titles: ["订阅告警"],
                contentId: "subscribe_alarm",
                head_more: [{ more: "更多", url: "/nms/home/?path=unrepairedwarning&domainMoid=" + this.moid }],
            },
            isClear: false,
        },
        platform_resource: {
            head_titles: ["平台CPU资源", "平台内存资源"],
            contentId: "platform_resource",
            resourceData: [

            ],
            head_more: [{ more: "显示自定义服务器", url: "javascript:void(0)" }, { more: "更多", url: "/nms/home/" }],
            containerWidth: 535,
            isClear: false,
        },
        meeting_count: {
            head_titles: ["并发会议统计", "并发会议在线终端统计", "终端在线统计"],
            head_more: [{ more: "更多", url: "/nms/home/?path=history_meeting&type=multi&domainMoid=" + this.moid }],
            contentId: "meeting_count",
            isClear: false,
        },
        book_meeting_count: {
            head_titles: ["预约会议并发统计"],
            contentId: "book_meeting_count",
            max: 0,
            min: 0,
            average: 0,
            isClear: false,
        },
        meeting_info: {
            head_titles: ["正在召开的会议", "预约的会议", "历史会议"],
            head_more: [{ more: '创建会议', url: '${createMeetingUrl}' }, { more: '更多', url: ('coreDomain' !== this.domainType ? '/meeting/mcc' : (isUserDomainAdmin ? '/nms/home/?path=realtime_meeting' : '/nms/home/?path=appointment_meeting')) }],
            contentId: "meeting_info",
            datagridIds: ['call_meeting_info', 'book_meeting_info', 'past_meeting_info'],
            isClear: false,
        },
        meeting_category_info: {
            head_titles: ["传统会议", "端口会议", "点对点会议"],
            head_more: [{ more: "更多", url: "/nms/home/?path=realtime_meeting&type=tran&domainMoid=" + this.moid }],
            contentId: "meeting_category_info",
            isClear: !(this.isServiceDomainAdmin || (this.isSimpleMcu && this.isUserDomainAdmin)),
        },
        live_room: {
            head_titles: ["直播室"],
            head_more: [
                { more: "全部", url: "allLiveRooms?type=live" },
                { more: "更多", url: "//" + "${vrsIP}" + "${menu.liveUrl}" }
            ],
            contentId: "live_room",
            isClear: false,
        },
        living: {
            head_titles: ["即将直播"],
            head_more: [
                { more: "全部", url: "allLiveRooms?type=appointment" },
                { more: "更多", url: "//" + "${vrsIP}" + "${menu.livingUrl}" }]
            ,
            contentId: "living",
            isClear: false,
        }
    },
    userData: {
        call_meeting_info: {
            head_titles: ["正在召开的会议"],
            contentId: "call_meeting_info",
            head_more: [{ more: "创建会议", url: "${createMeetingUrl}" }, { more: "更多", url: "/meeting/mcc" }],
            isClear: false,
        },
        book_meeting_info: {
            head_titles: ["预约的会议"],
            contentId: "book_meeting_info",
            head_more: [{ more: "更多", url: "/meeting/meeting/meetingList" }],
            isClear: false,
        },
        past_meeting_info: {
            head_titles: ["历史会议"],
            contentId: "past_meeting_info",
            head_more: [{ more: "更多", url: "/meeting/meeting/historyMeeting" }],
            isClear: false,
        },
        live_room: {
            head_titles: ["直播室"],
            head_more: [{ more: "更多", url: "//" + "${vrsIP}" + "${menu.liveUrl}" }],
            contentId: "live_room",
            isClear: false,
        },
        living: {
            head_titles: ["即将直播"],
            head_more: [{ more: "更多", url: "//" + "${vrsIP}" + "${menu.livingUrl}" }],
            contentId: "living",
            isClear: false,
        }
    },
    init() {
        if (this.isSimpleMcu) {
            domainType = 'jmsDomain';
        }
        this.panelData = this.isUsualUser ? this.userData : this.adminData;
    },
}