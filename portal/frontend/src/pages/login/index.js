import 'jqueryMigrate';

import '@/lib/ezmark/1.0/ezmark'
import '@/lib/ezmark/1.0/jquery.ezmark'

import '@/styles/common'
import '@/styles/commonCSS'

import './css/login.scss';
import './css/theme.scss';

import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import translationZn from '@/i18n/zn-CN';
import translationEn from '@/i18n/en-US';

i18next.init({
    lng:'zn-CN',
    resources:{
        'zn-CN':{
            translation: translationZn
        }
    }
}).then((t) => {
    jqueryI18next.init(i18next, $);

    $('.nav').localize()
})
