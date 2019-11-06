import Store from '@/store';
import TemplateBookMeetingInfo from '../book_meeting_info';
import TemplateCallMeetingInfo from '../call_meeting_info';
import TemplatePastMeetingInfo from '../past_meeting_info';
import TemplateIndex from './index.art';
import TemplateHeader from './header.art';


let TEMPLATE = {
    book_meeting_info: TemplateBookMeetingInfo,
    call_meeting_info: TemplateCallMeetingInfo,
    past_meeting_info: TemplatePastMeetingInfo,
}

let TITLE = {
    '正在召开的会议': 'call_meeting_info',
    '预约的会议': 'book_meeting_info',
    '历史会议': 'past_meeting_info',
}

function getTabName(){
    let activeName = $(".meeting_info .active .title").text();
    return { tabName : TITLE[activeName] }
}

function eventBindTitle(dom, contentDom, titles, mores){
    $(dom).find('.tab .header-title').on('click',function(){
        if($(this).hasClass('active')) return;
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        let { tabName } = getTabName()
        
        titles.forEach(tab =>{
            if(tab === tabName){
                $(contentDom).find(`.${tab}-container`).show()
                TEMPLATE[tab].refresh()
            }else{
                $(contentDom).find(`.${tab}-container`).hide()
            }
        })
        if(mores){
            let { url , canShow } = mores.url[tabName]
            let $a = $(dom).find('.header-more a.more').attr('href', url)
            canShow ? $a.show() : $a.hide()
        }
    })
}


export default {
    cache:{
        titles: [],
    },
    render(dom, { user, menu }){

        const [titles, mores]= this.renderHeader(`${dom}-header`, dom, user, menu)
        this.renderContent(dom, `${dom}-header` , { user, menu } , titles, mores)
        this.cache.titles = titles
    },
    renderHeader(dom, contentDom , { enableNM, serviceDomainAdmin, jmsType, userDomainAdmin, enableMeeting  }, { createMeetingUrl } ) {
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

        let titles = data.head_titles.map(x => TITLE[x])
        let mores = data.head_more.find(x => x.more === '更多')

        eventBindTitle(dom,contentDom ,titles, mores)

        return [titles, mores]

    },  
    renderContent(dom, headerDom, { user, menu }, titles, mores) {
        $(dom).empty().append($(TemplateIndex({})).localize())

        titles.forEach((tab, index) => {
            TEMPLATE[tab].render(`.${tab}-container`, { user, menu })
            if(index === 0){
                //第一个显示
                $(dom).find(`.${tab}-container`).show()
                if(mores){
                    let { url , canShow } = mores.url[tab]
                    let $a = $(headerDom).find('.header-more a.more').attr('href', url)
                    canShow ? $a.show() : $a.hide()
                }
            }else{
                $(dom).find(`.${tab}-container`).hide()
            }
        })
    },
    startfetch(){
        this.cache.titles.forEach((tab, index) => {
            TEMPLATE[tab].startfetch()
        })
    },
    stopfetch(){
        this.cache.titles.forEach((tab, index) => {
            TEMPLATE[tab].stopfetch()
        })
    }
}
