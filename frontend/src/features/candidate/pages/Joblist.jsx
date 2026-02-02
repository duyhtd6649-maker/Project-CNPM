import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Bookmark, MessageCircle, ChevronLeft, ChevronRight,
    ArrowRight, Briefcase, LogOut, MoreHorizontal, Bell, FileText, User
} from 'lucide-react';
import CandidateNavbar from '../components/CandidateNavbar';
import axiosClient from '../../../infrastructure/http/axiosClient';
import '../components/HomepageCandidates.css';
import '../components/Joblist.css';

const JobBrowsing = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [allJobs, setAllJobs] = useState([]);
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

    // Fetch jobs từ API
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axiosClient.get('/api/search/job/');
                // Transform data từ API sang format hiển thị
                const formattedJobs = response.data.map(job => ({
                    id: job.id,
                    role: job.title,
                    company: job.company || 'Unknown Company',
                    location: job.location || 'Remote',
                    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'C')}&background=6366f1&color=fff&size=100`,
                    tags: job.skill || [],
                    salary: formatSalary(job.salary_min, job.salary_max),
                    description: job.description
                }));
                setAllJobs(formattedJobs);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Không thể tải danh sách công việc. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allJobs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentJobs = allJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Xử lý Dark Mode
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    return (
        <div className="hp-container">
            <CandidateNavbar />
            <div className="bg-mesh">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="layout-wrapper" style={{ height: 'calc(100vh - 80px)' }}>

                <aside className="sidebar glass-panel">
                    <div className="sidebar-top">
                        <nav className="nav-menu">
                            <p className="menu-label">Menu</p>
                            <a href="#" className="nav-link active">
                                <Search size={22} className="filled" />
                                Find Jobs
                            </a>

                            <div className="sidebar-profile-section" style={{ marginTop: '20px', padding: '10px', backgroundColor: 'var(--surface-white)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <div className="user-profile-top" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundImage: "url('https://i.pravatar.cc/150?img=32')", backgroundSize: 'cover' }}></div>
                                    <div className="user-info">
                                        <p className="user-name" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Alex Morgan</p>
                                        <p className="user-role" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Product Designer</p>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="sidebar-bottom">
                        <div className="divider"></div>
                        <button className="logout-btn" style={{ width: '100%', padding: '10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <LogOut size={20} />
                            <span>Log out</span>
                        </button>
                    </div>
                </aside>

                <main className="main-content">
                    <header className="top-header">
                        <div className="header-inner">
                            <div className="header-top">
                                <div className="header-title">
                                    <h1>Explore {allJobs.length}+ Opportunities</h1>
                                </div>
                                <label className="search-bar">
                                    <Search size={20} className="search-icon" />
                                    <input type="text" placeholder="Search by job title, skill, or keyword" />
                                </label>
                            </div>

                            <div className="filters-row">
                                <button className="filter-chip active">All Jobs</button>
                                <button className="filter-chip">Category <span className="material-symbols-outlined">keyboard_arrow_down</span></button>
                                <button className="filter-chip">Job Type <span className="material-symbols-outlined">keyboard_arrow_down</span></button>
                                <button className="filter-chip">Location <span className="material-symbols-outlined">keyboard_arrow_down</span></button>
                                <button className="filter-chip">Salary Range <span className="material-symbols-outlined">keyboard_arrow_down</span></button>
                                <div className="filter-divider"></div>
                                <button className="clear-filter">Clear All</button>
                            </div>
                        </div>
                    </header>

                    <div className="content-scroll">
                        <div className="jobs-container">
                            {isLoading && (
                                <div className="loading-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div className="loading-spinner" style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                                    <p style={{ color: 'var(--text-secondary)' }}>Đang tải danh sách công việc...</p>
                                </div>
                            )}
                            {error && (
                                <div className="error-state" style={{ textAlign: 'center', padding: '60px 20px', color: '#dc2626' }}>
                                    <p>{error}</p>
                                    <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Thử lại</button>
                                </div>
                            )}
                            {!isLoading && !error && allJobs.length === 0 && (
                                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Chưa có công việc nào được đăng.</p>
                                </div>
                            )}
                            {!isLoading && !error && allJobs.length > 0 && (
                                <div className="jobs-grid">
                                    {currentJobs.map((job) => (
                                        <div key={job.id} className="job-card group">
                                            <div className="card-hover-line"></div>
                                            <div className="card-header">
                                                <div className="company-logo-box">
                                                    {job.isAiLogo ? (
                                                        <div className="ai-logo">AI</div>
                                                    ) : (
                                                        <img src={job.logo} alt={`${job.company} Logo`} />
                                                    )}
                                                </div>
                                                <button className="bookmark-btn">
                                                    <Bookmark size={20} />
                                                </button>
                                            </div>

                                            <div className="card-body">
                                                <h3>{job.role}</h3>
                                                <p className="company-location">{job.company} • {job.location}</p>
                                                <div className="tags-list">
                                                    {job.tags.map((tag, index) => (
                                                        <span key={index} className="tag">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="card-footer">
                                                <p className="salary">{job.salary} <span>/ year</span></p>
                                                <button
                                                    className="details-btn"
                                                    onClick={() => navigate(`/view-job/${job.id}`)}
                                                >
                                                    Details <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pagination-wrapper">
                                <nav className="pagination">
                                    <button
                                        className="page-btn icon-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <div className="page-numbers">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="page-btn icon-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </nav>
                            </div>
                            <div className="pagination-info">
                                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, allJobs.length)} of {allJobs.length} results
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default JobBrowsing;