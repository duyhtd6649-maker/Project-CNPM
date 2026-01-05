import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewUserProfile.css';

const ViewUserProfile = () => {
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa thông tin đăng nhập khỏi localStorage hoặc Session nếu có
    localStorage.removeItem('user'); 
    sessionStorage.clear();
    
    // Điều hướng về trang Login hoặc Home
    navigate('/login'); 
  };

  return (
    <div className="view-profile-full-page">
      <header className="profile-top-nav">
        <div className="welcome-section">
          <h1 onClick={() => navigate('/home')} className="back-home-link">
            <span className="back-arrow">⬅</span> Welcome, User
          </h1>
          <p>Wed, 24 December 2025</p>
        </div>
        
        {/* Khu vực nút chức năng bên phải header */}
        <div className="header-actions">
          <button className="notif-badge">🔔</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="profile-content-wrapper">
        <div className="full-width-banner"></div>

        <div className="profile-intro-row">
          <div className="avatar-container">
            <div className="avatar-circle">👤</div>
          </div>
          
          <div className="user-titles-fixed">
            <h2>User</h2>
            <p>abcxyz@gmail.com</p>
          </div>
          <button className="btn-edit-main-fixed">Edit</button>
        </div>

        <section className="details-grid-container">
          <div className="grid-column">
            <div className="form-group">
              <label>User Name</label>
              <input type="text" placeholder="User Name" readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your Email" readOnly />
            </div>
            <div className="form-group">
              <label>ID</label>
              <input type="text" placeholder="Your UID" readOnly />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" placeholder="Your Country" readOnly />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="text" placeholder="DD/MM/YYYY" readOnly />
            </div>
            <span className="help-text">Help ?</span>
          </div>

          <div className="grid-column">
            <div className="form-group">
              <label>Gender</label>
              <input type="text" placeholder="Male/Female" readOnly />
            </div>
            <div className="form-group">
              <label>Jobs</label>
              <input type="text" placeholder="Your Present Jobs" readOnly />
            </div>
            <div className="form-group">
              <label>Package</label>
              <div className="select-box-sim">Purchased Package <span>▼</span></div>
            </div>
            <div className="form-group">
              <label>Achievement</label>
              <div className="empty-achieve-box"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewUserProfile;