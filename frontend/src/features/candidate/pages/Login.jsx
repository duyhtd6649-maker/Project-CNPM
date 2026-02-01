import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faShieldAlt } from '@fortawesome/free-solid-svg-icons'; 
import axiosClient from "/src/infrastructure/http/axiosClient";
import '../components/Login.css';

const Login = () => {
  const navigate = useNavigate();
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
      const response = await axiosClient.post('/auth/jwt/login/', loginData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('role', response.data.role);
      navigate('/homepage'); 
    } catch (error) {
      alert("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        {/* Nút Admin Only kiểu cũ - nằm cố định ở góc phải */}
        <Link to="/admin-login" className="admin-login-link">
           for ADMIN
        </Link>

        {/* Logo Phần đầu trang */}
        <div className="brand-logo-container">
          <span className="text-uth">UTH</span>
          <span className="text-workplace">WORKPLACE</span>
        </div>

        {/* Nội dung trung tâm */}
        <div className="login-form-content">
          <h1 className="login-title">LOGIN</h1>
          <p className="login-subtitle">Let's get started !!!</p>

          <form onSubmit={handleLogin} className="form-actual">
            <div className="custom-input-group">
              <span className="input-icon">👤</span>
              <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            </div>
            
            <div className="custom-input-group">
              <span className="input-icon">🔒</span>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>

            <div className="forgot-link-container">
              <Link to="/forgot">Forgot password</Link>
            </div>

            {/* Vùng nút Login và Register - Được giãn cách ra */}
            <div className="login-action-area">
              <button type="submit" className="login-btn-purple" disabled={loading}>
                {loading ? "..." : "Login"}
              </button>
              <div className="reg-hint">
                Not a member ? <Link to="/register">Register now</Link>
              </div>
            </div>
          </form>

          {/* Vùng mạng xã hội - Tách biệt rõ ràng */}
          <div className="social-section-wrapper">
            <div className="social-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-icons-row">
              <button type="button" className="s-circle s-red"><FontAwesomeIcon icon={faGoogle} /></button>
              <button type="button" className="s-circle s-black"><FontAwesomeIcon icon={faShieldAlt} /></button>
              <button type="button" className="s-circle s-gmail"><FontAwesomeIcon icon={faEnvelope} /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="login-right-side"></div>
    </div>
  );
};

export default Login;