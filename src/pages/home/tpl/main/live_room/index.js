import Store from '@/store';
import { Trans } from '@/utils/utils';
import { fetchLoop, fetchSsoToken } from '../../utils';
import TemplateIndex from './index.art';
import TemplateHeader from './header.art';
import videoDefaultPng from '@/pages/home/img/default.png';
import { MoAlert } from '@/components/popup'
import './templateFilter';

const fetchState = new fetchLoop()


function renderData(data, vrsIp, dom){
    if(data.roomstate.length != 0){
        $(dom).find('.no-data-wrapper').addClass("hidden");
        $(".vrs-live-container").removeClass("none-visible");
        //render
        $(dom).empty().append($(TemplateIndex({ ...data, videoDefaultPng, vrsIp })).localize())

    }else{
        $(dom).find('.no-data-wrapper').removeClass("hidden");
        $(".vrs-live-container").addClass("none-visible");
    }
}

function eventBind(dom, vrsIp){
    $(dom).find(".comm_video_img img[data-onerror]").on("error", function () {
        $(this).attr("src", $(this).attr("data-onerror"));
        $(this).off('error')
    })

    $(dom).on("click",".comm_video_img",function(){
        let streamjsonpath = $(this).find(".comm_video_path").html();
        let id = $(dom).find(".comm_video_id").html();
        let mp4_flag = !!streamjsonpath;

        let isEncrypt = $(".mo-icons-bg",$(".video-encrypt-icon",this)).hasClass("aes-icon")||$(".mo-icons-bg",".video-encrypt-icon").hasClass("gm-icon")
        if(isEncrypt){
            MoAlert("不支持播放此类型视频，加密类型视频请使用加密播放器观看。");
            return false;
        }else{
            fetchSsoToken().then(token => {
                let param = "id="+ id +"&live=1&sso_token=" + token
                //html播放
                if(mp4_flag){
                    //html播放
                    location.href  = "//"+vrsIp+ "/" + "broadcasthtml.html?" + Trans.base64encode(Trans.utf16to8(param))
                }else{
                    //asf播放
                    let agent = navigator.userAgent.toLowerCase() ;
                    let regStr_ff = /firefox\/[\d.]+/gi;
                    if (navigator.userAgent.indexOf("Chrome") > -1 ||
                        parseInt((agent.match(regStr_ff)+"").replace(/[^0-9.]/ig,"")) >= 52){
                        MoAlert("无法播放该视频，推荐使用IE浏览器观看");
                        return false;
                    }
                    location.href = "//"+vrsIp +  "/" +"broadcastasf.html?" + Trans.base64encode(Trans.utf16to8(param))
                
                }
            })
        }
    })
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

    let liveRoomData= {
        "roomstate": []
    };

    //核心域下 从网管处拿数据
    if( domainType === 0){
        return $.get(BASE_URL + "/nms/getLivesList",{
            'moid':moid,
            num:6
        },function(t){
            if(t.success){
                liveRoomData.roomstate = t.data.roomstate;
            }
        },'json').error(function(){

        }).complete(function() {
            renderData(liveRoomData, vrsIp, dom);
            fetchState.loop()
        });

    }else{//非核心域下 从录播处拿数据

        return $.get(BASE_URL + "/vrs/getVrsLiveRoom",{
            vrsIp:vrsIp,
            prgs1page:6,
            pageid:1,
            orderindex:7,
            desc:1
        },function(t){
            if(t.success){
                liveRoomData.roomstate = t.data.roomstate;
            }
        },'json').error(function(){

        }).complete(function() {
            renderData(liveRoomData, vrsIp, dom);
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
    renderHeader(dom, { usualUser, serviceDomainAdmin, jmsType, userDomainAdmin }, { vrsIP, liveUrl, }, domainType ) {

        const data = {
            head_titles: ["直播室"],
            head_more: (() => {
                if(usualUser) return []
                let moreList = [
                    {more:"全部",url:"allLiveRooms?type=live"},
                    {more:"更多",url:`//${vrsIP}${liveUrl}`}
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
        $(dom).empty().append($(TemplateIndex({ roomstate: [], videoDefaultPng, vrsIp })).localize())
        $(dom).find('.no-data-wrapper').removeClass("hidden")
        eventBind(dom, vrsIp)
    
        fetchState.cache({ moid, vrsIp, domainType, dom }).start(({ moid, vrsIp, domainType , dom }) => fetchLoad({ moid, vrsIp, domainType }, dom))
        
    },

    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    }
}
