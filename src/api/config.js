import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://191.52.58.194:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;