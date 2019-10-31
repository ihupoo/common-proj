
export function getMinMaxValue(data){
    let returnData = {
        minData:0,
        maxData:0
    }
    if(data.length>0){
        data.sort(function(a,b){return a-b;});
        returnData.minData = data[0];
        returnData.maxData = data[data.length-1];
    }
    return returnData;
    
}

export function getAverageValue(data){
    let averageData = 0;
    if(data.length>0){
        averageData = Math.round(data.reduce(function (x, y) {
            return x + y;
        })/data.length);
    }
    return averageData;
}

export function echartBtnVisiable(chartDom, { startIndex, endIndex }, value){
    if(startIndex == 0){
        $(chartDom).find(".leftMove").addClass("hidden");
    }else{
        $(chartDom).find(".leftMove").removeClass("hidden");
    }
    if(endIndex == value){
        $(chartDom).find(".rightMove").addClass("hidden");
    }else{
        $(chartDom).find(".rightMove").removeClass("hidden");
    }
}

export class fetchLoop{
    ajaxId = null       //ajax 标记
    poll = true         //是否轮询
    pollTime = 20000    //轮询时间
    cacheData = null    //数据缓存
    startTime = null    //记录开始时间
    timeoutId = null    //settimeout 标记
    fetchFn =  () => {}
    
    cache(data){
        this.cacheData = data
        return this;
    }
    start(fn){
        this.startTime = new Date().getTime()
        if(fn){
            this.fetchFn = fn;
            this.ajaxId = fn(this.cacheData)
        }
    }
    reStart(fn){
        this.poll = true;
        if(fn){
            fn(this.cacheData)
        }else{
            this.ajaxId = this.fetchFn(this.cacheData)
        }
    }
    stop(fn){
        this.poll = false;
        clearTimeout(this.timeoutId)
        if(fn){
            fn(this.cacheData)
        }else{
            this.ajaxId.abort()
        }
    }
    loop(fn){
        if(this.poll){
            let time = new Date().getTime() - this.startTime
            if(time < this.pollTime ){
                clearTimeout(this.timeoutId)
                this.timeoutId = setTimeout(() => {
                    if(this.poll){
                       this.reStart(fn)
                    }
                }, this.pollTime - time)
            }else{
                this.reStart(fn)
            }
        }
    }
};
