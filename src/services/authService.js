import http from '../api/http';

export const authService = {
  login(payload) {
    return http.post('/auth/login', payload);
  },
  register(payload) {
    return http.post('/auth/register', payload);
  }
};