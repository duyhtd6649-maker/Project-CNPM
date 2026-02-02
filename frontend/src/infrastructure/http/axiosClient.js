// src/infrastructure/http/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  // Thử thêm tiền tố 'api/' vì file urls.py bạn gửi thường được include vào api/
  baseURL: "http://127.0.0.1:8000/api/", 
  timeout: 10000,
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/auth/jwt/refresh/', {
            refresh: refreshToken,
          });

          if (res.status === 200) {
            localStorage.setItem('access_token', res.data.access);
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;