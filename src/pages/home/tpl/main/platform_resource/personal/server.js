import Store from '@/store';
import { MoAlert } from '@/components/popup';

export function processMoidList(servers) {
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

 /*保存用户自定义服务器列表*/
export function fetchSavePersonalList(servers) {
    return new Promise(function(resolve, reject){
        const { BASE_URL } = Store.getState()

        $.post( BASE_URL + "/custom/personalPhysicalServer", {type: 'CPU', servers: servers}, function (t) {
            if (t.success) {
                let moidList = processMoidList(servers);
                resolve(moidList)
            }
        }, 'json').error(function () {

        });
    })
    
}


/*自定义服务器配置*/
export function fetchPersonalSettingClick() {

    return new Promise(function(resolve, reject){
        const { BASE_URL } = Store.getState()

        let value = $(".isPersonalSetting").hasClass("no-checked") ? '0' : '1';

        $.post(BASE_URL + "/custom/personalSetting", {type: 'showCustomCpuIndex', value }, function (t) {
            if (t.success) {
                resolve()
            } else {
                $(".isPersonalSetting").toggleClass("no-checked");
                MoAlert('显示自定义服务器失败');
                reject()
            }
        }, 'json').error(function () {
            $(".isPersonalSetting").toggleClass("no-checked");
            MoAlert('显示自定义服务器失败');
            reject()
        });
    })

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
