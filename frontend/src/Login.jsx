import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import './Login.css';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook để chuyển trang
  
  const [loginData, setLoginData] = useState({
    username: '', // Ở đây người dùng có thể nhập Name hoặc Email tùy bạn thiết lập
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

    // 1. Kiểm tra nhập liệu cơ bản
    if (!loginData.username.trim()) {
      alert("Please enter your Username or Email!");
      return;
    }
    if (!loginData.password.trim()) {
      alert("Please enter your Password!");
      return;
    }

    // 2. Lấy danh sách người dùng đã lưu từ localStorage
    const savedUsers = JSON.parse(localStorage.getItem('usersList') || '[]');

    // 3. Tìm kiếm người dùng khớp với thông tin nhập vào
    // Kiểm tra khớp username (name) HOẶC email
    const userFound = savedUsers.find(user => 
      (user.username === loginData.username || user.email === loginData.username) && 
      user.password === loginData.password
    );

    if (userFound) {
      alert(`Welcome back, ${userFound.username}!`);
      
      // Lưu thông tin phiên đăng nhập hiện tại (tùy chọn)
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      
      // 4. Chuyển hướng tới trang HomepageCandidates
      navigate('/home'); 
    } else {
      alert("Invalid Username/Email or Password!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="header-logo">
          <span className="logo-uth">UTH</span>
          <span className="logo-workplace">WORKPLACE</span>
        </div>

        <div className="login-content">
          <h1>LOGIN</h1>
          <p className="subtitle">Let's get started !!!</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <i className="icon-user">👤</i> 
              <input 
                type="text" 
                name="username" 
                placeholder="Username or Email" 
                value={loginData.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <i className="icon-lock">🔒</i>
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
            <button className="social-btn google">G</button>
            <button className="social-btn apple">A</button>
            <button className="social-btn gmail">M</button>
          </div>
        </div>
      </div>

      <div className="login-right"></div>
    </div>
  );
};

export default Login;