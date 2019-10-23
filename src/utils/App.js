class App{
    static modules = []
    
    constructor(options) {
        this.options = options;
        this.init();
    }

    init() {
        let _this = this
        $(function(){
            _this.initModules();
            _this.options.onReady(_this);
        })
    }
    static use(module) {
        Array.isArray(module) ? module.forEach(item => App.use(item)) : App.modules.push(module);
    }
    initModules() {
        App.modules.forEach(module => module.init && typeof module.init == 'function' && module.init(this));
    }
}
