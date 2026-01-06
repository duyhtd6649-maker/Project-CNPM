import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faShieldAlt, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Tải font Archivo Black
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();

    // Logic kiểm tra để trống giống Login ban đầu
    if (!loginData.username.trim()) {
      alert("Please enter your Admin Email!");
      return;
    }
    if (!loginData.password.trim()) {
      alert("Please enter your Password!");
      return;
    }

    // Kiểm tra tài khoản admin mẫu
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASS = "123456";

    if (loginData.username === ADMIN_EMAIL && loginData.password === ADMIN_PASS) {
      alert(`Welcome back, Admin!`);
      // Lưu trạng thái admin vào localStorage
      localStorage.setItem('currentUser', JSON.stringify({ email: ADMIN_EMAIL, role: 'admin' }));
      navigate('/admin'); 
    } else {
      // Thông báo lỗi giống Login ban đầu
      alert("Invalid Admin Email or Password!");
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-login-wrapper">
        
        {/* PHẦN BÊN TRÁI: FORM ĐĂNG NHẬP */}
        <div className="admin-left-side">
          <div className="admin-header-logo" style={{ fontFamily: "'Archivo Black', sans-serif", fontWeight: '900' }}>
            <span className="logo-uth">UTH</span>
            <span className="logo-workplace">WORKPLACE</span>
          </div>

          <div className="admin-content-container">
            <h1>ADMIN LOGIN</h1>
            <p className="admin-subtitle">Have a nice day !!!</p>

            <form className="admin-form" onSubmit={handleAdminLogin}>
              <div className="admin-input-group">
                <FontAwesomeIcon icon={faUser} className="admin-icon" />
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Admin Email" 
                  value={loginData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-input-group">
                <FontAwesomeIcon icon={faLock} className="admin-icon" />
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  value={loginData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-forgot-pw">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button type="submit" className="admin-submit-btn">Login</button>
            </form>

            <div className="admin-divider">
              <span>Or continue with</span>
            </div>

            <div className="admin-social-login">
              <button className="admin-social-btn admin-google" type="button">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button className="admin-social-btn admin-oauth" type="button">
                <FontAwesomeIcon icon={faShieldAlt} />
              </button>
              <button className="admin-social-btn admin-gmail" type="button">
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </div>

            <div className="admin-back-link">
              <Link to="/login">← Back to User Login</Link>
            </div>
          </div>
        </div>

        {/* PHẦN BÊN PHẢI: TRANG TRÍ */}
        <div className="admin-right-side">
          <div className="admin-diagonal-bg"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;