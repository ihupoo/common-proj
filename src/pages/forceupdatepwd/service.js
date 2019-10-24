import axios from '@/api/axios';

export const fetchForcePwd = () => axios.get('/forceupdatepwd/getpasswordinfo');