import TemplateIndex from './index.art';

export default {
    render(dom, params){
        $(dom).empty().append($(TemplateIndex(params)).localize())
    }
}
