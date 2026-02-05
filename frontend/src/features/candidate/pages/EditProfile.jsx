import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/EditProfile.css";

const EditProfile = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    avatar: null,
    userName: '',
    email: '',
    id: '',
    country: '',
    dateOfBirth: '',
    gender: '',
    jobs: '',
    achievement: '',
    package: 'Free'
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
            userName: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || '',
            email: data.email || '',
            id: data.id_number || '',
            country: data.country || '',
            dateOfBirth: data.dob || '',
            gender: data.gender || 'Male',
            jobs: data.jobs || '',
            achievement: data.achievement || '',
            package: 'Free'
          });
        } else {
          // If API fails, fallback to localStorage username
          const username = localStorage.getItem('username');
          setFormData(prev => ({
            ...prev,
            userName: username || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        const username = localStorage.getItem('username');
        setFormData(prev => ({
          ...prev,
          userName: username || ''
        }));
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
      if (birthYear >= 2018 && birthYear <= 2027) {
        alert("Năm sinh không hợp lệ. Vui lòng chọn lại!");
        return false;
      }
    }

    if (formData.jobs && formData.jobs.trim().length > 0) {

      if (/^\d/.test(formData.jobs)) {
        alert("Tên công việc không hợp lệ, không bắt đầu bằng chữ số. Vui lòng nhập lại!");
        return false;
      }
    }

    return true;
  };


  const handleSave = async () => {

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('access_token');

    // Prepare data for backend API - split userName into first_name and last_name
    // Backend requires BOTH first_name AND last_name to not be blank
    const nameParts = formData.userName.trim().split(' ').filter(p => p.length > 0);
    let firstName, lastName;

    if (nameParts.length === 0) {
      // Nếu không có tên, dùng placeholder
      firstName = 'User';
      lastName = 'User';
    } else if (nameParts.length === 1) {
      // Nếu chỉ có 1 từ, dùng cho cả first_name và last_name
      firstName = nameParts[0];
      lastName = nameParts[0];
    } else {
      // Nếu có nhiều từ: từ cuối là first_name (tên), còn lại là last_name (họ)
      firstName = nameParts[nameParts.length - 1];
      lastName = nameParts.slice(0, -1).join(' ');
    }

    const profileData = {
      first_name: firstName,
      last_name: lastName,
      country: formData.country,
      dob: formData.dateOfBirth,
      gender: formData.gender,
      jobs: formData.jobs,
      id_number: formData.id
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/candidate/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        // Also update localStorage username for navbar display
        localStorage.setItem('username', formData.userName);
        alert('Cập nhật thành công!');
        navigate('/profile');
      } else {
        const errorData = await response.json();
        alert('Lỗi cập nhật: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Lỗi kết nối. Vui lòng thử lại!');
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
      <header className="edit-profile-header">
        <div className="header-left">
          <span className="back-arrow" onClick={handleBack}>←</span>
          <div className="header-text">
            <h1>WELCOME, {formData.userName.toUpperCase()}</h1>
            <p className="current-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="header-right">
          <button className="notification-btn">🔔</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

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
                <label>User Name</label>
                <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} disabled style={{ backgroundColor: '#eee' }} />
              </div>

              <div className="form-field">
                <label>ID number or Passport</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              </div>
            </div>

            <div className="form-column">
              <div className="form-field">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-field">
                <label>Jobs</label>
                <input type="text" name="jobs" value={formData.jobs} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Achievement</label>
                <input type="text" name="achievement" value={formData.achievement} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Package</label>
                <select name="package" value={formData.package} onChange={handleChange} className="package-select">
                  <option value="Free">Free</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
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