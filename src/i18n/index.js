import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import zn_CN from './zn-CN';
import en_US from './en-US';

const resources = {
    'zn-CN': {
        translation: zn_CN
    },
    'en-US':{
        translation: en_US
    }
}

i18next.init({
    lng: 'zn-CN',
    resources
},function(t){
    jqueryI18next.init(i18next,$)
})

const documentTitle = (sysBrand, lng = 'zn-CN') => page => resources[lng] ?  resources[lng].translation.home.pagebase[sysBrand][page].title : ''

export {
    i18next,
    documentTitle
}
