import runtime from 'art-template/lib/runtime';

function zeroBefore(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}

runtime.formatTime = function(param,timeStr){
    param = Math.round(param);
    if (param < 0) {
        return null;
    }
    if (param < 60) {
        param = zeroBefore(param);
        timeStr = "00:00:" + param;
    } else if (param >= 60 && param < 3600) {
        var min = zeroBefore(Math.floor(param / 60));
        var secons = zeroBefore(param % 60);
        timeStr = "00:" + min + ":" + secons;
    } else {
        var hour = zeroBefore(Math.floor(param / 3600));
        var timeData = param % 3600
        var min = zeroBefore(Math.floor(timeData / 60));
        var secons = zeroBefore(timeData % 60);
        timeStr = hour + ":" + min + ":" + secons;
    }
    return timeStr;
}

runtime.formatNum = function(num){
    var result = '', counter = 0;
    num = (num || 0).toString();
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result = num.charAt(i) + result;
        if (!(counter % 3) && i != 0) { result = ',' + result; }
    }
    return result;
}

export default runtime
