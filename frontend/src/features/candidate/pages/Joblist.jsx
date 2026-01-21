import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Bookmark, MessageCircle, ChevronLeft, ChevronRight,
    ArrowRight, Briefcase, LogOut, MoreHorizontal, Bell, FileText, User
} from 'lucide-react';
import CandidateNavbar from '../components/CandidateNavbar';
import '../components/Joblist.css';

const JobBrowsing = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const allJobs = [
        {
            id: 1, role: "Senior UI Designer", company: "Stripe", location: "San Francisco, CA",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
            tags: ["Remote", "Full-time", "Senior Level"], salary: "$120k - $150k"
        },
        {
            id: 2, role: "Product Manager", company: "Airbnb", location: "New York, NY",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
            tags: ["On-site", "Full-time"], salary: "$140k - $180k"
        },
        {
            id: 3, role: "Frontend Developer", company: "Spotify", location: "Austin, TX",
            logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
            tags: ["Remote", "Contract"], salary: "$110k - $135k"
        },
        {
            id: 4, role: "Machine Learning Engineer", company: "Anthropic", location: "San Francisco, CA",
            isAiLogo: true, tags: ["Hybrid", "Full-time"], salary: "$220k - $280k"
        },
        {
            id: 5, role: "Content Strategist", company: "Netflix", location: "Los Angeles, CA",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
            tags: ["On-site", "Full-time"], salary: "$130k - $160k"
        },
        {
            id: 6, role: "UX Researcher", company: "Slack", location: "Denver, CO",
            logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
            tags: ["Remote", "Full-time"], salary: "$115k - $145k"
        },
        // Page 2 Data
        {
            id: 7, role: "Senior Backend Engineer", company: "Google", location: "Mountain View, CA",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            tags: ["Hybrid", "Full-time"], salary: "$180k - $240k"
        },
        {
            id: 8, role: "Data Scientist", company: "Meta", location: "Menlo Park, CA",
            logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
            tags: ["On-site", "Full-time"], salary: "$160k - $210k"
        },
        {
            id: 9, role: "DevOps Engineer", company: "Amazon", location: "Seattle, WA",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            tags: ["Remote", "Full-time"], salary: "$140k - $190k"
        },
        {
            id: 10, role: "Mobile Developer (iOS)", company: "Apple", location: "Cupertino, CA",
            logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
            tags: ["On-site", "Contract"], salary: "$150k - $200k"
        },
        {
            id: 11, role: "Cybersecurity Analyst", company: "Microsoft", location: "Redmond, WA",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            tags: ["Hybrid", "Full-time"], salary: "$130k - $170k"
        },
        {
            id: 12, role: "Cloud Architect", company: "IBM", location: "Armonk, NY",
            logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
            tags: ["Remote", "Full-time"], salary: "$160k - $220k"
        }
    ];

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
        <div className="app-container" style={{ flexDirection: 'column' }}>
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
                                    <h1>Explore 1,240+ Opportunities</h1>
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
                                                onClick={() => navigate('/view-job', { state: { job } })}
                                            >
                                                Details <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

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