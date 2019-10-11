<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <%@ include file="/inc/page_common_head.jsp" %>
    <%@ include file="/inc/page_base_nav_menu_pop.jsp"%>

    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/js/jlib/easyui/1.8.5/themes/default/easyui.css?t=6.0.389291012"/>
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/reset-easyui.css?t=6.0.1503837568"/>
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/home.css?t=6.0.2615990444" />

    <title>直播列表</title>

    <style>
        html,body,.wrap{
            height: 100%;
            width: 100%;
        }
        #header, .inner-main-content{
            padding: 0 67px;
        }
        .head-nav-bg-temp,#header{
            height: 54px;
        }
        .header-logo{
            margin-top: 18px;
        }
        .company-header-title {
            margin-top: 21px;
        }
        .mo-icons-bg {
            background: url("${RESOUCE_STATIC_URL}/images/home/home_img.png?t=6.0.353982950");
        }
        .slash {
            display: inline-block;
            margin-top: 18px;
            margin-left: 6px;
            float: left;
            background-position: 0 -25px;
        }
        .public-private-cloud-content{
            display: none;
        }
        .hd-main .info,.inner-main-content{
            margin-top: 17px;
        }
        .inner-main-content {
            height: calc(100% - 85px);
        }
        .tree-wrapper,.video-wrapper {
            height: 100%;
        }
        .tree-wrapper{
            width: 219px;
            float: left;
            border-right: #939698 1px solid;
        }
        .wrapper-header{
            color: #4E4E4E;
            font-size: 14px;
            margin-bottom: 14px;
        }
        .tree-body{
            padding: 6px 4px;
        }
        .video-wrapper{
            float: right;
            width: calc(100% - 250px);
        }
        .search-wrapper {
            bottom: 6px;
        }
        #video-search {
            float: right;
        }
        .vrs-live-container {
            margin-left: -43px;
        }
        .comm_video{
            width: 164px;
            position: relative;
            display: inline-block;
            margin-left: 43px;
        }
        .comm_video .mo-icons-bg{
            background-position: -174px -437px;
            width: 164px;
            height: 92px;
        }
        .mo-icons-bg.comm_video_img{
            width: 164px;
            height: 92px;
            background-position: 0 -437px;
        }
        .mo-icons-bg.comm_video_img_btn{
            display: none;
            width: 164px;
            height: 92px;
            background-position: -348px -437px;
            position: absolute;
            top: 0;
            left: 0;
        }
        .comm_video_time{
            font-size: 12px;
            color: #aeaeae;
            float: left;
        }
        .mo-icons-bg.comm_video_viewImg{
            background-position: 0 -539px;
            width: 17px;
            height: 17px;
            float: right;
        }
        .video-encrypt-icon{
            position: absolute;
            width: 164px;
            height: 92px;
        }
        .mo-icons-bg.appointment.gm-icon{
            position: absolute;
            width:18px;
            height:18px;
            background-position:0px -967px;
            bottom: 4px;
            right: 64px;
        }
        .mo-icons-bg.appointment.aes-icon{
            position: absolute;
            width:18px;
            height:18px;
            background-position:-28px -967px;
            bottom: 4px;
            right: 64px;
            cursor:default;
        }
        .mo-icons-bg.gm-icon{
            position: absolute;
            width:18px;
            height:18px;
            background-position:0px -967px;
            bottom: 4px;
            right: 5px;
            cursor:default;
        }
        .mo-icons-bg.aes-icon{
            position: absolute;
            width:18px;
            height:18px;
            background-position:-28px -967px;
            bottom: 4px;
            right: 5px;
        }
        .comm_video_num{
            float: right;
            font-size: 12px;
            color: #aeaeae;
            margin-left: 4px;
        }
        .comm_video_title{
            clear: both;
            line-height: 17px;
            font-size: 14px;
            color: #4e4e4e;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            width: 162px;
            min-height: 34px;
        }
        .domain-name{
            color: #4e4e4e;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .divider{
            border-bottom: #D4D4D4 1px dashed;
            margin: 2px 0 30px 0;
        }
        .no-data-wrapper{
            text-align: center;
        }
        .no-data{
            height: 22px;
            line-height: 22px;
            display: inline-block;
            margin-bottom: 20px;
        }
        .mo-icons-bg.warm-icon {
            width: 22px;
            background-position: -31px -649px;
            margin-right: 10px;
        }
        .warm-icon, .warm-text {
            display: inline-block;
            height: 22px;
            float: left;
        }
        .warm-text {
            color: #b6b6b6;
        }
    </style>
</head>
<body>
    <div class="wrap">
        <%@ include file="/inc/page_head_nav.jsp"%>
        <div id="inner-main-content" class="inner-main-content">
            <div class="tree-wrapper">
                <div class="wrapper-header">
                    <div id="tree-search" class="search-wrapper mo-simple-search">
                        <input class="mo-simple-search-input" mo-hint="请输入用户域名称搜索" maxlength="60"/><a class="mo-simple-search-icon"></a>
                    </div>
                </div>
                <div class="tree-body">
                    <ul id="tree"></ul>
                </div>
            </div>
            <div class="video-wrapper">
                <div class="wrapper-header">
                    <span id="live-type-title">直播列表</span>
                    <div id="video-search" class="search-wrapper mo-simple-search">
                        <input class="mo-simple-search-input " mo-hint="搜索" maxlength="60"/><a class="mo-simple-search-icon"></a>
                    </div>
                </div>
                <div id="live-room"></div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>

    <script id="VRS-live-rooms" type="text/html">
        {{if domain.length > 0}}
        {{each domain as domaindata i}}
        <div class="domain-name">{{domaindata.domainname}} ({{domaindata.count}})</div>
        {{if domaindata.roomstate.length > 0}}
        <div class="vrs-live-container">
            {{each domaindata.roomstate as roomdata i}}
            <div class="comm_video">
                <div class="{{if type=='live'}}comm_video_img{{else}}comm_video_forthcomImg{{/if}} mo-icons-bg">
                    {{if type=='live'}}<a class="comm_video_img_btn mo-icons-bg"></a>{{/if}}
                    <div class="video-encrypt-icon">
                        <a class="mo-icons-bg {{if type=='appointment'}}appointment{{/if}} {{if roomdata.encmode==2}} aes-icon {{else}}{{if roomdata.encmode==4}} gm-icon {{/if}}{{/if}}"></a>
                    </div>
                </div>
                <ul>
                    {{if type=='live'}}
                    <li class="comm_video_time">{{roomdata.elapse | formatTime '00:00:00'}}</li>
                    <li class="comm_video_num">{{roomdata.livestatnum | formatNum}}</li>
                    <li class="comm_video_viewImg mo-icons-bg"></li>
                    {{else}}
                    <li class="comm_video_time">{{roomdata.livetime}}</li>
                    {{/if}}
                </ul>
                <div class="comm_video_title" title="{{roomdata.roomname}}">{{roomdata.roomname}}</div>
            </div>
            {{/each}}
        </div>
        {{else if domaindata.roomstate.length <= 0}}
        <div class="no-data-wrapper">
            <div class="no-data">
                <span class="mo-icons-bg warm-icon"></span>
                <span class="warm-text">暂无直播</span>
            </div>
        </div>
        {{/if}}
        {{if domain.length-1 != i}}
        <div class="divider"></div>
        {{/if}}
        {{/each}}
        {{else if domain.length <= 0}}
        <div class="no-data-wrapper">
            <div class="no-data">
                <span class="mo-icons-bg warm-icon"></span>
                <span class="warm-text">暂无直播</span>
            </div>
        </div>
        {{/if}}
    </script>

    <script type="text/javascript">
        var serviceDomainMoid = '${currentuser.serviceDomainMoid}';
        var type = getUrlParam('type');

        function initTree(search){
            var selected = 0; //自动选择
            var manuelSelected = -1; //手动选择

            var tree = $("#tree");
            tree.tree({
                animate: true,
                cascadeCheck: false,
                url : Mo.Config.appUrl + '/nms/getAllLiveRooms?type='+type+'&moid='+ serviceDomainMoid,
                method: "GET",
                formatter: function(node){
                    //在名称后拼接直播数
                    node.text += '<span> ('+node.attributes.count+')</span>';
                    return node.text;
                },
                loadFilter: function(data){
                    if(!data.success){
                        return '';
                    }
                    data = data.data;
                    var node = [];
                    var totalCount = 0;
                    var childrenNodes = [];
                    var dataSize = 0;
                    var elapse = 0;
                    if(type === 'live'){
                        elapse = Infinity;
                    }
                    for(var moid in data){
                        var userDomain = data[moid];
                        var userDomainName = userDomain[0];
                        if(!!search) {//如果是搜索
                            if(userDomainName.indexOf(search) === -1){
                                continue;
                            }
                        }
                        dataSize += 1;
                        var userDomainElapse = userDomain[1];
                        var roomList = userDomain[2];
                        var roomListLength = roomList.length;
                        totalCount += roomListLength; //统计直播室总数
                        if(type === 'live'){
                            if(userDomainElapse < elapse){
                                elapse = userDomainElapse;
                                selected = dataSize; //初始选中最小
                            }
                        }else{
                            var stamp = Date.parse(userDomainElapse.replace(/-/g,'/')); //兼容IE9
                            if(stamp > elapse){
                                elapse = stamp;
                                selected = dataSize; //初始选中最小
                            }
                        }
                        childrenNodes.push({
                            id: dataSize,
                            checked: false,
                            text: userDomainName,
                            iconCls: 'icon-empty',
                            attributes: {
                                moid: moid,
                                name: userDomainName,
                                count: roomListLength,
                                roomlist: roomList
                            }
                        });
                    }
                    if(dataSize >= 0){
                        node.push({
                            id: 0,
                            text: '全部',
                            iconCls: 'icon-empty',
                            attributes: {
                                moid:serviceDomainMoid,
                                count:totalCount
                            },
                            children:childrenNodes
                        });
                    }
                    return node;
                },
                onBeforeLoad: function(node,param){
                    Mo.loadMask.show();
                },
                onLoadSuccess: function(node, data) {
                    if(data.length > 0){
                        var selectedNode = {};
                        if(manuelSelected < 0){ //未指定则默认选中自动选择的节点
                            selectedNode = tree.tree('find',selected);
                        }else{
                            selectedNode = tree.tree('find',manuelSelected);
                        }
                        tree.tree('select',selectedNode.target);
                        // 加载最近的直播所在用户域
                        liveRoom.setLiveRoomData(selectedNode);
                        liveRoom.renderLiveRoomList();
                    }else{
                        alert('数据错误');
                    }
                    Mo.loadMask.hide();
                },
                onClick: function(node) {
                    manuelSelected = node.id; //设置指定节点
                    tree.tree('reload');
                }
            });
        }

        var liveRoom = {
            liveRoomData: {domain:[]},
            zeroBefore: function(number) {
                if (number < 10) {
                    return '0' + number;
                }
                return number;
            },
            initTemplate: function(){
                template.defaults.imports.formatTime = function(param,timeStr){
                    param = Math.round(param);
                    if (param < 0) {
                        return null;
                    }
                    if (param < 60) {
                        param = liveRoom.zeroBefore(param);
                        timeStr = '00:00:' + param;
                    } else if (param >= 60 && param < 3600) {
                        var min = liveRoom.zeroBefore(Math.floor(param / 60));
                        var secons = liveRoom.zeroBefore(param % 60);
                        timeStr = '00:' + min + ':' + secons;
                    } else {
                        var hour = liveRoom.zeroBefore(Math.floor(param / 3600));
                        var timeData = param % 3600;
                        var min = liveRoom.zeroBefore(Math.floor(timeData / 60));
                        var secons = liveRoom.zeroBefore(timeData % 60);
                        timeStr = hour + ':' + min + ':' + secons;
                    }
                    return timeStr;
                };
                template.defaults.imports.formatNum = function(num){
                    var result = '', counter = 0;
                    num = (num || 0).toString();
                    for (var i = num.length - 1; i >= 0; i--) {
                        counter++;
                        result = num.charAt(i) + result;
                        if (!(counter % 3) && i !== 0) { result = ',' + result; }
                    }
                    return result;
                };
                template.defaults.imports.formatPath = function(path){
                    return '//'+vrsIp + path;
                }
            },
            setLiveRoomData: function(node) {
                if(node.id === 0){
                    var domain = [];
                    for(var i=0;i<node.children.length;i++){
                        domain.push({
                            domainname: node.children[i].attributes.name,
                            count: node.children[i].attributes.count,
                            roomstate: node.children[i].attributes.roomlist
                        });
                    }
                    this.liveRoomData.domain = domain;
                }else{
                    this.liveRoomData.domain = [{
                            domainname: node.attributes.name,
                            count: node.attributes.count,
                            roomstate: node.attributes.roomlist
                        }];
                }
            },
            renderLiveRoomList: function(filter){
                var data = {};
                if(!!filter){
                    data = filter;
                }else{
                    data = this.liveRoomData;
                }
                data.type = type;
                var liveHtml = template('VRS-live-rooms',data);
                var liveRoom = $('#live-room');
                liveRoom.empty();
                liveRoom.append(liveHtml);
            }
        };

        function searchLiveRoom(name){
            var searchTemp = $.extend(true,{},liveRoom.liveRoomData);
            for(var i=0;i<searchTemp.domain.length;i++){
                searchTemp.domain[i].roomstate = $.grep(searchTemp.domain[i].roomstate,function(e){
                    return e.roomname.indexOf(name) !== -1;
                });
            }
            liveRoom.renderLiveRoomList(searchTemp);
        }

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r != null){
                return  r[2];
            }
            return null;
        }

        //标题名称
        var liveTypeTitle = $('#live-type-title');
        if(type === 'live'){
            liveTypeTitle.html('正在直播');
        }else if(type === 'appointment'){
            liveTypeTitle.html('即将直播');
        }
        //直播间搜索
        $('#video-search').keydown(function(e){
            if(e.keyCode === 13){
                searchLiveRoom($(this).find('.mo-simple-search-input').val().trim());
            }
        });
        $('#video-search .mo-simple-search-icon').click(function(){
                var name = $(this).prev().val().trim();
                if(name === '搜索'){
                    name = '';
                }
                searchLiveRoom(name);
            }
        );
        //用户域搜索
        $('#tree-search').keydown(function(e){
            if(e.keyCode === 13){
                initTree($(this).find('.mo-simple-search-input').val().trim());
            }
        });
        $('#tree-search .mo-simple-search-icon').click(function(){
                var name = $(this).prev().val().trim();
                if(name === '请输入用户域名称搜索'){
                    name = '';
                }
                initTree(name);
            }
        );

        $(function(){
            var portrait = '${currentuser.portrait40}';
            var portraitDomain = '${portraitDomain}';
            SSO.common.setDefaultImg('.user-info');
            SSO.common.initPortrait(portrait, portraitDomain);
            SSO.common.headerEvent();
            $('#help').attr('href','${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html');
            Mo.common.aboutInit(Mo.CompanyInfo);
            Mo.common.homeInit(Mo.CompanyInfo);

            Mo.SimpleSearch.init('#tree-search',190);
            Mo.SimpleSearch.init('#video-search',190);

            liveRoom.initTemplate();
            initTree();

            $('.tree-wrapper,.video-wrapper').mCustomScrollbar({
                axis: "yx"
            });
        });
    </script>

</body>
</html>
