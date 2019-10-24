import TemplateIndex from './index.art';

const About = {
    show(){
        const content = TemplateIndex({ sysBrand, versionYear})
        $.dialog({
            padding: 0,
            id: "aboutWindow",
            content,
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

export default About
