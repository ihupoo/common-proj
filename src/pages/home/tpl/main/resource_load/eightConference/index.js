import TemplateIndex from './index.art';
import echarts from 'echarts'
import { echartOption, percentCount } from '@/pages/home/tpl/draw';

const echartsOpt = {
    data:[
        {value:'',name:''},
        {value:'',name:''}
    ],
    color:['#1e94da','#d0d0d0'],
    animationAttr:true
}

function echartRender(data){
    for(let i = 0; i < data.length; i++){
        let item = data[i]

        let usedPersent = percentCount(item.used,item.total);

        let opt = $.extend(true, {}, echartsOpt);
        opt.data[0].value = item.used;
        opt.data[1].value = item.total == 0 ? 1 : item.total - item.used;
        opt.data[0].name= `${usedPersent}%`

        //先绘制灰色图-未使用的图
        opt.color = ['transparent','#d0d0d0'];
        opt.animationAttr = false;

        let grayPieChartOption = echartOption.getPieOption(opt);
        echarts.init(document.getElementById(item.id + "_gray"),"").setOption(grayPieChartOption)

        //再绘制已使用的图
        opt.color = usedPersent >= 85 ? ['#db4c4c','transparent'] :  ['#1e94da','transparent']
        opt.animationAttr = true;

        let pieChartOption = echartOption.getPieOption(opt);
        echarts.init(document.getElementById(item.id), "").setOption(pieChartOption);
    }
}


export default {
    render(dom, { data }){
        $(dom).empty().append($(TemplateIndex({ data })).localize())
        echartRender(data)
    }
}
