import Store from '@/store/index';
import TemplateIndex from './index.art';

export default ({ user, cloudModelList }) => {
    const { BASE_URL , sysBrand } = Store.getState()
    return TemplateIndex({
        BASE_URL,
        sysBrand,
        user,
        cloudModelList
    })
}
