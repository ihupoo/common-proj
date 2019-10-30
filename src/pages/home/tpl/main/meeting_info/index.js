import Store from '@/store';
import TemplateIndex from './index.art';
import '@/lib/artDialog/4.1.7/jquery.artDialog.min';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/styles/reset-artDialog.scss';




export default {
    render(dom, { user }){
        $(dom).empty().append($(TemplateIndex({})).localize())
        $(dom).siblings('.no-data-wrapper').removeClass("hidden").find('.warm-text').text('今日无会议安排，点击“创建会议”开始创会吧。');
        
        datagridInit()
        
        const moid = user.isServiceDomainAdmin ? user.serviceDomainMoid : ( user.isUserDomainAdmin ? user.userDomainMoid : user.moid);

        fetchState.cache({ moid, dom }).start(({ moid, dom }) => fetchLoad(moid, dom))
        
    },
    startfetch(){
        fetchState.reStart()
    },
    stopfetch(){
        fetchState.stop()
    }
}
