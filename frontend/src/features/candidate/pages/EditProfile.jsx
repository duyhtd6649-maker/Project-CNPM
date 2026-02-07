import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ChevronDown, Settings } from 'lucide-react';
import "../components/EditProfile.css";
import "../components/ViewUserProfile.css";
import "../components/HomepageCandidates.css";

const EditProfile = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
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

  const [formData, setFormData] = useState({
    avatar: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    description: ''
  });


  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch profile data from backend API
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile/myprofile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            avatar: data.avatar || null,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            dateOfBirth: data.date_of_birth || '',
            description: data.description || ''
          });
        } else {
          console.error('API Error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    navigate('/profile');
  };


  const validateForm = () => {
    if (formData.dateOfBirth) {
      const birthYear = new Date(formData.dateOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear > currentYear) {
        alert("Năm sinh không thể ở tương lai!");
        return false;
      }
    }
    return true;
  };


  const handleSave = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('access_token');
    const updateFormData = new FormData();

    // Append all fields to FormData
    // Note: Backend now handles flat structure perfectly thanks to our fixes
    updateFormData.append('first_name', formData.firstName);
    updateFormData.append('last_name', formData.lastName);
    updateFormData.append('phone', formData.phone);
    updateFormData.append('address', formData.address);
    updateFormData.append('date_of_birth', formData.dateOfBirth);
    updateFormData.append('description', formData.description);

    // Append avatar only if a new file is selected
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      updateFormData.append('avatar', fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/candidate/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // No 'Content-Type' header needed; fetch sets it automatically for FormData
        },
        body: updateFormData
      });

      if (response.ok) {
        // Update local storage for immediate UI feedback
        localStorage.setItem('username', `${formData.lastName} ${formData.firstName}`);
        alert("Cập nhật thành công!");
        navigate('/profile');
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        alert(`Lỗi cập nhật: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Đã xảy ra lỗi khi kết nối đến server.");
    }
  };




  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
    <div className="edit-profile-container">
      <header className="profile-top-nav">
        <div className="welcome-section">
          <h1 onClick={handleBack} className="back-home-link">
            <span className="back-arrow">⬅</span> Welcome, {formData.lastName} {formData.firstName || 'User'}
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

      <main className="edit-profile-main">
        <div className="purple-banner"></div>

        <div className="avatar-section">
          <div className="avatar-wrapper" onClick={handleAvatarClick}>
            {formData.avatar ? (
              <img src={formData.avatar} alt="User Avatar" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
            <div className="avatar-overlay"><span className="camera-icon">📷</span></div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" hidden />
        </div>

        <div className="form-container">
          <div className="form-grid">
            <div className="form-column">
              <div className="form-field">
                <label>Last Name (Họ)</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>First Name (Tên)</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} disabled style={{ backgroundColor: '#eee' }} />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-column">
              <div className="form-field">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;