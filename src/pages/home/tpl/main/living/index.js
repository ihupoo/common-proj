import Store from '@/store';
import { Trans } from '@/utils/utils';
import { fetchLoop, fetchSsoToken } from '../../utils';
import TemplateIndex from './index.art';

const fetchState = new fetchLoop()


function renderData(data, dom){
    if(data.liveinfo.length != 0){
        $(dom).siblings('.no-data-wrapper').addClass("hidden");
        $(".vrs-living-container").removeClass("none-visible");
        //render
        $(dom).empty().append($(TemplateIndex(data)).localize())

    }else{
        $(dom).siblings('.no-data-wrapper').removeClass("hidden");
        $(".vrs-living-container").addClass("none-visible");
    }
}


function eventBindTitle(){
    let $containerDom = $(".living");

    $containerDom.find(".more").on("click",function(e){
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
    if(domainType === 'coreDomain'){
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
    render(dom, { user }){
        const { vrsIp } = user;
        $(dom).empty().append($(TemplateIndex({ liveinfo: [] })).localize())
        $(dom).siblings('.no-data-wrapper').removeClass("hidden").find('.warm-text').text('暂无即将直播的信息');
  

        eventBindTitle()
    
        const moid = user.isServiceDomainAdmin ? user.serviceDomainMoid : ( user.isUserDomainAdmin ? user.userDomainMoid : user.moid);

        const { domainType } = Store.getState()

        fetchState.cache({ moid, vrsIp, domainType, dom }).start(({ moid, vrsIp, domainType , dom }) => fetchLoad({ moid, vrsIp, domainType }, dom))
        
    },
    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    }
}
