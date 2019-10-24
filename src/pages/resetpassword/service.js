import axios from '@/api/axios';

export const fetchResetPwd = () => axios.get('/resetpassword/getresetpassword');