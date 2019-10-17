import axios from '@/api/axios';

export const getPlatData = () => axios.get('/plat/getplatedata');