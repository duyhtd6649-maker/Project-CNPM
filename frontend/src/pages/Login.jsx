import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Thư viện Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faShieldAlt, faUserShield } from '@fortawesome/free-solid-svg-icons'; 

import './Login.css';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    username: '', 
    password: ''
  });

  useEffect(() => {
    if (location.state?.successMessage) {
      alert(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginData.username.trim() || !loginData.password.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    const userFound = savedUsers.find(user => 
      (user.username === loginData.username || user.email === loginData.username) && 
      user.password === loginData.password
    );

    if (userFound) {
      alert(`Welcome back, ${userFound.username}!`);
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      navigate('/home'); 
    } else {
      alert("Invalid Username/Email or Password!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-wrapper">
        <div className="login-left">
          {/* Nút Admin Login ở góc trên bên phải */}
          <Link to="/admin-login" className="admin-login-link">
            <FontAwesomeIcon icon={faUserShield} /> Admin Login
          </Link>

          <div className="header-logo">
            <span className="logo-uth">UTH</span>
            <span className="logo-workplace">WORKPLACE</span>
          </div>

          <div className="login-content">
            <h1>LOGIN</h1>
            <p className="subtitle">Let's get started !!!</p>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <i className="icon-input">👤</i> 
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username or Email" 
                  value={loginData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <i className="icon-input">🔒</i>
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
              <p>Not a member? <Link to="/register">Register now</Link></p>
            </div>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-btn google" type="button" title="Google">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button className="social-btn oauth" type="button" title="OAuth/Secure">
                <FontAwesomeIcon icon={faShieldAlt} />
              </button>
              <button className="social-btn gmail" type="button" title="Gmail">
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </div>
          </div>
        </div>

        <div className="login-right"></div>
      </div>
    </div>
  );
};

export default Login;