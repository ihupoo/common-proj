import Store from '@/store';
import TemplateBookMeetingInfo from '../book_meeting_info';
import TemplateCallMeetingInfo from '../call_meeting_info';
import TemplatePastMeetingInfo from '../past_meeting_info';
import TemplateHeader from './header.art';


let TEMPLATE = {
    book_meeting_info: TemplateBookMeetingInfo,
    call_meeting_info: TemplateCallMeetingInfo,
    past_meeting_info: TemplatePastMeetingInfo,
}

let TITLE = {
    '正在召开的会议': 'book_meeting_info',
    '预约的会议': 'call_meeting_info',
    '历史会议': 'past_meeting_info',
}


let titles = [], mores = []

function getTabName(){
    let activeName = $(".meeting_info .active .title").text();
    return { tabName : TITLE[activeName] }
}

function eventBindTitle(){
    let $containerDom = $(".meeting_info");
    $containerDom.find('.tab .header-title').on('click',function(){
        if($(this).hasClass('active')) return;
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        let { tabName } = getTabName()
        
        titles.forEach(tab =>{
            if(tab === tabName){
                TEMPLATE[tab].show()
            }else{
                TEMPLATE[tab].hide()
            }
        })
        if(mores){
            let { url , canShow } = mores.url[tabName]
            let $a = $containerDom.find('.header-more a.more').attr('href', url)
            canShow ? $a.show() : $a.hide()
        }
    })
}


export default {
    render(dom, { user, menu }){

        this.renderHeader(`${dom}-header`, user, menu)
        this.renderContent(dom)
    },
    renderHeader(dom, { enableNM, serviceDomainAdmin, jmsType, userDomainAdmin, enableMeeting  }, { createMeetingUrl } ) {
        const domainType = Store.getState('domainType')
        const data = {
            head_titles: (() => {
                let titleList = ["正在召开的会议","预约的会议","历史会议"];
                //服务域管理员
                if(serviceDomainAdmin && jmsType !== 1){//服务域管理员
                    titleList = titleList.filter(x => x === '预约的会议')
                }
                //用户域管理员
                if (userDomainAdmin && !enableMeeting) {
                    titleList = titleList.filter(x => x !== '预约的会议')
                }
    
            
                return titleList
            })(),
            head_more: (() => {
                let moreList = [
                    { more: '创建会议', url: createMeetingUrl },
                    { more: '更多', url: {
                        call_meeting_info : {
                            url: domainType === 0 
                                ? '/nms/home/?path=realtime_meeting'
                                : '/meeting/mcc',
                            canShow: true
                        },
                        book_meeting_info : {
                            url: '/nms/home/?path=appointment_meeting',
                            canShow: enableNM
                        },
                        past_meeting_info : {
                            url: '/nms/home/?path=history_meeting',
                            canShow: enableNM
                        },
                    } }
                ]
                //核心域不显示创建会议
                if(domainType === 0){
                    moreList = moreList.filter(x => x.more !== '创建会议')
                    //无网管权限没有更多
                    if(!enableNM){
                        moreList = moreList.filter(x => x.more !== '更多')
                    }
                }
    
                return moreList
    
            })(),
        }

        $(dom).empty().append($(TemplateHeader(data)).localize())

        eventBindTitle()

    },  
    renderContent(dom) {

        $(dom).empty()
        let $containerDom = $(".meeting_info");

        titles = head_titles.map(x => TITLE[x])
        mores = head_more.find(x => x.more === '更多')

        titles.forEach((tab, index) => {
            TEMPLATE[tab].render(dom, { user })
            if(index === 0){
                //第一个显示
                TEMPLATE[tab].show()
                if(mores){
                    let { url , canShow } = mores.url[tab]
                    let $a = $containerDom.find('.header-more a.more').attr('href', url)
                    canShow ? $a.show() : $a.hide()
                }
            }else{
                TEMPLATE[tab].hide()
            }
        })
    },



    startfetch(){
        titles.forEach((tab, index) => {
            TEMPLATE[tab].startfetch()
        })
    },
    stopfetch(){
        titles.forEach((tab, index) => {
            TEMPLATE[tab].stopfetch()
        })
    }
}
