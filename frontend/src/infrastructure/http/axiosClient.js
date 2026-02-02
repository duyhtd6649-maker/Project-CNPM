import axios from "axios";

const axiosClient = axios.create({
  // Giữ nguyên baseURL của bạn
  baseURL: "http://127.0.0.1:8000/", 
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  
  // CHỈ thêm Token nếu đường dẫn KHÔNG phải là login hoặc registration
  const isAuthRequest = config.url.includes('auth/registration') || config.url.includes('auth/jwt/login');
  
  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;