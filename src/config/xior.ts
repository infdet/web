import xior from 'xior';

import { getAuthToken } from '#services/auth';

xior.defaults.baseURL = import.meta.env.VITE_API_URL;
xior.defaults.headers['Authorization'] = `Bearer ${getAuthToken()}`;
