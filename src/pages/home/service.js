import axios from '@/api/axios';

export const fetchHomeInfo = () => axios.get('/userHome').catch((err) => {});
