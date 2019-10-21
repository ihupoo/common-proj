import axios from '@/api/axios';

export const fetchSystemConfig = () => axios.get('/config');

export const fetchLoginInfo = () => axios.get('/login/getlogin');
