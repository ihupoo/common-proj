import axios from '@/api/axios';

export const fetchPlat = () => axios.get('/plat/getplat');