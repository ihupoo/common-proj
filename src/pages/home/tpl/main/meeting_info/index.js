import Store from '@/store';
import TemplateBookMeetingInfo from '../book_meeting_info';
import TemplateCallMeetingInfo from '../call_meeting_info';
import TemplatePastMeetingInfo from '../past_meeting_info';


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
    render(dom, { user }, { head_titles = [], head_more = [] }){
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
        eventBindTitle()
        
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
