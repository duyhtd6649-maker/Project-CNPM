import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  UserCircle,
  FileText,
  Download,
  Eye,
  Trash2,
  Plus,
  Loader,
  X
} from 'lucide-react';
// html2canvas và jspdf sẽ được import động khi cần
import CandidateNavbar from '../components/CandidateNavbar';
import axiosClient from '../../../infrastructure/http/axiosClient';
import '../components/HomepageCandidates.css';
import '../components/SavedCV.css';
import '../components/CreateCV.css';

const SavedCV = () => {
  const navigate = useNavigate();
  const [cvList, setCvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCV, setPreviewCV] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef(null);

  // Load saved CVs from API on mount
  useEffect(() => {
    const fetchCVs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get('cv/list/');
        setCvList(response.data || []);
      } catch (err) {
        console.error('Error fetching CVs:', err);
        // Fallback to localStorage if API fails
        const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
        setCvList(savedCVs);
        // Chỉ hiện lỗi nếu không có dữ liệu từ localStorage
        if (savedCVs.length === 0) {
          setError('Không thể tải danh sách CV. Vui lòng thử lại.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCVs();
  }, []);

  // Delete a CV
  const handleDeleteCV = async (cvId) => {
    if (!window.confirm('Bạn có chắc muốn xóa CV này?')) return;

    try {
      // Thử xóa từ API trước
      await axiosClient.delete(`/api/cv/${cvId}/delete/`);
      setCvList(prev => prev.filter(cv => cv.id !== cvId));
    } catch (err) {
      console.error('Error deleting CV from API:', err);
      // Nếu API fail, xóa từ localStorage
      try {
        const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
        const updatedCVs = savedCVs.filter(cv => cv.id !== cvId);
        localStorage.setItem('savedCVs', JSON.stringify(updatedCVs));
        setCvList(prev => prev.filter(cv => cv.id !== cvId));
      } catch (localErr) {
        console.error('Error deleting CV from localStorage:', localErr);
        alert('Không thể xóa CV. Vui lòng thử lại.');
      }
    }
  };

  // Preview CV - mở modal xem trước CV
  const handlePreviewCV = (cv) => {
    setPreviewCV(cv);
    setShowPreview(true);
  };

  // Đóng modal preview
  const closePreview = () => {
    setShowPreview(false);
    setPreviewCV(null);
  };

  // Download CV as PDF
  const handleDownloadPDF = async (cv) => {
    // Nếu CV có file URL từ server, tải trực tiếp
    if (cv.fileUrl || cv.file_url || cv.file) {
      const fileUrl = cv.fileUrl || cv.file_url || cv.file;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${cv.file_name || cv.title || 'CV'}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Nếu CV từ API, lấy chi tiết để lấy file URL
    if (cv.id) {
      try {
        setIsDownloading(true);
        const response = await axiosClient.get(`/api/cv/${cv.id}/`);
        const cvDetail = response.data;

        if (cvDetail.file) {
          const link = document.createElement('a');
          link.href = cvDetail.file;
          link.download = `${cvDetail.file_name || 'CV'}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setIsDownloading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching CV file:', err);
        setIsDownloading(false);
      }
    }

    // Nếu không có file URL, tạo PDF từ modal preview
    setPreviewCV(cv);
    setShowPreview(true);
    setIsDownloading(true);

    // Đợi modal render xong (tăng thời gian chờ)
    setTimeout(async () => {
      try {
        const element = previewRef.current;
        if (!element) {
          throw new Error('Preview element not found');
        }

        // Dynamic import để tránh lỗi resolve
        const html2canvasModule = await import('html2canvas');
        const html2canvas = html2canvasModule.default;

        const jspdfModule = await import('jspdf');
        const jsPDF = jspdfModule.jsPDF || jspdfModule.default;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`${cv.title || cv.realName || 'CV'}.pdf`);

        setIsDownloading(false);
      } catch (err) {
        console.error('Error generating PDF:', err);
        alert('Không thể tải CV. Lỗi: ' + err.message);
        setIsDownloading(false);
      }
    }, 1000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="hp-container">
      <CandidateNavbar />

      {/* Modal Preview CV */}
      {showPreview && previewCV && (
        <div className="cv-preview-overlay" onClick={closePreview}>
          <div className="cv-preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-preview-btn" onClick={closePreview}>
              <X size={20} />
            </button>

            <div ref={previewRef} className="preview-paper-layout">
              {/* Cột trái */}
              <div className="preview-left-col">
                <div className="preview-avatar-circle">
                  {previewCV.avatar ? (
                    <img src={previewCV.avatar} alt="Avatar" />
                  ) : (
                    <UserCircle size={100} color="#ccc" />
                  )}
                </div>
                <div className="preview-side-content">
                  <h5 className="preview-side-title">Contact</h5>
                  <p className="pre-wrap">{previewCV.contactInfo || "Chưa nhập thông tin liên hệ"}</p>

                  <h5 className="preview-side-title">Tools Skill</h5>
                  <p className="pre-wrap">{previewCV.toolsSkill || "Chưa nhập kỹ năng công cụ"}</p>

                  <h5 className="preview-side-title">Soft Skills</h5>
                  <p className="pre-wrap">{previewCV.softSkill || "Chưa nhập kỹ năng mềm"}</p>

                  <h5 className="preview-side-title">Education</h5>
                  <p className="pre-wrap">{previewCV.education || "Chưa nhập thông tin học vấn"}</p>
                </div>
              </div>

              {/* Cột phải */}
              <div className="preview-right-col">
                <h1 className="preview-name">{previewCV.realName || "Họ và Tên"}</h1>
                <p className="preview-field">{previewCV.field || "Vị trí ứng tuyển"}</p>

                <div className="preview-main-section">
                  <h5 className="preview-main-title">About Me</h5>
                  <p className="pre-wrap">{previewCV.about || "Chưa nhập phần giới thiệu bản thân"}</p>
                </div>

                <div className="preview-main-section">
                  <h5 className="preview-main-title">Experience</h5>
                  <p className="pre-wrap">{previewCV.experience || "Chưa nhập kinh nghiệm làm việc"}</p>
                </div>
              </div>
            </div>

            {/* Nút Download trong modal */}
            {!isDownloading && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
                paddingBottom: '10px'
              }}>
                <button
                  className="btn-save-cv"
                  onClick={() => handleDownloadPDF(previewCV)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Download size={18} /> Tải CV (PDF)
                </button>
              </div>
            )}
            {isDownloading && (
              <div style={{ textAlign: 'center', marginTop: '20px', color: '#6366f1' }}>
                <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                <p>Đang tạo file PDF...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="saved-cv-body">
        <aside className="saved-cv-sidebar">
          <div className="sidebar-item" onClick={() => navigate('/homepage')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item" onClick={() => navigate('/profile')}>
            <UserCircle size={20} />
            <span>My Profile</span>
          </div>
          <div className="sidebar-item active">
            <FileText size={20} />
            <span>Saved CVs</span>
          </div>
        </aside>
        <main className="saved-cv-main">
          <h1 className="main-title">Saved CVs</h1>

          <div className="cv-grid">
            <div className="create-new-card" onClick={() => navigate('/create-cv')}>
              <Plus className="plus-icon" />
              <span className="create-text">Create New CV</span>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="no-cv-message" style={{
                gridColumn: 'span 3',
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-secondary)'
              }}>
                <Loader size={48} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
                <p>Đang tải danh sách CV...</p>
              </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
              <div className="no-cv-message" style={{
                gridColumn: 'span 3',
                textAlign: 'center',
                padding: '40px',
                color: '#dc2626'
              }}>
                <p>⚠️ {error}</p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && cvList.length === 0 && (
              <div className="no-cv-message" style={{
                gridColumn: 'span 3',
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-secondary)'
              }}>
                <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Bạn chưa có CV nào được lưu.</p>
                <p style={{ fontSize: '0.9rem' }}>Click "Create New CV" để tải lên CV mới.</p>
              </div>
            )}
            {cvList.map((cv) => (
              <article key={cv.id} className="cv-card">
                <div className="cv-preview" style={{
                  backgroundColor: '#f0f0ff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  minHeight: '150px'
                }}>
                  <UserCircle size={60} color="#6366f1" style={{ opacity: 0.5 }} />
                  <span style={{ marginTop: '8px', fontWeight: 600, color: '#6366f1' }}>
                    {cv.file_name ? cv.file_name.replace('.pdf', '') : (cv.realName || 'No Name')}
                  </span>
                </div>

                <div className="cv-info">
                  <h3 className="cv-title" title={cv.file_name || cv.title}>
                    {cv.file_name || cv.title || cv.cvTitle || `CV - ${cv.realName}`}
                  </h3>
                  <p className="cv-meta">Created: {formatDate(cv.createdAt || cv.created_date)}</p>
                  <p className="cv-meta">Size: {cv.file_size ? `${(cv.file_size / 1024).toFixed(1)} KB` : 'N/A'}</p>
                </div>

                <div className="cv-actions">
                  <button className="action-btn" onClick={() => handlePreviewCV(cv)}>
                    <Eye />
                    <span>Preview</span>
                  </button>
                  <button className="action-btn" onClick={() => handleDownloadPDF(cv)}>
                    <Download />
                    <span>Download</span>
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteCV(cv.id)}>
                    <Trash2 />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SavedCV;