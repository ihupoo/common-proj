import axios from '@/api/axios';

export const fetchLoginInfo = () => axios.get('/login/info').catch((err) => {});
