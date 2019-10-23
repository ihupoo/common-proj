import TemplateAbout from './about.art';

class About{
    bindEvent(){
        $(".w-close", "#aboutWrapper").on("click", () => this.hide());
    }
    show(){
        const content = TemplateAbout({ sysBrand, versionYear})
        $.dialog({
            padding: 0,
            id: "aboutWindow",
            content,
            lock: true,
            opacity: 0.50,	// 透明度
            cancel:false, // 隐藏关闭按钮
            drag: false // 不允许拖拽
        });
    }
    hide(){
        $.dialog({id: 'aboutWindow'}).close();
    }
}

export default {
    init(app){
        app.About = new About(app.options.About)
    }
}
