import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaGoogle, FaApple } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const savedUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    const userFound = savedUsers.find(user => 
      (user.username === loginData.username || user.email === loginData.username) && 
      user.password === loginData.password
    );

    if (userFound) {
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      navigate('/home'); 
    } else {
      alert("Invalid Username/Email or Password!");
    }
  };

  return (
    <div className="login-wrapper">
      {/* PHẦN BÊN TRÁI: FORM */}
      <div className="login-left">
        <div className="login-header">
          <div className="header-logo">
            <span className="logo-uth">UTH</span>
            <span className="logo-workplace">WORKPLACE</span>
          </div>
          <span className="for-admin">for ADMIN</span>
        </div>

        <div className="login-content">
          <h1>LOGIN</h1>
          <p className="subtitle">Let's get started !!!</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={loginData.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={loginData.password}
                onChange={handleChange}
              />
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="login-button">Login</button>
          </form>

          <div className="register-link">
            Not a member? <Link to="/register">Register now</Link>
          </div>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn google"><FaGoogle /></button>
            <button className="social-btn apple"><FaApple /></button>
            <button className="social-btn gmail"><SiGmail /></button>
          </div>
        </div>
      </div>

      {/* PHẦN BÊN PHẢI: GRADIENT */}
      <div className="login-right"></div>
    </div>
  );
};

export default Login;