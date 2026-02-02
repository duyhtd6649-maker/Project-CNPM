import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle, Camera, X, Eye, Upload, FileText, CheckCircle
} from 'lucide-react';
import CandidateNavbar from '../components/CandidateNavbar';
import axiosClient from '../../../infrastructure/http/axiosClient';
import "../components/HomepageCandidates.css";
import "../components/CreateCV.css";


const CreateCV = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

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

  // Handle PDF file selection
  const handlePdfSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedPdf(file);
        setUploadError(null);
        setUploadSuccess(false);
      } else {
        setUploadError('Vui lòng chọn file PDF');
        setSelectedPdf(null);
      }
    }
  };

  // Upload CV to backend
  const handleUploadCV = async () => {
    if (!selectedPdf) {
      setUploadError('Vui lòng chọn file CV (PDF)');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedPdf);

      const response = await axiosClient.post('/cv/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload success:', response.data);
      setUploadSuccess(true);
      setSelectedPdf(null);
      if (pdfInputRef.current) pdfInputRef.current.value = '';

      // Navigate to saved CVs after short delay
      setTimeout(() => {
        navigate('/saved-cv');
      }, 1500);

    } catch (err) {
      console.error('Upload CV error:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);

      let errorMsg = 'Lỗi khi upload CV. Vui lòng thử lại.';

      if (err.response?.status === 401) {
        errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.response?.status === 403) {
        errorMsg = 'Bạn không có quyền upload CV. Hãy đảm bảo bạn đã đăng ký tài khoản Candidate.';
      } else if (err.response?.data?.error) {
        // Handle both string and object errors
        const error = err.response.data.error;
        if (typeof error === 'string') {
          errorMsg = error;
        } else if (typeof error === 'object') {
          // Convert validation errors object to readable string
          errorMsg = Object.entries(error)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
        }
      } else if (err.response?.data) {
        errorMsg = typeof err.response.data === 'string'
          ? err.response.data
          : JSON.stringify(err.response.data);
      }

      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Open PDF file picker
  const openPdfPicker = () => {
    pdfInputRef.current?.click();
  };

  // Save CV form data to localStorage
  const handleSaveCV = () => {
    if (!cvData.realName.trim()) {
      alert('Vui lòng nhập tên của bạn trước khi lưu CV');
      return;
    }

    // Get existing saved CVs from localStorage
    const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');

    // Create new CV entry
    const newCV = {
      id: Date.now(),
      ...cvData,
      createdAt: new Date().toISOString(),
      title: cvData.cvTitle || `CV - ${cvData.realName}`
    };

    // Add to saved CVs
    savedCVs.push(newCV);
    localStorage.setItem('savedCVs', JSON.stringify(savedCVs));

    // Show success and navigate
    alert('CV đã được lưu thành công!');
    navigate('/saved-cv');
  };

  return (
    <div className="hp-container">
      {/* HEADER GIỮ NGUYÊN */}
      <CandidateNavbar />

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
              <button
                className="btn-save-cv"
                onClick={handleSaveCV}
                disabled={isUploading}
              >
                <CheckCircle size={18} /> Save CV
              </button>
            </div>

            {/* Upload CV PDF Section */}
            <div className="cv-upload-section" style={{
              marginTop: '24px',
              padding: '20px',
              backgroundColor: 'rgba(99, 102, 241, 0.05)',
              borderRadius: '12px',
              border: '2px dashed rgba(99, 102, 241, 0.3)'
            }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={20} color="#6366f1" /> Upload CV (PDF)
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Hoặc upload file CV PDF có sẵn của bạn
              </p>

              {/* Hidden PDF input */}
              <input
                type="file"
                ref={pdfInputRef}
                onChange={handlePdfSelect}
                accept=".pdf"
                style={{ display: 'none' }}
              />

              {/* Selected file preview */}
              {selectedPdf && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                  <FileText size={24} color="#6366f1" />
                  <span style={{ flex: 1, fontSize: '0.9rem' }}>{selectedPdf.name}</span>
                  <button
                    onClick={() => { setSelectedPdf(null); if (pdfInputRef.current) pdfInputRef.current.value = ''; }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Error message */}
              {uploadError && (
                <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '12px' }}>
                  ⚠️ {uploadError}
                </div>
              )}

              {/* Success message */}
              {uploadSuccess && (
                <div style={{ color: '#16a34a', fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} /> CV đã được upload thành công! Đang chuyển hướng...
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-review-cv"
                  onClick={openPdfPicker}
                  disabled={isUploading}
                  style={{ flex: 1 }}
                >
                  <FileText size={18} /> Chọn file PDF
                </button>
                <button
                  className="btn-save-cv"
                  onClick={handleUploadCV}
                  disabled={isUploading || !selectedPdf}
                  style={{ flex: 1, opacity: (!selectedPdf || isUploading) ? 0.6 : 1 }}
                >
                  {isUploading ? 'Đang upload...' : 'Upload CV'}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateCV;