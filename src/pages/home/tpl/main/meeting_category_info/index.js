import Store from '@/store';
import { fetchLoop } from '../../utils';
import TemplateIndex from './index.art';

import '@/lib/easyui/1.8.5/themes/icon.css';
import '@/lib/easyui/1.8.5/themes/default/easyui.css';
import '@/lib/easyui/1.8.5/jquery.easyui.min.js';
import '@/lib/easyui/1.8.5/locale/easyui-lang-zh_CN.js';
import '@/styles/reset-easyui.scss';
const fetchState = {
    transMeeting : new fetchLoop(),
    portMeeting : new fetchLoop(),
    p2pMeeting : new fetchLoop(),
}

const TITLE = {
    '传统会议': 'transMeeting',
    '端口会议': 'portMeeting',
    '点对点会议': 'p2pMeeting',
}

const WARNING =  {
    transMeeting : '暂无传统会议信息',
    portMeeting : '暂无端口会议信息',
    p2pMeeting : '暂无点对点会议信息',
}

const FETCHMEETING =  {
    transMeeting : fetchTransMeeting,
    portMeeting : fetchPortMeeting,
    p2pMeeting : fetchP2PMeetng,
}

let mores = [];

function datagridInit(){
    $("#meeting_category-grid").datagrid({
        idField : "id",
        columns:[[
            { field: 'id', hidden: true },
            {
                field: 'name', width: 252, align: 'left', formatter: function (value) {
                    return '<div class="grid_td-item" title="' + value + '">' + value + '</div>'
                }
            },
            { field: 'time', width: 256, align: 'right' }
        ]],
        onLoadSuccess:function () {
        }
    });
}

function renderGrid(data, dom){
    if(data.length != 0){
        $(dom).siblings('.no-data-wrapper').addClass("hidden");
        $("#meeting_category-container").removeClass("none-visible");
        $("#meeting_category-grid").datagrid('loadData', data);
    }else{
        $(dom).siblings('.no-data-wrapper').removeClass("hidden");
        $("#meeting_category-container").addClass("none-visible");
    }
}


function getTabName(){
    let activeName = $(".meeting_category_info .active .title").text();
    return { tabName : TITLE[activeName] }
}

function eventBindTitle(dom){
    let $containerDom = $(".meeting_category_info");
    $containerDom.find('.tab .header-title').on('click',function(){
        if($(this).hasClass('active')) return;
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        let { tabName } = getTabName()
        $(dom).siblings('.no-data-wrapper').find('.warm-text').text(WARNING[tabName]);
        renderGrid([], dom)

        if(mores){
            let url = mores.url[tabName]
            $containerDom.find('.header-more a.more').attr('href', url)
        }
        output.stopfetch()
        fetchState[tabName].start(({ moid, dom }) => FETCHMEETING[tabName](moid, dom))
        
    })
}


function fetchTransMeeting(moid, dom){//获取传统会议信息
    const { BASE_URL } = Store.getState()

    return $.get(BASE_URL + "/nms/getMeetings",{
        'moid':moid,
        'count':10,
        'conf_type':'tran'
    },function(t){
        var data = [];
        if(t.success){
            data = t.data.meetings;
            for (var i = 0; i < data.length; i++) {
                var startTimeDate = new Date(data[i].start_time)
                var startTimeDateStr = startTimeDate.toDateString();
                if (data[i].end_time == "") {
                    data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
                } else {
                    var endTimeDate = new Date(data[i].end_time)
                    var endTimeDateStr = endTimeDate.toDateString();

                    if (startTimeDateStr == new Date().toDateString() && startTimeDateStr == endTimeDateStr) { //当天不显示日期
                        var starthour = startTimeDate.getHours() < 10 ? '0' + startTimeDate.getHours() : startTimeDate.getHours();
                        var startminiute = startTimeDate.getMinutes() < 10 ? '0' + startTimeDate.getMinutes() : startTimeDate.getMinutes()
                        var endhour = endTimeDate.getHours() < 10 ? '0' + endTimeDate.getHours() : endTimeDate.getHours();
                        var endminiute = endTimeDate.getMinutes() < 10 ? '0' + endTimeDate.getMinutes() : endTimeDate.getMinutes()
                        data[i].time = starthour + ":" + startminiute + "-" + endhour + ":" + endminiute;
                    } else {
                        if (startTimeDateStr == endTimeDateStr) {
                            data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.split(" ")[1].slice(0, -3);
                        } else {
                            data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
                        }

                    }
                }

            }
        }
        renderGrid(data, dom)
    },'json').error(function(){
        renderGrid([], dom)
    }).complete(function() {
        fetchState['transMeeting'].loop()
    });

}

function fetchPortMeeting(moid, dom){//获取端口会议信息
    const { BASE_URL } = Store.getState()

    return $.get(BASE_URL + "/nms/getMeetings",{
        'moid':moid,
        'count':10,
        'conf_type':'port'
    },function(t){
        var data = [];
        if(t.success){
            data = t.data.meetings;
            for (var i = 0; i < data.length; i++) {
                var startTimeDate = new Date(data[i].start_time)
                var startTimeDateStr = startTimeDate.toDateString();
                if (data[i].end_time == "") {
                    data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
                } else {
                    var endTimeDate = new Date(data[i].end_time)
                    var endTimeDateStr = endTimeDate.toDateString();

                    if (startTimeDateStr == new Date().toDateString() && startTimeDateStr == endTimeDateStr) {//当天不显示日期
                        var starthour = startTimeDate.getHours() < 10 ? '0' + startTimeDate.getHours() : startTimeDate.getHours();
                        var startminiute = startTimeDate.getMinutes() < 10 ? '0' + startTimeDate.getMinutes() : startTimeDate.getMinutes()
                        var endhour = endTimeDate.getHours() < 10 ? '0' + endTimeDate.getHours() : endTimeDate.getHours();
                        var endminiute = endTimeDate.getMinutes() < 10 ? '0' + endTimeDate.getMinutes() : endTimeDate.getMinutes()
                        data[i].time = starthour + ":" + startminiute + "-" + endhour + ":" + endminiute;
                    } else {
                        if (startTimeDateStr == endTimeDateStr) {
                            data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.split(" ")[1].slice(0, -3);
                        } else {
                            data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
                        }

                    }
                }

            }
        }
        renderGrid(data, dom)
    },'json').error(function(){
        renderGrid([], dom)
    }).complete(function() {
        fetchState['portMeeting'].loop()
    });

}

function fetchP2PMeetng(moid, dom){//获取点对点会议信息
    const { BASE_URL } = Store.getState()

    return $.get(BASE_URL + "/nms/getMeetings",{
        'moid':moid,
        'count':10,
        'conf_type':'p2p'
    },function(t){
        var data = [];
        if(t.success){
            data = t.data.meetings;
            for(var i = 0; i<data.length; i++){
                data[i].name = data[i].caller_name+" 呼叫 "+data[i].callee_name;
                data[i].time = data[i].start_time.replace(new RegExp( '/' , "g" ),"-")
            }
        }
        renderGrid(data, dom)
    },'json').error(function(){
        renderGrid([], dom)
    }).complete(function() {
        fetchState['p2pMeeting'].loop()
    });
}

const output = {
    render(dom, { user }, { head_more }){
        
        $(dom).empty().append($(TemplateIndex({})).localize())
        $(dom).siblings('.no-data-wrapper').removeClass("hidden").find('.warm-text').text('暂无传统会议信息');

        mores = head_more.find(x => x.more === '更多')

        eventBindTitle(dom)

        datagridInit()
        
        const moid = user.isServiceDomainAdmin ? user.serviceDomainMoid : ( user.isUserDomainAdmin ? user.userDomainMoid : user.moid);

        fetchState['transMeeting'].cache({ moid, dom }).start(({ moid, dom }) => fetchTransMeeting(moid, dom))
        fetchState['portMeeting'].cache({ moid, dom })
        fetchState['p2pMeeting'].cache({ moid, dom })
        
    },
    startfetch(){
        fetchState['transMeeting'].start()
        fetchState['portMeeting'].start()
        fetchState['p2pMeeting'].start()
    },
    stopfetch(){
        fetchState['transMeeting'].stop()
        fetchState['portMeeting'].stop()
        fetchState['p2pMeeting'].stop()
    }
}

export default output