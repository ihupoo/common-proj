import axios from '@/api/axios';

export const fetchHomeInfo = () => axios.get('/userHome').catch((err) => {});
// export const fetchHomeInfo = () => axios.get('/home/menu').catch((err) => {});
