import axios from 'axios'

const service = axios.create({
    baseURL: '/api',
    timeout: 115000
})

//请求拦截
service.interceptors.request.use(config => {
    config.headers['X-Token'] = 111
    return config

}, error => {
    console.log(error);
    Promise.reject(error)
})

//返回拦截
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (response.status !== 200) {
           //
            return Promise.reject('error')
        } else {
            return res
        }
    },
    error => {
        console.log(`${error}`, error.response);
        let message = "连接服务器失败!"
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    message = '请求错误(400)';
                    break;
                case 401:
                    message = '未授权，请重新登录(401)';
                    break;
                case 403:
                    message = '拒绝访问(403)';
                    break;
                case 404:
                    message = '请求出错(404)';
                    break;
                case 408:
                    message = '请求超时(408)';
                    break;
                case 500:
                    message = '服务器错误(500)';
                    break;
                case 501:
                    message = '服务未实现(501)';
                    break;
                case 502:
                    message = '网络错误(502)';
                    break;
                case 503:
                    message = '服务不可用(503)';
                    break;
                case 504:
                    message = '网络超时(504)';
                    break;
                case 505:
                    message = 'HTTP版本不受支持(505)';
                    break;
                default:
                    message = `连接出错(${error.response.status})!`;
            }
        }
       //

        return Promise.reject(error)
    }
)

export default service
