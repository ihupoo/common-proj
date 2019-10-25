import TemplateSystemModules from '../tpl/systemModules';

const Home = {
    render({ user, menu }){
        $('.module-entry-wrapper').empty().append(TemplateSystemModules({ user, menu }))
        
        $('#row').empty().append()

    }   
}

export default Home

