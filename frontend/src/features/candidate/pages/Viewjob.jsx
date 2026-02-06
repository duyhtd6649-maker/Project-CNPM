import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../components/Viewjob.css';
import CandidateNavbar from '../components/CandidateNavbar';
import axiosClient from '../../../infrastructure/http/axiosClient';
import {
    Search, ChevronRight, Clock, Globe, Banknote, MapPin,
    CheckCircle, Send, Bookmark, Briefcase, ArrowLeft
} from 'lucide-react';


const JobDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    tags: data.skill || data.skills || [],
                    salary: formatSalary(data.salary_min, data.salary_max),
                    description: data.description || '',
                    salary_min: data.salary_min,
                    salary_max: data.salary_max
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

                <aside className="sidebar">
                    <div
                        className="card profile-card"
                        onClick={() => navigate('/job-list')}
                        style={{ cursor: 'pointer' }}
                        title="Back to Job List"
                    >
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '100%' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                                transition: 'all 0.2s'
                            }} className="back-icon-circle">
                                <ArrowLeft size={32} />
                            </div>
                            <span style={{
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                fontSize: '0.9rem'
                            }}>Back to Job List</span>
                        </div>
                    </div>


                </aside>

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
                                        <div className="text-content">
                                            <p>We are looking for an experienced {displayJob.role} to join our innovative technology team at {displayJob.company}. The ideal candidate will have a strong background in developing scalable applications and a passion for creating seamless user experiences.</p>
                                            <p>In this role, you will lead the development of new features, mentor junior developers, and collaborate with product managers and designers to deliver high-quality solutions.</p>
                                        </div>
                                    </section>

                                    <section className="section-block">
                                        <h3 className="section-title">Key Requirements</h3>
                                        <ul className="requirements-list">
                                            <li><CheckCircle size={16} className="check-icon" /> 5+ years of experience in software development with JavaScript/TypeScript and React.</li>
                                            <li><CheckCircle size={16} className="check-icon" /> Strong understanding of backend technologies (Node.js, Python, or Go).</li>
                                            <li><CheckCircle size={16} className="check-icon" /> Experience with cloud platforms like AWS or Azure.</li>
                                            <li><CheckCircle size={16} className="check-icon" /> Excellent problem-solving skills and ability to work in an agile environment.</li>
                                        </ul>
                                    </section>
                                </div>

                                <div className="job-action-col">
                                    <div className="action-box">
                                        <h4>Interested?</h4>
                                        <button className="btn btn-primary">
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
        </div >
    );
};

export default JobDetail;