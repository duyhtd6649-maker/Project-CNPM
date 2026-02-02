import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faShieldAlt, faUser, faLock } from '@fortawesome/free-solid-svg-icons'; 
import axiosClient from "/src/infrastructure/http/axiosClient";
import { useAuth } from '../../../app/AppProviders'; 
import '../components/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); 
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Gửi request đăng nhập
      const response = await axiosClient.post('/api/auth/jwt/login/', loginData);
      
      // 2. Lấy dữ liệu trả về
      const { access, role, username } = response.data;
      
      // ==========================================
      // BƯỚC QUAN TRỌNG: FIX LỖI NULL KHI KHÔNG ĐƯỢC SỬA BACKEND
      // Nếu role bị null, ta gán cứng nó là 'candidate' để hệ thống chạy tiếp
      // ==========================================
      const safeRole = role || 'candidate'; 
      const safeUsername = username || loginData.username || 'User';

      // 3. Lưu vào localStorage (Lưu giá trị safeRole thay vì role bị null)
      localStorage.setItem('access_token', access);
      localStorage.setItem('user_role', safeRole); 
      localStorage.setItem('username', safeUsername);
      
      // 4. Cập nhật Auth Context
      setUser({
        username: safeUsername,
        role: safeRole
      });

      alert("Login successful!");

      // 5. Điều hướng (Sử dụng safeRole đã được bảo vệ khỏi null)
      const userRoleLower = safeRole.toLowerCase();

      if (userRoleLower === 'candidate') {
        navigate('/homepage');
      } else if (userRoleLower === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (userRoleLower === 'admin') {
        navigate('/admin');
      } else {
        // Trường hợp role lạ, vẫn cho về homepage
        navigate('/homepage');
      }

    } catch (error) {
      console.error("Login Error Details:", error);
      const errorMsg = error.response?.data?.detail || "Invalid username or password!";
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        
        {/* LOGO SECTION */}
        <div className="logo-container-header">
          <h2 className="uth-brand">UTH</h2>
          <h2 className="workplace-brand">WORKPLACE</h2>
        </div>

        {/* ADMIN LINK */}
        <Link to="/admin-login" className="admin-login-link">
          for ADMIN
        </Link>

        <div className="login-content-box">
          <div className="login-header-text">
            <h2 className="welcome-title">LOGIN</h2>
            <p className="welcome-subtext">Let's get started !!!</p>
          </div>

          <form className="login-form-container" onSubmit={handleLogin}>
            
            <div className="input-group-wrapper">
              <span className="input-icon-left">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={loginData.username}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group-wrapper">
              <span className="input-icon-left">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={loginData.password}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="forgot-password-box">
              <Link to="/forgot">Forgot password</Link>
            </div>

            <div className="action-button-group">
              <button 
                type="submit" 
                className="btn-submit-login" 
                disabled={loading}
              >
                {loading ? "Processing..." : "Login"}
              </button>
              
              <div className="register-redirect">
                Not a member ? <Link to="/register">Register now</Link>
              </div>
            </div>

          </form>

          <div className="social-auth-section">
            <div className="divider-line">
              <span>Or continue with</span>
            </div>

            <div className="social-btn-row">
              <button type="button" className="social-btn google">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button type="button" className="social-btn apple">
                <FontAwesomeIcon icon={faShieldAlt} />
              </button>
              <button type="button" className="social-btn gmail">
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