import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewUserProfile.css';

const ViewUserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

  // Load dữ liệu khi vào trang
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
    } else {
      setUserData(user);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // 1. Cập nhật phiên hiện tại
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // 2. Đồng bộ với danh sách tổng
      const usersList = JSON.parse(localStorage.getItem('usersList') || '[]');
      const updatedList = usersList.map(u => u.email === userData.email ? userData : u);
      localStorage.setItem('usersList', JSON.stringify(updatedList));
      
      alert("Thông tin cá nhân đã được cập nhật!");
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <div className="view-profile-full-page">
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
          <div className="avatar-circle">👤</div>
          <div className="user-titles-fixed">
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
          </div>
          <button 
            className={`btn-edit-main-fixed ${isEditing ? 'save-btn' : ''}`} 
            onClick={handleEditToggle}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <section className="details-grid-container">
          <div className="grid-column">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={userData.name} onChange={handleChange} readOnly={!isEditing} className={isEditing ? "active-input" : ""} />
            </div>
            <div className="form-group">
              <label>Email (Không thể sửa)</label>
              <input type="email" value={userData.email} readOnly style={{background: '#eee'}} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={userData.phone} onChange={handleChange} readOnly={!isEditing} className={isEditing ? "active-input" : ""} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={userData.country} onChange={handleChange} readOnly={!isEditing} className={isEditing ? "active-input" : ""} />
            </div>
          </div>

          <div className="grid-column">
            <div className="form-group">
              <label>Gender</label>
              {isEditing ? (
                <select name="gender" value={userData.gender} onChange={handleChange} className="active-input select-edit">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <input type="text" value={userData.gender} readOnly />
              )}
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type={isEditing ? "date" : "text"} name="dob" value={userData.dob} onChange={handleChange} readOnly={!isEditing} className={isEditing ? "active-input" : ""} />
            </div>
            <div className="form-group">
              <label>Jobs</label>
              <input type="text" name="jobs" value={userData.jobs} onChange={handleChange} readOnly={!isEditing} className={isEditing ? "active-input" : ""} />
            </div>
            <div className="form-group">
              <label>Package</label>
              <div className="select-box-sim">Free Membership <span>▼</span></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewUserProfile;