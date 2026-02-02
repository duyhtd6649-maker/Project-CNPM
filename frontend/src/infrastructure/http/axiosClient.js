// src/infrastructure/http/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  // Thử thêm tiền tố 'api/' vì file urls.py bạn gửi thường được include vào api/
  baseURL: "http://127.0.0.1:8000/api/", 
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;