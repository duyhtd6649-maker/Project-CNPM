import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../components/Viewjob.css';
import CandidateNavbar from '../components/CandidateNavbar';
import axiosClient from '../../../infrastructure/http/axiosClient';
import {
    Search, ChevronRight, Clock, Globe, Banknote, MapPin,
    CheckCircle, Send, Bookmark, Briefcase, ArrowLeft, X, FileText, Loader
} from 'lucide-react';
import '../components/ApplyModal.css';


const JobDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Apply popup states
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [cvList, setCvList] = useState([]);
    const [selectedCV, setSelectedCV] = useState(null);
    const [isLoadingCVs, setIsLoadingCVs] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applyError, setApplyError] = useState(null);
    const [applySuccess, setApplySuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter CVs
    const filteredCVs = cvList.filter(cv =>
        (cv.file_name || cv.title || cv.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format salary từ số thành string hiển thị
    const formatSalary = (min, max) => {
        if (!min && !max) return 'Negotiable';
        const formatNum = (num) => {
            if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
            return `$${num}`;
        };
        if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
        if (min) return `From ${formatNum(min)}`;
        return `Up to ${formatNum(max)}`;
    };

    // Fetch job detail từ API
    useEffect(() => {
        const fetchJobDetail = async () => {
            if (!id) {
                setError('Job ID không hợp lệ');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // Gọi API chi tiết job theo ID
                const response = await axiosClient.get(`/job/${id}/view/`);
                const data = response.data;
                // Transform data từ API sang format hiển thị
                setJob({
                    id: data.id,
                    role: data.title || 'Unknown Job',
                    company: data.company_name || data.company || 'Unknown Company',
                    location: data.location || 'Remote',
                    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.company_name || data.company || 'C')}&background=6366f1&color=fff&size=100`,
                    tags: Array.isArray(data.skill) ? data.skill : (typeof data.skill === 'string' ? data.skill.split(',') : (data.skills || [])),
                    salary: formatSalary(data.salary_min, data.salary_max),
                    description: data.description || '',
                    salary_min: data.salary_min,
                    salary_max: data.salary_max,
                    isAiLogo: data.is_ai_logo || false // Handle potentially missing field
                });
            } catch (err) {
                console.error('Error fetching job detail:', err);
                if (err.response?.status === 404) {
                    setError('Công việc không tồn tại hoặc đã bị xóa.');
                } else {
                    setError('Không thể tải thông tin công việc. Vui lòng thử lại sau.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobDetail();
    }, [id]);

    // Open apply modal and fetch CVs
    const openApplyModal = async () => {
        setShowApplyModal(true);
        setApplyError(null);
        setApplySuccess(false);
        setSelectedCV(null);

        // Fetch CV list
        setIsLoadingCVs(true);
        try {
            const response = await axiosClient.get('/cv/list/');
            // Ensure response.data is an array
            const data = Array.isArray(response.data) ? response.data : [];
            setCvList(data);

            // Sync to localStorage for robustness (optional but helpful)
            if (data.length > 0) {
                localStorage.setItem('savedCVs', JSON.stringify(data));
            }
        } catch (err) {
            console.error('Error fetching CVs:', err);
            // Fallback to localStorage exactly like SavedCV.jsx
            try {
                const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
                if (Array.isArray(savedCVs) && savedCVs.length > 0) {
                    setCvList(savedCVs);
                    // Use a warning message instead of error if we successfully loaded from cache
                    // setApplyError('Using cached CV list due to connection error.'); 
                } else {
                    setApplyError('Không thể tải danh sách CV. Vui lòng thử lại.');
                }
            } catch (storageErr) {
                setApplyError('Không thể tải danh sách CV. Vui lòng thử lại.');
            }
        } finally {
            setIsLoadingCVs(false);
        }
    };

    // Close apply modal
    const closeApplyModal = () => {
        setShowApplyModal(false);
        setApplyError(null);
        setApplySuccess(false);
    };

    // Handle apply job submission
    const handleApply = async () => {
        if (!selectedCV) {
            setApplyError('Vui lòng chọn một CV để ứng tuyển.');
            return;
        }

        setIsSubmitting(true);
        setApplyError(null);

        try {
            await axiosClient.post(`/job/${id}/apply/`, {
                cvsid: selectedCV.id
            });
            setApplySuccess(true);
            // Close modal after 2 seconds
            setTimeout(() => {
                closeApplyModal();
            }, 2000);
        } catch (err) {
            console.error('Error applying job:', err);
            if (err.response?.status === 400) {
                setApplyError(err.response.data?.error || 'Bạn đã ứng tuyển công việc này rồi.');
            } else if (err.response?.status === 403) {
                setApplyError('Bạn không có quyền ứng tuyển. Hãy đảm bảo đã đăng nhập với tài khoản Candidate.');
            } else {
                setApplyError('Lỗi khi ứng tuyển. Vui lòng thử lại.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close modal background click handler
    const handleOverlayClick = (e) => {
        if (e.target.className === 'apply-modal-overlay') {
            closeApplyModal();
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <CandidateNavbar />
                <main className="main-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                        <p style={{ color: 'var(--text-secondary)' }}>Đang tải thông tin công việc...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <CandidateNavbar />
                <main className="main-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: '#dc2626', fontSize: '1.1rem', marginBottom: '16px' }}>{error}</p>
                        <button
                            onClick={() => navigate('/job-list')}
                            style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const displayJob = job;

    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CandidateNavbar />

            <main className="main-layout">



                <section className="content-area">
                    <div className="content-top-bar">
                        <div className="breadcrumb">
                            <button
                                onClick={() => navigate('/job-list')}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)', fontSize: 'inherit' }}
                            >
                                <ArrowLeft size={16} />
                                <span style={{ marginRight: '4px' }}>Jobs</span>
                            </button>
                            <ChevronRight size={16} />
                            <span className="current">{displayJob.role}</span>
                        </div>
                        <div className="job-search">
                            <Search size={20} className="search-icon-lucide" />
                            <input type="text" placeholder="Search Jobs" />
                        </div>
                    </div>
                    <div className="card job-detail-card">
                        <div className="job-hero">
                            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" alt="Office" />
                            <div className="hero-overlay"></div>
                            <div className="hero-content">
                                <div className="company-logo">
                                    {displayJob.isAiLogo ? (
                                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>AI</div>
                                    ) : (
                                        <img src={displayJob.logo} alt="Logo" />
                                    )}
                                </div>
                                <div className="job-title-group">
                                    <h1>{displayJob.role}</h1>
                                    <p>{displayJob.company}</p>
                                </div>
                            </div>
                        </div>

                        <div className="job-body">
                            <div className="job-tags">
                                {displayJob.tags && displayJob.tags.map((tag, index) => (
                                    <span key={index} className="tag blue"><Briefcase size={14} /> {tag}</span>
                                ))}
                                <span className="tag green"><Banknote size={14} /> {displayJob.salary}</span>
                                <span className="tag gray"><MapPin size={14} /> {displayJob.location}</span>
                            </div>

                            <div className="job-grid-layout">
                                <div className="job-description-col">
                                    <section className="section-block">
                                        <h3 className="section-title">Job Description</h3>
                                        <div className="text-content" style={{ whiteSpace: 'pre-line' }}>
                                            {displayJob.description || "No description provided."}
                                        </div>
                                    </section>

                                    <section className="section-block">
                                        <h3 className="section-title">Key Requirements</h3>
                                        <ul className="requirements-list">
                                            {displayJob.tags && displayJob.tags.length > 0 ? (
                                                displayJob.tags.map((skill, index) => (
                                                    <li key={index}>
                                                        <CheckCircle size={16} className="check-icon" /> {skill}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No specific requirements listed.</li>
                                            )}
                                        </ul>
                                    </section>
                                </div>

                                <div className="job-action-col">
                                    <div className="action-box">
                                        <h4>Interested?</h4>
                                        <button className="btn btn-primary" onClick={openApplyModal}>
                                            <span>Apply Now</span>
                                            <Send size={18} />
                                        </button>
                                        <hr className="divider" />
                                        <div className="company-info">
                                            <h5>About the Company</h5>
                                            <p className="company-name">{displayJob.company}</p>
                                            <p className="company-desc">Specializing in manufacturing & engineering, IT solutions.</p>
                                            <a href="#" className="link-primary">View Company Profile</a>
                                        </div>
                                        <div className="job-meta">
                                            <p>Posted 2 days ago</p>
                                            <p>142 applicants</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </section>
            </main>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="apply-modal-overlay" onClick={handleOverlayClick}>
                    <div className="apply-modal-container">
                        <div className="apply-modal-header">
                            <h2>Apply for {displayJob?.role}</h2>
                            <button className="close-button" onClick={closeApplyModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="apply-modal-content">
                            {/* CV Selection */}
                            <div className="form-group">
                                <label className="form-label">Select Resume <span style={{ color: '#dc2626' }}>*</span></label>
                                <input
                                    type="text"
                                    className="cv-search-input"
                                    placeholder="Search your CVs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                {isLoadingCVs ? (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <Loader className="spin-animation" size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                    </div>
                                ) : (
                                    <div className="cv-selection-list">
                                        {filteredCVs.length > 0 ? (
                                            filteredCVs.map(cv => (
                                                <div
                                                    key={cv.id}
                                                    className={`cv-item ${selectedCV?.id === cv.id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedCV(cv)}
                                                >
                                                    <FileText size={20} className="cv-icon" />
                                                    <div className="cv-info">
                                                        <div className="cv-name">{cv.file_name}</div>
                                                    </div>
                                                    {selectedCV?.id === cv.id && <CheckCircle size={18} color="#6366f1" />}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-cvs">
                                                {cvList.length === 0 ? "You haven't uploaded any CVs yet." : "No CVs match your search."}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Cover Letter - Removed */}

                            {/* Messages */}
                            {applyError && (
                                <div className="error-message">
                                    <X size={16} /> {applyError}
                                </div>
                            )}
                            {applySuccess && (
                                <div className="success-message">
                                    <CheckCircle size={16} /> Application sent successfully!
                                </div>
                            )}
                        </div>
                        <div className="apply-modal-footer">
                            <button className="btn-cancel" onClick={closeApplyModal}>Cancel</button>
                            <button
                                className="btn-submit"
                                onClick={handleApply}
                                disabled={isSubmitting || !selectedCV || applySuccess}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Application'}
                                {!isSubmitting && <Send size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default JobDetail;