import axios from '@/api/axios';

export const fetchCore = () => axios.get('/core/getcore').catch((err) => {});