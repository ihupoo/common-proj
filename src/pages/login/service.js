import axios from '@/api/axios';

export const fetchLoginInfo = () => axios.get('/loginParams').catch((err) => {});
