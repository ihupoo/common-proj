import Store from '@/store';
import { Trans } from '@/utils/utils';
import { fetchLoop, fetchSsoToken } from '../../utils';
import TemplateIndex from './index.art';
import TemplateHeader from './header.art';

const fetchState = new fetchLoop()


function renderData(data, dom){
    if(data.liveinfo.length != 0){
        $(dom).find('.no-data-wrapper').addClass("hidden");
        $(".vrs-living-container").removeClass("none-visible");
        //render
        $(dom).empty().append($(TemplateIndex(data)).localize())

    }else{
        $(dom).find('.no-data-wrapper').removeClass("hidden");
        $(".vrs-living-container").addClass("none-visible");
    }
}


function eventBindTitle(dom){

    $(dom).find(".more").on("click",function(e){
        e.preventDefault();
        let me = $(this);
        if(me.attr("href").indexOf("?") == -1){
            fetchSsoToken().then(token => {
                location.href = me.attr("href") + "?" + Trans.base64encode(Trans.utf16to8("sso_token="+token));
            })
        }
    })
    
}


function fetchLoad({ moid , vrsIp, domainType }, dom){//获取告警信息
    const { BASE_URL } = Store.getState()

    let livingData= {
        "liveinfo": []
    };

    //核心域下 从网管处拿数据
    if(domainType === 0){
        return $.get(BASE_URL + "/nms/getAppointedLivingList",{
            'moid':moid,
            num:6
        },function(t){
            if(t.success){
                livingData.liveinfo = t.data.liveinfo;
            }
        },'json').error(function(){

        }).complete(function() {
            renderData(livingData, dom);
            fetchState.loop()
        });
    }else{//非核心域下 从录播处拿数据
        return $.get(BASE_URL + "/vrs/getVrsResRoom",{
            vrsIp:vrsIp,
            prgs1page:6,
            pageid:1
        },function(t){
            if(t.success){
                livingData.liveinfo = t.data.liveinfo;
            }
        },'json').error(function(){

        }).complete(function() {
            renderData(livingData, dom);
            fetchState.loop()
        });
    }
   
}

export default {
    render(dom, { user, menu }){
        const moid = user.serviceDomainAdmin ? user.serviceDomainMoid : ( user.userDomainAdmin ? user.userDomainMoid : user.moid);

        const { domainType } = Store.getState()

        this.renderHeader(`${dom}-header`, user, menu, domainType)
        this.renderContent(dom, moid, menu, domainType)
    },
    renderHeader(dom, { usualUser, serviceDomainAdmin, jmsType, userDomainAdmin }, { vrsIP, livingUrl, }, domainType ) {

        const data = {
            head_titles:["即将直播"],
            head_more: (() => {
                if(usualUser) return []
                let moreList = [
                    { more: "全部", url: "allLiveRooms?type=appointment" },
                    { more: "更多", url: `//${vrsIP}${livingUrl}` }
                ]
                //服务域管理员
                if (serviceDomainAdmin && jmsType !== 1) {
                    //服务域管理员不显示直播室更多
                    moreList = moreList.filter(x => x.more !== '更多')
                }
                //用户域管理员
                if (userDomainAdmin) {
                    //用户域管理员不显示直播室全部
                    moreList = moreList.filter(x => x.more !== '全部')
                    
                    if (domainType === 0) {
                        moreList = moreList.filter(x => x.more !== '更多')
                    }
                }
                return moreList
            })(),
        }

        $(dom).empty().append($(TemplateHeader(data)).localize())
        !usualUser && eventBindTitle(dom)
    },  
    renderContent(dom, moid,  { vrsIp }, domainType) {
        $(dom).empty().append($(TemplateIndex({ liveinfo: [] })).localize())
        $(dom).find('.no-data-wrapper').removeClass("hidden")

        fetchState.cache({ moid, vrsIp, domainType, dom }).start(({ moid, vrsIp, domainType , dom }) => fetchLoad({ moid, vrsIp, domainType }, dom))
        
    },

    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    }
}
