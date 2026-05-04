import api from './axios';

export const authAPI = {
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  signup: (data) => api.post('/auth/signup', data).then(r => r.data),

  sendOtp: (data) => api.post('/auth/send-otp', data).then(r => r.data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data).then(r => r.data),

  getMe: () => api.get('/auth/me').then(r => r.data),
  updateRole: (role) => api.put(`/auth/role/${role}`).then(r => r.data),
};