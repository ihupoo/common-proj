import $ from 'jquery-migrate';
import 'jquery-namespace';

import '@/lib/ezmark/1.0/ezmark'
import '@/lib/ezmark/1.0/jquery.ezmark'

import '@/styles/common.scss'
import '@/styles/commonCSS.scss'

import './css/login.scss';
import './css/theme.scss';

import '@/utils/utils'
import './js/_tmp_globalUrl'
import '@/utils/common'

import '@/utils/sm';
import '@/utils/md5';
import '@/utils/digestAuth';//todo

import './js/login';



// import i18next from 'i18next';
// import jqueryI18next from 'jquery-i18next';
// import translationZn from '@/i18n/zn-CN';
// import translationEn from '@/i18n/en-US';

// i18next.init({
//     lng: 'zn-CN',
//     resources: {
//         'zn-CN': {
//             translation: translationZn
//         }
//     }
// }).then((t) => {
//     jqueryI18next.init(i18next, $);

//     $('<div class="nav"><span data-i18n="home.user.modify.title"></span></div>').localize().appendTo('body')
// })
