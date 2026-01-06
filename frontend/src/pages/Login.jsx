import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaGoogle, FaApple } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      alert("Please fill in all fields!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("usersList") || "[]");
    const user = users.find(
      u =>
        (u.username === loginData.username || u.email === loginData.username) &&
        u.password === loginData.password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert(`Welcome back, ${user.username}!`);
      navigate("/home");
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-header">
          <div className="header-logo">
            <span className="logo-uth">UTH</span>
            <span className="logo-workplace">WORKPLACE</span>
          </div>
          <Link to="/admin-login" className="admin-login-link">
            Admin Login
          </Link>
        </div>

        <div className="login-content">
          <h1>LOGIN</h1>
          <p className="subtitle">Let's get started!</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username or Email"
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

            <button type="submit" className="login-button">
              Login
            </button>
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

      <div className="login-right"></div>
    </div>
  );
};

export default Login;
