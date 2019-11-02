import axios from '@/api/axios';

export const fetchSystemConfig = () => axios.get('/config').catch((err) => {});

export const fetchUserInfo = () => axios.get('/userInfo').catch((err) => {});

export const fetchUserMenu = () => axios.get('/userMenu').catch((err) => {});

