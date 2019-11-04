import Store from '@/store';
import { fetchLoop } from '../../utils';
import TemplateIndex from './index.art';
import TemplateHeader from './header.art';

import '@/lib/easyui'

const fetchState = new fetchLoop()

function datagridInit(){
    $("#warm-grid").datagrid({
        idField : "id",
        columns: [[
            { field: 'id', hidden: true },
            { field: 'start_time', width: 121, align: 'left' },
            {
                field: 'device_name', width: 241, align: 'left', 
                formatter: function (value) {
                    return '<div class="grid_td-item" title="' + value + '">' + value + '</div>'
                }
            },
            {
                field: 'description', width: 131, align: 'right', 
                formatter: function (value) {
                    return '<div class="grid_td-item" title="' + value + '">' + value + '</div>'
                }
            }
        ]],
        onLoadSuccess:function () {
        }
    });
}

function renderGrid(data, dom){
    if(data.length != 0){
        $(dom).find('.no-data-wrapper').addClass("hidden");
        $("#warm-grid-container").removeClass("none-visible");
        $("#warm-grid").datagrid('loadData', data);
    }else{
        $(dom).find('.no-data-wrapper').removeClass("hidden");
        $("#warm-grid-container").addClass("none-visible");
    }
}


function fetchLoad(moid, dom){//获取告警信息
    const { BASE_URL } = Store.getState()

    return $.get(BASE_URL + "/nms/getWarning",{
        moid,
        num:10,
        level:'critical'
    },function(t){//level:critical,important,normal 三种告警类型
        if(t.success){
            let data = t.data.unrepaired_warnings;
            renderGrid(data, dom);
        }else{
            renderGrid([], dom);
        }
    },'json').error(function(){
        renderGrid([], dom);
        
    }).complete(function() {
        fetchState.loop()
    });

}

export default {
    render(dom, { user }){ 
        const moid = user.serviceDomainAdmin ? user.serviceDomainMoid : ( user.userDomainAdmin ? user.userDomainMoid : user.moid);

        this.renderHeader(`${dom}-header`, user, moid)
        this.renderContent(dom, moid)
    },
    renderHeader(dom, { enableNM }, moid ) {
        const data = {
            head_titles: ["订阅告警"],
            head_more: (() => {
                let moreList = [
                    { more:"更多", url:`/nms/home/?path=unrepairedwarning&domainMoid=${moid}` }
                ]
                //没有网管权限不显示更多
                if (!enableNM) {
                    moreList = moreList.filter(x => x !== '更多')
                }
                return moreList
            })(),
        }

        $(dom).empty().append($(TemplateHeader(data)).localize())
    },  
    renderContent(dom, moid) {
        $(dom).empty().append($(TemplateIndex({})).localize())
        $(dom).find('.no-data-wrapper').removeClass("hidden");
        datagridInit()
        
        fetchState.cache({ moid, dom }).start(({ moid, dom }) => fetchLoad(moid, dom))
    },
    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    }
}
