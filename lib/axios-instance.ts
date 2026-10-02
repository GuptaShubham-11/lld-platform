import axios from 'axios';
import { env } from './env';

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
