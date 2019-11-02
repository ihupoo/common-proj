import Store from '@/store/index';
import TemplateIndex from './index.art';
import '@/lib/artDialog/4.1.7/jquery.artDialog.min';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/styles/reset-artDialog.scss';

export default {
    show(){
        const { sysBrand , versionYear, version } = Store.getState()
        const content = $(TemplateIndex({ sysBrand, versionYear, version})).localize().prop("outerHTML")
        $.dialog({
            padding: 0,
            id: "aboutWindow",
            content ,
            lock: true,
            opacity: 0.50,	// 透明度
            cancel:false, // 隐藏关闭按钮
            drag: false // 不允许拖拽
        });
        $(".w-close", "#aboutWrapper").off('click').on("click", () => this.hide());
    },
    hide(){
        $.dialog({id: 'aboutWindow'}).close();
    }
}

