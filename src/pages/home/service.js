import axios from '@/api/axios';

export const fetchHomeMenu = () => axios.get('/home/menu').catch((err) => {});;
