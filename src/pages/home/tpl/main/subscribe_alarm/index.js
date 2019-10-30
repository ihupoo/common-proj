import Store from '@/store';
import TemplateIndex from './index.art';
import '@/lib/artDialog/4.1.7/jquery.artDialog.min';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/styles/reset-artDialog.scss';


let fetchState = {
        cache: null,
        ajaxId: null,
        poll : true
    };

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

function showSubcribe(data, dom){
    if(data.length != 0){
        $(dom).siblings('.no-data-wrapper').addClass("hidden");
        $("#warm-grid").datagrid('loadData', data);
    }else{
        $(dom).siblings('.no-data-wrapper').removeClass("hidden");
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
            showSubcribe(data, dom);
        }else{
            showSubcribe([], dom);
        }
        if(fetchState.poll){
            fetchState.ajaxId = fetchLoad(user, resourceData, dom)
        }
    },'json').error(function(){
        showSubcribe([], dom);
        if(fetchState.poll){
            fetchState.ajaxId = fetchLoad(user, resourceData, dom)
        }
    }); 

}

export default {
    render(dom, { user }){
        //没有网管权限不显示媒体资源
        $(dom).empty().append($(TemplateIndex({})).localize())
        $(dom).siblings('.no-data-wrapper').removeClass("hidden").find('.warm-text').text('暂无订阅告警信息');
        datagridInit()
        
        const moid = user.isServiceDomainAdmin ? user.serviceDomainMoid : ( user.isUserDomainAdmin ? user.userDomainMoid : user.moid);

        fetchState.cache = { moid, dom }
        fetchState.ajaxId = fetchLoad(moid, dom)
    },
    startfetch(){
        const { moid, dom } = fetchState.cache;
        fetchState.poll = true;
        fetchState.ajaxId = fetchLoad(moid, dom)
    },
    stopfetch(){
        fetchState.poll = false;
        fetchState.ajaxId.abort()
    }
}
