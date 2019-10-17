import axios from '@/api/axios';

export const getCoreData = () => axios.get('/core/getcoredata');