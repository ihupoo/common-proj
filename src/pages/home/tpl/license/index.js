
import TemplateIndex from './index.art';




export default {
    render(dom, { user, menu }){
        $(dom).empty().append($(TemplateIndex({  })).localize())
        eventBind()
    }
}
