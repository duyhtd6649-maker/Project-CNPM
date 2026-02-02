import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faShieldAlt } from '@fortawesome/free-solid-svg-icons'; 
import axiosClient from "../../../infrastructure/http/axiosClient";
import { useAuth } from '../../../app/AppProviders';
import '../components/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      // Đảm bảo endpoint khớp với BE (bỏ /api/ nếu baseURL đã có)
      const response = await axiosClient.post('auth/jwt/login/', loginData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('role', response.data.role);
      navigate('/homepage'); 
    } catch (error) {
      alert("Đăng nhập thất bại! Vui lòng kiểm tra lại.");
      const response = await axiosClient.post('/api/auth/jwt/login/', {
        username: loginData.username,
        password: loginData.password
      });
      
      login(response.data);
      
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home'); 
      }
    } catch (error) {
      alert("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* PHẦN BÊN TRÁI: CHIẾM 1.2 PHẦN MÀN HÌNH */}
      <div className="login-left">
        {/* Nút ADMIN góc phải */}
        <Link to="/admin-login" className="admin-login-link">ADMIN</Link>
        
        {/* Logo hệ thống */}
        <Link to="/admin-login" className="admin-login-link">
           for ADMIN
        </Link>

        <div className="brand-logo-container">
          <h2 style={{ color: '#7678ff', fontWeight: '800', margin: 0 }}>UTH WORKPLACE</h2>
        </div>

        {/* Khối chứa Form trung tâm */}
        <div className="login-box">
          <div className="login-header">
            <h1>Hello Again!</h1>
            <p>Welcome back, you've been missed!</p>
          </div>
        <div className="login-form-content">
          <h1 className="login-title">LOGIN</h1>
          <p className="login-subtitle">Let's get started !!!</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input 
                type="text" 
                name="username" 
                placeholder="Enter username" 
                placeholder="Username" 
                value={loginData.username}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
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
              <Link to="/forgot">Recovery Password</Link>
              <Link to="/forgot-password">Forgot password</Link>
            </div>

            <div className="login-action-area">
              <button type="submit" className="login-btn-purple" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <div className="reg-hint">
                Not a member? <Link to="/register">Register now</Link>
              </div>
            </div>
          </form>

          {/* Phần icons mạng xã hội */}
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

      {/* PHẦN BÊN PHẢI: MÀNG MÀU XANH TÍM (Kích hoạt .login-right-side trong CSS) */}
      <div className="login-right-side">
        {/* Phần này để trống, CSS sẽ lo phần màu sắc và bo góc */}
      </div>
    </div>
  );
};

export default Login;