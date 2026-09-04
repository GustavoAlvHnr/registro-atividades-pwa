import apiClient from './config';

export default {
  register(payload) {
    return apiClient.post('/api/users/register', payload);
  },
  login(payload) {
    return apiClient.post('/api/token', payload);
  },
};
