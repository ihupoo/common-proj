import axios from '@/api/axios';

export const fetchSystemConfig = () => axios.get('/config').catch((err) => {});

export const fetchUserInfo = () => axios.get('/login/user').catch((err) => {});
