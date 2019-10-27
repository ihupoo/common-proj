import TemplateSystemModules from '../tpl/systemModules';
import TemplateMain from '../tpl/main';

const Home = {
    render({ user, menu }){
        TemplateSystemModules.render('.module-entry-wrapper', { user, menu })
        TemplateMain.render('main', { user, menu })


        
    }   
}

export default Home

