import TemplateIndex from './index.art';




export default {
    render(dom, { eightData }){
        $(dom).empty().append($(TemplateIndex({ data: eightData })).localize())
        
    }
}
