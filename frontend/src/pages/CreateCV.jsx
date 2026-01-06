import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Home, Users, Briefcase, Bot, FileText, 
  UserCircle, ChevronDown, CreditCard, Bell, LogOut, Camera, X, Eye
} from 'lucide-react';
import './HomepageCandidates.css'; 
import './CreateCV.css';

const CreateCV = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // State quản lý dữ liệu người dùng nhập
  const [cvData, setCvData] = useState({
    avatar: null,
    realName: '',
    field: '',
    about: '',
    contactInfo: '',
    toolsSkill: '',
    softSkill: '',
    education: '',
    experience: '',
    cvTitle: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCvData(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="hp-container">
      {/* HEADER GIỮ NGUYÊN */}
      <header className="hp-header">
        <div className="header-left-section">
          <div className="logo-vertical" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <div className="logo-line">UTH</div>
            <div className="logo-line">WORKPLACE</div>
          </div>
          <div className="search-wrapper">
            <Search size={18} className="search-icon-svg" />
            <input type="text" placeholder="Search Users by Name, Email or ID" />
          </div>
        </div>
        <nav className="header-nav">
          <div className="nav-item" onClick={() => navigate('/home')}><Home size={18} /> <span>Home</span></div>
          <div className="nav-item"><Users size={18} /> <span>Company</span></div>
          <div className="nav-item"><Briefcase size={18} /> <span>Job</span></div>
          <div className="nav-item"><Bot size={18} /> <span>AI</span></div>
          <div className="nav-item active"><FileText size={18} /> <span>Create CV</span></div>
          
          <div className="nav-item account-btn-container" onClick={() => setIsAccountOpen(!isAccountOpen)}>
            <div className="account-icon-wrapper"><UserCircle size={24} /><ChevronDown size={14} /></div>
            <span>Account</span>
            {isAccountOpen && (
              <div className="mini-account-page" onClick={(e) => e.stopPropagation()}>
                <div className="mini-page-grid">
                  <div className="mini-item" onClick={() => navigate('/profile')}><div className="icon-box"><UserCircle size={28} /></div><span>Information</span></div>
                  <div className="mini-item" onClick={() => navigate('/premium')}><div className="icon-box"><CreditCard size={28} /></div><span>Premium</span></div>
                </div>
                <div className="mini-footer"><LogOut size={16} /> Sign out</div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* --- PHẦN BOX REVIEW ĐÃ ĐƯỢC CHỈNH SỬA THEO NỘI DUNG NGƯỜI DÙNG NHẬP --- */}
      {showPreview && (
        <div className="cv-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="cv-preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-preview-btn" onClick={() => setShowPreview(false)}><X size={20} /></button>
            
            <div className="preview-paper-layout">
              {/* Cột trái: Hiển thị từ cvData */}
              <div className="preview-left-col">
                <div className="preview-avatar-circle">
                  {cvData.avatar ? (
                    <img src={cvData.avatar} alt="Avatar" />
                  ) : (
                    <UserCircle size={100} color="#ccc" />
                  )}
                </div>
                <div className="preview-side-content">
                  <h5 className="preview-side-title">Contact</h5>
                  <p className="pre-wrap">{cvData.contactInfo || "Chưa nhập thông tin liên hệ"}</p>
                  
                  <h5 className="preview-side-title">Tools Skill</h5>
                  <p className="pre-wrap">{cvData.toolsSkill || "Chưa nhập kỹ năng công cụ"}</p>

                  <h5 className="preview-side-title">Soft Skills</h5>
                  <p className="pre-wrap">{cvData.softSkill || "Chưa nhập kỹ năng mềm"}</p>

                  <h5 className="preview-side-title">Education</h5>
                  <p className="pre-wrap">{cvData.education || "Chưa nhập thông tin học vấn"}</p>
                </div>
              </div>

              {/* Cột phải: Hiển thị từ cvData */}
              <div className="preview-right-col">
                <h1 className="preview-name">{cvData.realName || "Họ và Tên"}</h1>
                <p className="preview-field">{cvData.field || "Vị trí ứng tuyển"}</p>

                <div className="preview-main-section">
                  <h5 className="preview-main-title">About Me</h5>
                  <p className="pre-wrap">{cvData.about || "Chưa nhập phần giới thiệu bản thân"}</p>
                </div>

                <div className="preview-main-section">
                  <h5 className="preview-main-title">Experience</h5>
                  <p className="pre-wrap">{cvData.experience || "Chưa nhập kinh nghiệm làm việc"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CV BUILDER BODY - GIỮ NGUYÊN BỐ CỤC BAN ĐẦU CỦA BẠN */}
      <div className="cv-builder-content">
        <div className="cv-paper">
          <aside className="cv-left-aside">
            <div className="cv-avatar-section">
              <div className="cv-avatar-wrapper" onClick={triggerFileInput}>
                {cvData.avatar ? (
                  <img src={cvData.avatar} alt="Avatar" className="cv-avatar-img" />
                ) : (
                  <div className="cv-avatar-placeholder">
                    <Camera size={40} color="#6366f1" />
                    <span>Upload</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" hidden />
              </div>
              <p className="cv-hint-text">Click to change photo</p>
            </div>

            <div className="cv-section">
              <h4 className="cv-section-title">Contact Info</h4>
              <textarea name="contactInfo" placeholder="Phone, Email, Address..." className="cv-side-input" onChange={handleChange}></textarea>
            </div>

            <div className="cv-section">
              <h4 className="cv-section-title">Tools Skill</h4>
              <textarea name="toolsSkill" placeholder="Figma, Photoshop..." className="cv-side-input" onChange={handleChange}></textarea>
            </div>

            <div className="cv-section">
              <h4 className="cv-section-title">Soft Skills</h4>
              <textarea name="softSkill" placeholder="Teamwork..." className="cv-side-input" onChange={handleChange}></textarea>
            </div>

            <div className="cv-section">
              <h4 className="cv-section-title">Education</h4>
              <textarea name="education" placeholder="University..." className="cv-side-input large" onChange={handleChange}></textarea>
            </div>
          </aside>

          <main className="cv-right-main">
            <div className="cv-form-group"><label>Your Real Name</label><input type="text" name="realName" onChange={handleChange} /></div>
            <div className="cv-form-group"><label>Field / Position</label><input type="text" name="field" onChange={handleChange} /></div>
            <div className="cv-form-group"><label>About You</label><textarea name="about" rows="5" onChange={handleChange}></textarea></div>
            <div className="cv-section">
              <h4 className="cv-section-title">Professional Experience</h4>
              <textarea name="experience" className="cv-main-textarea" onChange={handleChange}></textarea>
            </div>
            <div className="cv-form-group"><label>CV Title</label><input type="text" name="cvTitle" onChange={handleChange} /></div>

            <div className="cv-actions">
              <button className="btn-review-cv" onClick={() => setShowPreview(true)}>
                <Eye size={18} /> Review
              </button>
              <button className="btn-save-cv" onClick={() => alert('CV Saved!')}>
                Save CV
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateCV;