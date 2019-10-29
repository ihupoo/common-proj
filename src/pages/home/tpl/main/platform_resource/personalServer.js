import Store from '@/store';

function processMoidList(servers) {
    let serverDefaultNum = 5, moidList =[];
    let mList = servers.split(",");
    if (mList.length > 0) {
        for (let i = 0; i < mList.length; i = i + serverDefaultNum) {
            if (i + serverDefaultNum < mList.length) {
                let temp = mList.slice(i, i + serverDefaultNum);
                moidList.push(temp.join(","))
            } else {
                let temp = mList.slice(i, mList.length);
                moidList.push(temp.join(","));
            }
        }
    }
    return moidList;

}

 /*查询用户自定义服务器列表*/
 function fetchPersonalPhysicalServer(){ 

    return new Promise(function(resolve, reject){
        const { BASE_URL } = Store.getState()

        $.get(BASE_URL + "/custom/personalPhysicalServer", {type: 'CPU'}, function (t) {
            if (t.success) {
                resolve(t.data)
            }
        }, 'json').error(function () {
            reject()
        });
    })
    
}

/*查询是否是开启自定义服务器设置*/
function fetchPersonalSetting() {

    return new Promise(function(resolve, reject){
        const { BASE_URL } = Store.getState()

        $.get(BASE_URL+ "/custom/personalSetting", {type: 'CPU'}, function (t) {
            if (t.success) {
                resolve(t.data)
            }
        }, 'json').error(function () {
            reject()
        });
    })
}

export async function fetchPersonal(){
    try{
        const [ { showCustomCpuIndex }, serverList ] = await Promise.all([
            fetchPersonalSetting(),
            fetchPersonalPhysicalServer()
        ])
        if(showCustomCpuIndex === 1){//开启
            $(".isPersonalSetting").removeClass("no-checked");
        }
    
        let moidList = processMoidList(serverList.join(","));
    
        return moidList
    }catch(e){
        return []
    }

}
