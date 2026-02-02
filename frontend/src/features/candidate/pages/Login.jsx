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
      // Gọi API đăng nhập
      const response = await axiosClient.post('/api/auth/jwt/login/', loginData);
      
      // FIX LỖI toLowerCase: Đặt giá trị mặc định cho role là chuỗi rỗng nếu backend trả về null
      const { access, role = '', username } = response.data;
      
      // 1. Lưu vào localStorage để đồng bộ với AppProviders
      localStorage.setItem('access_token', access);
      localStorage.setItem('user_role', role || ''); 
      localStorage.setItem('username', username || '');
      
      // 2. Cập nhật State trong AppProviders
      setUser({ username, role });

      alert("Login successful!");

      // FIX LỖI: Sử dụng Optional Chaining (?.) để an toàn tuyệt đối
      const userRole = role?.toLowerCase() || '';

      if (userRole === 'candidate') {
        navigate('/homepage'); 
      } else if (userRole === 'recruiter') {
        navigate('/recruiter-dashboard'); 
      } else if (userRole === 'admin') {
        navigate('/admin'); 
      } else {
        // Nếu role null hoặc không xác định, mặc định về homepage của candidate
        navigate('/homepage');
      }

    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.detail || "Invalid username or password!";
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        {/* LOGO SECTION - THEO ẢNH MẪU */}
        <div className="logo-section">
          <div className="uth-text">UTH</div>
          <div className="workplace-text">WORKPLACE</div>
        </div>

        {/* ADMIN LINK */}
        <Link to="/admin-login" className="admin-login-link">
          for ADMIN
        </Link>

        <div className="login-content-box">
          <div className="login-header">
            <h2 className="welcome-text">LOGIN</h2>
            <p className="sub-text">Let's get started !!!</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              {/* ICON TRONG INPUT THEO ẢNH MẪU */}
              <FontAwesomeIcon icon={faUser} className="input-icon-inner" />
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={loginData.username}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              {/* ICON TRONG INPUT THEO ẢNH MẪU */}
              <FontAwesomeIcon icon={faLock} className="input-icon-inner" />
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

      {/* PHẦN MẢNG MÀU GRADIENT BÊN PHẢI THEO ẢNH MẪU */}
      <div className="login-right-side"></div>
    </div>
  );
};

export default Login;