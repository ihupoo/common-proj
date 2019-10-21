import axios from '@/api/axios';

export const fetchSystemConfig = () => axios.get('/config').catch((err) => {});

export const fetchLoginInfo = () => axios.get('/login/getlogin').catch((err) => {});
