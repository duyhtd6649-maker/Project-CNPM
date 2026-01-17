import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/ViewUserProfile.css";

const ViewUserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Load dữ liệu từ LocalStorage khi vào trang
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
    } else {
      setUserData(user);
    }
  }, [navigate]);

  // Hàm chuyển hướng sang trang EditProfile
  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <div className="view-profile-full-page">
      {/* --- HEADER --- */}
      <header className="profile-top-nav">
        <div className="welcome-section">
          <h1 onClick={() => navigate('/home')} className="back-home-link">
            <span className="back-arrow">⬅</span> Welcome, {userData.name}
          </h1>
          <p>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="header-actions">
          <button className="notif-badge">🔔</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="profile-content-wrapper">
        <div className="full-width-banner"></div>
        
        <div className="profile-intro-row">
          {/* Avatar Container (Chỉ hiển thị, không click được) */}
          <div className="avatar-container-fixed">
            <div className="avatar-circle">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="user-avatar-img" />
              ) : (
                "👤"
              )}
            </div>
            {/* Đã xóa input file và icon bút chì ở đây */}
          </div>

          <div className="user-titles-fixed">
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
          </div>
          
          {/* Nút bấm chuyển sang trang EditProfile */}
          <button 
            className="btn-edit-main-fixed" 
            onClick={handleEditClick}
          >
            Edit Profile
          </button>
        </div>

        {/* --- DANH SÁCH THÔNG TIN (READ ONLY) --- */}
        <section className="details-grid-container">
          <div className="grid-column">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={userData.name || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={userData.email || ''} readOnly style={{background: '#fafafa'}} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={userData.phone || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" value={userData.country || ''} readOnly />
            </div>
          </div>

          <div className="grid-column">
            <div className="form-group">
              <label>Gender</label>
              <input type="text" value={userData.gender || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="text" value={userData.dob || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Jobs</label>
              <input type="text" value={userData.jobs || ''} readOnly />
            </div>
            <div className="form-group">
              <label>Package</label>
              {/* Hiển thị package dưới dạng text box readonly cho đồng bộ */}
              <div className="select-box-sim" style={{justifyContent: 'flex-start'}}>
                {userData.package || 'Free Membership'}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewUserProfile;