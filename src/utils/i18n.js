import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import translationZn from '@/i18n/zn-CN';
import translationEn from '@/i18n/en-US';

let i18nUtil = function (templateName, templateData, appendStyle) {
    i18next.init({
        lng: 'zn-CN',
        resources: {
            'zn-CN': {
                translation: translationZn
            }
        }
    }).then((t) => {
        jqueryI18next.init(i18next, $);
        $('#login_form').localize();
        const templateHtml = templateName(templateData);
        $(templateHtml).localize().appendTo(appendStyle);
    })
}

let i18nLoginTitle = function (sysBrand) {
    i18next.init({
        lng: 'zn-CN',
        resources: {
            'zn-CN': {
                translation: translationZn
            }
        }
    }).then((t) => {
        $('#login_form').localize();
        document.title = translationZn.home.pagebase[sysBrand].login.title
    })
}

let i18nHomeTitle = function (sysBrand) {
    i18next.init({
        lng: 'zn-CN',
        resources: {
            'zn-CN': {
                translation: translationZn
            }
        }
    }).then((t) => {
        document.title = translationZn.home.pagebase[sysBrand].home.title
    })
}

export { i18nUtil, i18nLoginTitle, i18nHomeTitle }
