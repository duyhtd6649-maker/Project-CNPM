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
      const response = await axiosClient.post('auth/jwt/login/', loginData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('role', response.data.role);
      navigate('/homepage');
    } catch (error) {
      alert("Đăng nhập thất bại! Vui lòng kiểm tra lại.");
      try {
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
      } catch (retryError) {
        alert("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <Link to="/admin-login" className="admin-login-link">
          for ADMIN
        </Link>

        <div className="brand-logo-container">
          <h2 className="brand-text">
            <span className="uth-blue">UTH</span> <span className="workplace-green">WORKPLACE</span>
          </h2>
        </div>

        <div className="login-box">
          <div className="login-form-content">
            <h1 className="login-title">LOGIN</h1>
            <p className="login-subtitle">Let's get started !!!</p>

            <form onSubmit={handleLogin}>
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
                <Link to="/forgot-password">Forgot password</Link>
              </div>

              <div className="login-action-area">
                <button type="submit" className="login-btn-purple" disabled={loading}>
                  {loading ? "Signing In..." : "Login"}
                </button>
                <div className="reg-hint">
                  Not a member ? <Link to="/register">Register now</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="login-right-side">
      </div>
    </div>
  );
};

export default Login;