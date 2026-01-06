import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      alert("Please enter Admin credentials!");
      return;
    }

    if (loginData.username === 'admin' && loginData.password === '123') {
      alert("Welcome Admin!");
      navigate('/admin');
    } else {
      alert("Invalid Admin credentials!");
    }
  };

  return (
    <div className="admin-page-wrapper">
      {/* Tải font Archivo Black trực tiếp */}
      <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />
      
      <div className="admin-login-wrapper">
        <div className="admin-left-side">
          {/* Chỉ cập nhật style font cho phần logo */}
          <div className="admin-header-logo" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
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
                  placeholder="Username" 
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

        <div className="admin-right-side">
          <div className="admin-diagonal-bg"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;