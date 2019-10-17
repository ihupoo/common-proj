import axios from '@/api/axios';

export const getAllModules = () => axios.get('/home/getallmodules');