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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setFormData({
        avatar: currentUser.avatar || null,
        userName: currentUser.name || '', 
        email: currentUser.email || '',
        id: currentUser.id || '',
        country: currentUser.country || '',
        dateOfBirth: currentUser.dob || '', 
        gender: currentUser.gender || 'Male',
        jobs: currentUser.jobs || '',
        achievement: currentUser.achievement || '',
        package: currentUser.package || 'Free'
      });
    } else {
      navigate('/login');
    }
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


  const handleSave = () => {
   
    if (!validateForm()) {
      return; 
    }

    const userToSave = {
      ...JSON.parse(localStorage.getItem('currentUser') || '{}'),
      avatar: formData.avatar,
      name: formData.userName,
      email: formData.email,
      id: formData.id,
      country: formData.country,
      dob: formData.dateOfBirth,
      gender: formData.gender,
      jobs: formData.jobs,
      achievement: formData.achievement,
      package: formData.package
    };

    localStorage.setItem('currentUser', JSON.stringify(userToSave));
    
    const usersList = JSON.parse(localStorage.getItem('usersList') || '[]');
    const updatedList = usersList.map(u => 
      u.email === userToSave.email ? userToSave : u
    );
    localStorage.setItem('usersList', JSON.stringify(updatedList));
    
    alert('Cập nhật thành công!');
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
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
                <input type="text" name="email" value={formData.email} onChange={handleChange} disabled style={{backgroundColor: '#eee'}} />
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