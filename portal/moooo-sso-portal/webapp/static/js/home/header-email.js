$(function(){
    if(domainType!=='coreDomain'){
        MovisionNavNotify.init();
    }
})
window.MovisionNavNotify={
    loading: false,
    isDialogShow: false, //增加缓存，提高DOM查找性能
    notifyTypeMap:{
        "NORMAL_START_FAIL_CAUSE_OF_LACK_OF_RES": { desc: "虚拟会议室资源不足，召开失败", url: "/" },
        "NORMAL_START_FAIL_CAUSE_OF_NACK_FROM_CSS": { desc: "当前没有空闲的会议资源召开失败", url: "/" }
    },
    init: function init(options) {
        this.initEvent();
        this.nextIntegralPointAfterLoadMessage();
        //竖向
        var $notifyContent = $("#nav-sublist-notify .nav-notify-content");
        if($notifyContent){
            Portal.ScrollBar($notifyContent, {
                axis: "y"
            });
        }
    },
    initEvent:function initEvent() {
        var that = this;
        // 点击头部的消息图标
        $('.seetings #nav-notify-item').on("click",function(){
            $(".nav-sublist-list", "#nav-sublist-notify").hide();
            $(".notify-loading", "#nav-sublist-notify").find("span").text("加载中，请稍候...");
            $(".notify-loading", "#nav-sublist-notify").show();
            $("#nav-sublist-notify").show();//消息弹窗出现
            that.loadLatest();
            that.updateMeetingNotifyStateRead(); //把所有消息置为已读
            that.isDialogShow = true;
        })
        // 点击清空按钮
        $("#nav-sublist-notify .title a.clear").on("click",function () {
            if($('.nav-meeting-notify-list .notify-info-li').length){//有消息数据的条件下
                that.clearAllMeetingNotify();
            }
        })
        // 单个删除
        $("#nav-sublist-notify").on("click", ".notify-info-li .clear", function () {
            var $li = $(this).parents(".notify-info-li");
            var id = $li.attr("id");
            that.clearMeetingNotifyById(id,$li);
        });
        $(document).on('click', function (e) {
            // 先判缓存，再查找DOM
            if (that.isDialogShow && !$(e.target).hasClass("clear-notify") && $(e.target).closest(".nav-notify-item").length == 0
                && $(e.target).closest(".nav-sublist-notify").length == 0) {
                $("#nav-sublist-notify").hide();//消息弹窗消息
                that.isDialogShow = false;
            }
        });
    },
    // 定时刷新
    nextIntegralPointAfterLoadMessage: function nextIntegralPointAfterLoadMessage() {
        var that = MovisionNavNotify;
        that.setTimeoutToloadMessage();
        that.load(true);
    },
    // 定时器
    setTimeoutToloadMessage: function setTimeoutToloadMessage() {
        var that = MovisionNavNotify;
        var date = new Date(); //现在时刻
        var dateIntegralPoint = new Date(); //用户登录时刻的下一个整点，也可以设置成某一个固定时刻
        dateIntegralPoint.setMinutes(date.getMinutes() + 15 - date.getMinutes() % 15);
        dateIntegralPoint.setSeconds(10); //延迟10秒钟获取
        setTimeout(that.nextIntegralPointAfterLoadMessage, dateIntegralPoint - date);
    },
    loadLatest: function loadLatest() {
        // 不需要显示红点点
        this.load(false);
    },
    load: function load(needSetNewlog) {
        // needSetNewlog 如果是刚进来，或者定时拉取，需要设置新消息红点点
        var that = this;
        if (that.loading) return;
        that.loading = true;
        var url = this.getSystemURL("webnotify/getAllMeetingNotify");
        $.get(url, function (t, type) {
            if (t.success) {
                var data = t.data;
                that.loading = false;
                needSetNewlog ? that.setNewLog(data.hasNew) : that.setNewLog(needSetNewlog);
                that.renderNotifyList(data.notifyVOs);
            } else {
                that.setNewLog(false);
                that.renderNotifyList([]);
            }
            that.loading = false;
        }, 'json').error(function () {
            that.setNewLog(false);
            that.loading = false;
        });
    },
    // 给头部的消息按钮设置红点点
    setNewLog: function setNewLog(hasNew) {
        var notifyDom = $("#nav-notify-item");//头部的消息按钮
        hasNew ? notifyDom.addClass("has-new") : notifyDom.removeClass("has-new");
    },
    //渲染消息
    renderNotifyList: function renderNotifyList(notifyVOs) {
        var $notifyLoading = $("#nav-sublist-notify  .notify-loading");
        if(notifyVOs && notifyVOs.length){//有数据
            var that = this;
            var $notifyContent = $("#nav-sublist-notify .nav-notify-content");
            var $ul = $(".nav-sublist-list", $notifyContent).empty().show();
            that.appentHtmlToList(notifyVOs,$ul);//页面中插入节点
            $notifyLoading.hide();
        }else{
            $notifyLoading.show();
            $notifyLoading.find("span").text("暂无消息");
            return false;
        }
    },
    // 遍历数据，生成模板，插入页面
    appentHtmlToList: function appentHtmlToList(notifyVOs,$ul) {
        var $arrTemp = [];
        var oFrag=document.createDocumentFragment();
        for(var i=0;i<notifyVOs.length;i++){
            var op=document.createElement("li");
            op.setAttribute("class","notify-info-li");
            op.setAttribute("id",notifyVOs[i].id);
            var childElema=document.createElement("a");
            childElema.setAttribute("class","warning");
            var childElemDiv=document.createElement("div");
            childElemDiv.setAttribute("class","notify-info");
            var childElemDivSpan=document.createElement("span");
            childElemDivSpan.setAttribute("class","notify-type");
            childElemDivSpan.setAttribute("title",this.notifyTypeMap[notifyVOs[i].notifyType].desc);
            var childElemDivSpanoText=document.createTextNode(this.notifyTypeMap[notifyVOs[i].notifyType].desc);
            childElemDivSpan.appendChild(childElemDivSpanoText);
            var childElemDiva=document.createElement("a");
            childElemDiva.setAttribute("class","notify-subject");
            childElemDiva.setAttribute("href",'/meeting/meeting/detail/' + notifyVOs[i].meetingId);
            childElemDiva.setAttribute("title",notifyVOs[i].meetingName);
            var childElemDivaoText=document.createTextNode(notifyVOs[i].meetingName);
            childElemDiva.appendChild(childElemDivaoText);
            childElemDiv.appendChild(childElemDivSpan);
            childElemDiv.appendChild(childElemDiva);
            var childElemS=document.createElement("s");
            childElemS.setAttribute("class","clear clear-notify");
            childElemS.setAttribute("title", '删除消息');
            op.appendChild(childElema);
            op.appendChild(childElemDiv);
            op.appendChild(childElemS);
            $arrTemp.push(op)
            oFrag.appendChild(op)
        }
        // 如果消息过多 先保证页面上出现
        if($arrTemp.length>200){
            var t1 = $arrTemp.slice(0,199);
            var t2 = $arrTemp.slice(199,$arrTemp.length);
            $ul.append(t1)//先把部分填充到列表之中
            setTimeout(function(){$ul.append(t2)},0)
        }else{
            $ul.append(oFrag)
        }
    },
    // 变成消息已读
    updateMeetingNotifyStateRead: function updateMeetingNotifyStateRead() {
        var that = this;
        var url = this.getSystemURL("webnotify/updateMeetingNotifyStateRead");
            $.get(url, function (t) {
            if (t.success) {}
        }, 'json');
    },
    // 清空所有消息
    clearAllMeetingNotify: function clearAllMeetingNotify() {
        var that = this;
        var url = this.getSystemURL("webnotify/clearAllMeetingNotify");
        $.get(url, function (t) {
            if (t.success) {
                that.setNotifyListEmpty();//清空dom节点
                that.setNotifyListState();//显示暂无消息状态
            }
        }, 'json');
    },
    // 单个删除
    clearMeetingNotifyById: function clearMeetingNotifyById(id,$li) {
        var that = this;
        var url = this.getSystemURL("webnotify/clearMeetingNotifyById");
        $.get(url, { id: id }, function (t) {
            if (t.success) {
                $li.remove()
                that.setNotifyListState();
            }
        }, 'json');
    },
    // 列表dom结构清空
    setNotifyListEmpty: function setNotifyListEmpty() {
        var $notifyContent = $("#nav-sublist-notify .nav-notify-content");
        var $ul = $(".nav-sublist-list", $notifyContent).empty();
    },
    // 更新列表是否 暂无数据的提示状态
    setNotifyListState: function setNotifyListState() {
        var $notifyContent = $("#nav-sublist-notify .nav-notify-content");
        var $notifyLoading = $("#nav-sublist-notify  .notify-loading");
        var $ul = $(".nav-sublist-list", $notifyContent);
        if ($ul.find("li.notify-info-li").length == 0) {
            $notifyLoading.find("span").text("暂无消息");
            $notifyLoading.show();
        }
    },
    // 获取url
    getSystemURL: function getSystemURL(url) {
        return "/service/" + url;
    },
}