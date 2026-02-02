import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faShieldAlt, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; 
// Bổ sung: Import useAuth để đồng bộ với router.jsx
import { useAuth } from '../../../app/AppProviders'; 
import "../components/AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Bổ sung: Lấy hàm setUser từ Context
  
  // Trạng thái dữ liệu form
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Trạng thái xử lý UI
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tải font Archivo Black (Giữ nguyên từ bản gốc)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    if (errorMessage) setErrorMessage(''); // Xóa lỗi khi người dùng nhập lại
  };

  // --- HÀM XỬ LÝ ĐĂNG NHẬP HOÀN CHỈNH ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra để trống
    if (!loginData.username.trim()) {
      alert("Please enter your Admin Username/Email!");
      return;
    }
    if (!loginData.password.trim()) {
      alert("Please enter your password!");
      return;
    }

    setLoading(true);
    try {
      // 2. Gọi API đăng nhập khớp với urls.py (auth/jwt/login/)
      const response = await axios.post('http://127.0.0.1:8000/api/auth/jwt/login/', {
        username: loginData.username,
        password: loginData.password
      });

      if (response.status === 200) {
        const { access, refresh } = response.data;

        // 3. Lưu thông tin vào LocalStorage để duy trì phiên
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('username', loginData.username);

        // 4. CẬP NHẬT CONTEXT (Điểm mấu chốt để ProtectedRoute cho phép đi qua)
        setUser({ 
          role: 'admin', 
          username: loginData.username 
        });

        alert("Admin Login Successful!");
        
        // 5. Chuyển hướng về trang Dashboard Admin
        // Theo router.jsx của bạn: path là 'admin'
        navigate('/admin'); 
      }
    } catch (error) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.detail || "Invalid admin credentials or server error!";
      setErrorMessage(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-login-wrapper">
        <div className="admin-left-side">
          <div className="admin-header-logo">
            <span className="logo-uth">UTH</span>
            <span className="logo-workplace">Workplace</span>
          </div>

          <div className="admin-content-container">
            <h2 className="admin-welcome-title">Admin Portal</h2>
            <p className="admin-welcome-subtitle">Enter your admin credentials to access the dashboard</p>

            <form onSubmit={handleAdminLogin}> {/* Thêm onSubmit để Enter cũng đăng nhập được */}
              <div className="admin-input-group">
                <label>Admin Username</label>
                <div className="admin-input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="admin-input-icon" />
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="Admin Email/Username" 
                    value={loginData.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label>Password</label>
                <div className="admin-input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="admin-input-icon" />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={loginData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {errorMessage && <p style={{color: 'red', fontSize: '14px', marginBottom: '10px'}}>{errorMessage}</p>}

              <div className="admin-forgot-pw">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button 
                type="submit" 
                className="admin-submit-btn" 
                disabled={loading}
              >
                {loading ? "Verifying..." : "Login"}
              </button>
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

        {/* PHẦN BÊN PHẢI: TRANG TRÍ (Giữ nguyên 100%) */}
        <div className="admin-right-side">
          <div className="admin-diagonal-bg"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;