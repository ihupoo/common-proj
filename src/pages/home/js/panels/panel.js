var Panel = function(){
    this.noDataFun = null;
    this.storePanelDataFun = null;
    this.eventFun = null;
    this.refreshFun = null;
    this.refreshTime = 20000;

    this.refreshId = null;

}
Panel.prototype.initNoDataPanel= function(){//默认初始化无数据情况下的面板
    if(typeof this.noDataFun == "function"){
        this.noDataFun();
    }
}
Panel.prototype.storePanelData= function(){//初始化后台传入数据情况下的面板
    if(typeof this.storePanelDataFun == "function"){
        this.storePanelDataFun();
    }
}


Panel.prototype.stop = function(){
    if(this.refreshId!=null){
        clearInterval(this.refreshId);
        this.refreshId = null;
    }
}

Panel.prototype.refresh = function(){//每个panel绑定一个刷新函数
    if(typeof this.refreshFun == "function"){
        this.stop();
        this.refreshId = setInterval(this.refreshFun.bind(this),this.refreshTime);
    }
}
Panel.prototype.initEvent = function () {
    if(typeof this.eventFun=="function"){
        this.eventFun();
    }
}

