import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ChevronDown, Settings } from 'lucide-react';
import axiosClient from "/src/infrastructure/http/axiosClient";
import "../components/ViewUserProfile.css";
import "../components/HomepageCandidates.css";


const ViewUserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const [notifications, setNotifications] = useState([]);

  // Fetch Notifications from API
  useEffect(() => {
    if (isNotifyOpen) {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
          const response = await fetch(`${API_BASE.replace(/\/$/, '')}/api/notification`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            let mappedData = [];

            if (Array.isArray(data) && data.length > 0) {
              mappedData = data.map((item, index) => ({
                id: index,
                type: 'System',
                title: item.title || 'Notification',
                user: item.actor || 'System',
                msg: item.message,
                time: new Date(item.created_date).toLocaleString()
              }));
            }
            setNotifications(mappedData);
          }
        } catch (error) {
          console.error("Failed to fetch notifications", error);
          setNotifications([]);
        }
      };

      fetchNotifications();
    }
  }, [isNotifyOpen]);

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Admin') return item.user && (item.user.toLowerCase().includes('admin') || item.type === 'System');
    if (activeTab === 'Recruiter') return item.user && item.user.toLowerCase().includes('recruiter');
    return false;
  });

  useEffect(() => {
    const fetchProfileFromDB = async () => {
      try {
        const token = localStorage.getItem('access_token');

        if (!token) {
          navigate('/login');
          return;
        }

        /**
         * LẤY THÔNG TIN TỪ DATABASE
         * Sử dụng fetch trực tiếp với token trong header (giống EditProfile)
         */
        const response = await fetch('http://127.0.0.1:8000/api/user/profile/myprofile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Profile API Response:', data);
          setUserData(data);
        } else {
          console.error('API Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ DB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileFromDB();
  }, [navigate]);

  // Resolve media URLs returned by backend (they may be relative paths)
  const resolveMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
    return `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="loading-screen">Đang kết nối Database...</div>;

  return (
    <div className="view-profile-full-page">
      {/* NAVBAR */}
      <header className="profile-top-nav">
        <div className="welcome-section">
          <h1 onClick={() => navigate('/homepage')} className="back-home-link">
            <span className="back-arrow">⬅</span> Welcome, {userData?.first_name || 'User'}
          </h1>
          <p className="current-date">Hôm nay: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="header-actions">
          <button className="notif-badge" onClick={() => setIsNotifyOpen(true)}>🔔</button>
          <button className="logout-btn-nav" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* NOTIFICATION BOX */}
      {isNotifyOpen && (
        <div className="notification-overlay" onClick={() => setIsNotifyOpen(false)}>
          <div className="notification-box" onClick={(e) => e.stopPropagation()}>
            <div className="notify-header">
              <div className="header-title"><span>Inbox</span> <ChevronDown size={14} /></div>
            </div>
            <div className="notify-tabs">
              {['All', 'Admin', 'Recruiter'].map(tab => (
                <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
              ))}
            </div>
            <div className="notify-content">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(item => (
                  <div key={item.id} className="notify-item">
                    <div className="notify-avatar"><UserCircle size={32} color={'#4b49ac'} /></div>
                    <div className="notify-info">
                      <div className="notify-user">{item.user} <span className="type-tag-small admin">{item.title}</span></div>
                      <div className="notify-msg">{item.msg}</div>
                      <div className="notify-time">{item.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-notify">No notifications</div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="profile-content-wrapper">
        {/* SHAPE 1: BANNER GRADIENT */}
        <div className="full-width-banner"></div>

        {/* AVATAR NẰM GIỮA 2 VÙNG MÀU */}
        <div className="profile-intro-row">
          <div className="avatar-outer-frame">
            <div className="avatar-circle-main">
              {userData?.avatar ? (
                <img src={resolveMediaUrl(userData.avatar)} alt="Avatar" className="user-avatar-img" />
              ) : (
                <span className="default-icon-user">👤</span>
              )}
            </div>
          </div>

          <div className="user-titles-fixed">
            <h2>{userData?.last_name} {userData?.first_name}</h2>
            <p>{userData?.email}</p>
          </div>

          <button className="btn-edit-main-fixed" onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
        </div>

        {/* SHAPE 2: THÔNG TIN CHI TIẾT */}
        <section className="details-grid-container">
          <div className="grid-column">
            <div className="form-group-item">
              <label>Full Name</label>
              <input type="text" value={`${userData?.last_name || ''} ${userData?.first_name || ''}`} readOnly />
            </div>
            <div className="form-group-item">
              <label>Email Address</label>
              <input type="email" value={userData?.email || ''} readOnly className="field-readonly" />
            </div>
            <div className="form-group-item">
              <label>Phone Number</label>
              <input type="text" value={userData?.phone || 'N/A'} readOnly />
            </div>
            <div className="form-group-item">
              <label>Address</label>
              <input type="text" value={userData?.address || 'N/A'} readOnly />
            </div>
          </div>

          <div className="grid-column">
            <div className="form-group-item">
              <label>Date of Birth</label>
              <input type="text" value={userData?.date_of_birth || 'N/A'} readOnly />
            </div>
            <div className="form-group-item">
              <label>Description</label>
              <input type="text" value={userData?.description || 'N/A'} readOnly />
            </div>
            <div className="form-group-item">
              <label>Account Role</label>
              <div className="role-display-box">
                {userData?.role || localStorage.getItem('user_role')}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewUserProfile;