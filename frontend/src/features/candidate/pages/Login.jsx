import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faShieldAlt } from '@fortawesome/free-solid-svg-icons'; 
import axiosClient from "/src/infrastructure/http/axiosClient";
import { useAuth } from '../../../app/AppProviders'; // Đã sửa đường dẫn lùi 3 cấp
import '../components/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Lấy setUser từ Context
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Gọi API đăng nhập
      const response = await axiosClient.post('/api/auth/jwt/login/', loginData);
      
      // 2. Lấy dữ liệu từ Backend
      const { access, role, username } = response.data;
      
      // 3. Lưu vào localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('role', role);

      // 4. Cập nhật AuthContext (BẮT BUỘC để qua được ProtectedRoute)
      setUser({ username: username || loginData.username, role: role });

      // Chuyển role về chữ thường để so sánh
      const userRole = role ? role.toLowerCase() : '';
      
      console.log("Logged in with role:", userRole);

      // 5. Điều hướng dựa trên Role và router.jsx
      if (userRole === 'recruiter') {
        alert(`Chào mừng Nhà tuyển dụng ${username || ''}!`);
        navigate('/recruiter-dashboard');
      } else if (userRole === 'candidate') {
        alert(`Chào mừng Ứng viên ${username || ''}!`);
        
        // Chuyển hướng đến đường dẫn 'homepage' khai báo trong router.jsx
        navigate('/homepage');

        // PHƯƠNG ÁN DỰ PHÒNG: Nếu sau 300ms vẫn ở trang Login, ép trình duyệt nhảy trang
        setTimeout(() => {
          if (window.location.pathname.includes('login')) {
            window.location.href = '/homepage';
          }
        }, 300);
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.detail || "Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản và mật khẩu.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="brand-logo-container">
          <span className="text-uth" style={{color: '#2e5bff', fontWeight: '800', fontSize: '24px'}}>UTH</span>
          <span className="text-workplace" style={{color: '#05cd99', fontWeight: '800', fontSize: '24px'}}>WORKPLACE</span>
        </div>

        <div className="login-form-content">
          <h1 className="login-title">LOGIN</h1>
          <p className="login-subtitle">Let's get started !!!</p>

          <form onSubmit={handleLogin} className="form-actual">
            <div className="custom-input-group">
              <span className="input-icon">👤</span>
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={loginData.username}
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="custom-input-group">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={loginData.password}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="forgot-link-container">
              <Link to="/forgot">Forgot password</Link>
            </div>

            <div className="login-action-area">
              <button type="submit" className="login-btn-purple" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="reg-hint">
                Not a member ? <Link to="/register">Register now</Link>
              </div>
            </div>
          </form>

          <div className="social-section-wrapper">
            <div className="social-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-icons-row">
              <button type="button" className="s-circle s-red">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button type="button" className="s-circle s-black">
                <FontAwesomeIcon icon={faShieldAlt} />
              </button>
              <button type="button" className="s-circle s-gmail">
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right-side"></div>
    </div>
  );
};

export default Login;