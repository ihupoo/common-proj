import '@/lib/portal'
import Store from '@/store';
import TemplateIndex from './index.art';


export default {
    render({ days }){
        const content = $(TemplateIndex({ days })).localize().prop("outerHTML")

        let licenseWarnCheckbox = Portal.Checkbox('#license-warn-checkbox', {
            name: 'licenseWarnCheckbox',
            data: {
                id: "licenseWarnCheckbox",
                name: "今日不再提醒",
                value: "0"
            }
        });
        Portal.Dialog({
            id: 'licenseWarn',
            content,
            okBtn: false,
            cancelText: '关闭',
            cancelFn: function () {
                if (licenseWarnCheckbox.getValue()) {
                    $.post(Store.getState('BASE_URL') + '/saveLicenseWarnStatus', function () { }, 'json');
                }
            },
        });
    }
}
