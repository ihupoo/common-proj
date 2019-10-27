import $ from 'jquery-migrate';

import '@/styles/reset.scss';

import '@/lib/ezmark/ezmark.scss';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/lib/imgareaselect/imgareaselect-default.css';
import '@/lib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.css';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
import '@/styles/reset-artDialog.scss';
import '@/styles/reset-mCustomScrollbar.scss';
import '@/styles/reset-easyui.scss';


import './css/boot.scss';
import './css/home.scss';
import './css/theme.scss';
import '@/lib/portal/mo-portal.css';


import '@/lib/artDialog/4.1.7/jquery.artDialog.min';
// import 'jquery-easyui-original';
import '@/lib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar';
import 'ezmark'
// import '@/lib/imgareaselect/jquery.imgareaselect.pack'

//todo
{/* <script src="${RESOUCE_STATIC_URL}/js/jlib/echarts.min.js?t=6.0.2692493846"></script>
<script src="${RESOUCE_STATIC_URL}/js/jlib/components/mo-portal.min.js?t=6.0.2184442885"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/controller.js?t=6.0.133564478"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/events.js?t=6.0.909632798"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/event.js?t=6.0.1442163845"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/initTemplate.js?t=6.0.2490832047"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/drawGraph.js?t=6.0.3537542513"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/panel.js?t=6.0.3363915707"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/meetingCountPanel.js?t=6.0.2733153060"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/platformResourcePanel.js?t=6.0.1086334492"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/meetingCalendarPanel.js?t=6.0.3659021699"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/header-email.js?t=6.0.3480032774"></script> */}


import Store from '@/store/index';
import { setBaseUrl, AjaxComplete } from '@/utils/common';
import { fetchSystemConfig, fetchUserInfo } from '@/api/service';
import { fetchHomeMenu } from './service';

import { i18next, documentTitle } from '@/i18n';
import TemplateHeader from '@/components/tpl/header';



// function pageRender({ sysBrand, lang = 'zn-CN', versionYear = '2019' } = {}) {
//     $('body').addClass(`theme-${sysBrand}`);

//     i18next.changeLanguage(lang)
//     TemplateHeader.init('.sys-info-wrapper', data)
//     document.title = documentTitle(sysBrand)('home')
// }

// setBaseUrl()

// $(function () {
//     const config = localStorage.getItem('system_config') || {}
//     Store.dispatch({
//         type: 'save',
//         payload: {
//             ...config
//         }
//     })
//     const { sysBrand, lang, versionYear, BASE_URL } = Store.getState()



//     pageRender({ sysBrand, lang, versionYear, BASE_URL, user, cloudModelList })
    
    
//     AjaxComplete()
// })
