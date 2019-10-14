/** 
 * 本js为临时js，使用地方为 请求路径
 * 
 * 以下内容都将最后整合入 store ，请求后续看时间是否统一整合入 axios
 * 
 **/ 

// import 'jquery-namespace';

const BASE_URL = window.location.pathname.split('/')[1];
if(BASE_URL !== 'portal' && BASE_URL !== 'portalCore'){
    // throw new Error('路径错误')   //todo，跳转404
}

$.namespace("BP.config");
BP.config = {
    SYSTEM_URL: `/${BASE_URL}`,
};
$.namespace("Mo.Config");
Mo.Config = {
    appUrl: `/${BASE_URL}`,
};
