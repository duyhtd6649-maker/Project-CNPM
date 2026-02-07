import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AppProviders';
import {
    LayoutDashboard, UserCog, ClipboardList,
    Menu, X, Bell, ChevronDown, Search, Filter,
    Building, User, CheckCircle, XCircle, Clock,
    MapPin, DollarSign, Briefcase, Eye, Calendar, Globe, FileText, LogOut
} from 'lucide-react';
import '../components/JobPosts.css';
import adminApi from '../services/adminApi';

const JobPosts = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Data State ---
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- UI State ---
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null); // State để hiện Modal xem chi tiết

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // --- 1. Fetch Data ---
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getJobPosts();
            // Sort: Pending lên đầu, sau đó đến mới nhất
            const sortedData = data.sort((a, b) => {
                if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                if (a.status !== 'Pending' && b.status === 'Pending') return 1;
                return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
            });
            setJobs(sortedData);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Failed to load job posts. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // --- 2. Action Handlers (Approve / Reject) ---
    const handleStatusChange = async (jobId, newStatus) => {
        const actionName = newStatus === 'Approved' ? 'APPROVE' : 'REJECT';
        if (!window.confirm(`Are you sure you want to ${actionName} this job post?`)) return;

        try {
            // Gọi API cập nhật
            await adminApi.updateJobStatus(jobId, newStatus);

            // Cập nhật State Local để UI đổi màu ngay lập tức
            setJobs(prevJobs => prevJobs.map(job =>
                job.id === jobId ? { ...job, status: newStatus } : job
            ));

            // Nếu đang mở modal thì đóng lại
            if (selectedJob && selectedJob.id === jobId) {
                setSelectedJob(null);
            }
        } catch (err) {
            console.error(`Failed to ${newStatus} job:`, err);
            alert(`Error: Could not ${newStatus.toLowerCase()} this job.`);
        }
    };

    // --- 3. Filter Logic ---
    const filteredJobs = jobs.filter(job => {
        const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // --- 4. Render Helper: Status Badge ---
    const renderStatusBadge = (status) => {
        const statusClass = status?.toLowerCase() || 'pending';
        return <span className={`status-badge ${statusClass}`}>{status || 'Pending'}</span>;
    };

    return (
        <div className="job-posts-container">
            {/* --- SIDEBAR NAVIGATION --- */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header-uth">
                    <div className="uth-branding" onClick={() => navigate('/admin')}>
                        <span className="uth-blue-text">UTH</span>
                        <span className="workplace-green-text"> WORKPLACE</span>
                    </div>
                    <button className="close-sidebar-btn" onClick={toggleSidebar}><X size={24} /></button>
                </div>

                <nav className="sidebar-nav-custom">
                    <div className="nav-group-label">OVERVIEW</div>
                    <div className="nav-item-custom" onClick={() => navigate('/admin')}>
                        <LayoutDashboard size={20} /> <span>Dashboard</span>
                    </div>
                    <div className="nav-item-custom active">
                        <ClipboardList size={20} /> <span>Job Posts Review</span>
                    </div>
                    <div className="nav-item-custom" onClick={() => navigate('/apply-jobs-review')}>
                        <FileText size={20} /> <span>Apply Jobs Review</span>
                    </div>

                    <div className="nav-group-label">MANAGEMENT</div>
                    <div className="nav-item-custom" onClick={() => navigate('/admin/candidates')}>
                        <UserCog size={20} /> <span>Candidates</span>
                    </div>
                    <div className="nav-item-custom" onClick={() => navigate('/admin/recruiters')}>
                        <UserCog size={20} /> <span>Recruiters</span>
                    </div>
                    <div className="nav-item-custom" onClick={() => navigate('/admin/accounts')}>
                        <UserCog size={20} /> <span>Internal Accounts</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item-custom logout">
                        <LogOut size={20} /> <span>Logout</span>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="job-posts-main">
                {/* Header */}
                <header className="job-posts-header">
                    <button className="menu-btn-mobile" onClick={toggleSidebar}><Menu size={24} /></button>
                    <div className="header-left">
                        <h2>Job Post Moderation</h2>
                        <p className="header-subtitle">Review, approve, or reject job postings from recruiters.</p>
                    </div>
                    <div className="header-right-actions">
                        <div className="notification">
                            <Bell size={22} />
                            <span className="badge">3</span>
                        </div>
                        <div className="user-account-box">
                            <div className="avatar-placeholder">{user?.username?.charAt(0) || 'A'}</div>
                            <div className="user-info-text">
                                <span className="user-name">{user?.username || 'Admin'}</span>
                                <span className="user-role">Super Admin</span>
                            </div>
                            <ChevronDown size={16} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="job-posts-content">
                    {/* Toolbar: Search & Filter */}
                    <div className="toolbar-container">
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                placeholder="Search by Job Title or Company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-actions">
                            <div className="filter-box">
                                <Filter size={18} className="filter-icon" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="status-select"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Job Grid List */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading job postings...</p>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map(job => (
                                    <div key={job.id} className={`job-card ${job.status?.toLowerCase() || 'pending'}`}>
                                        <div className="job-card-header">
                                            <div className="company-logo-stub">
                                                <Building size={24} />
                                            </div>
                                            <div className="job-title-group">
                                                <h3>{job.title}</h3>
                                                <span className="company-name">{job.company_name || job.company}</span>
                                            </div>
                                            {renderStatusBadge(job.status)}
                                        </div>

                                        <div className="job-card-info-grid">
                                            <div className="info-item">
                                                <MapPin size={14} /> <span>{job.location || 'N/A'}</span>
                                            </div>
                                            <div className="info-item">
                                                <DollarSign size={14} /> <span>{job.salary_range || 'Negotiable'}</span>
                                            </div>
                                            <div className="info-item">
                                                <Briefcase size={14} /> <span>{job.job_type || 'Full-time'}</span>
                                            </div>
                                            <div className="info-item">
                                                <Clock size={14} /> <span>{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Just now'}</span>
                                            </div>
                                        </div>

                                        <div className="job-card-footer">
                                            <button className="btn-view-details" onClick={() => setSelectedJob(job)}>
                                                <Eye size={16} /> View Details
                                            </button>

                                            {/* Action Buttons (Chỉ hiện Approve/Reject nếu cần thiết) */}
                                            <div className="quick-actions">
                                                <button
                                                    className="btn-icon approve"
                                                    title="Quick Approve"
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(job.id, 'Approved'); }}
                                                    disabled={job.status === 'Approved'}
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    className="btn-icon reject"
                                                    title="Quick Reject"
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(job.id, 'Rejected'); }}
                                                    disabled={job.status === 'Rejected'}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <ClipboardList size={48} />
                                    <p>No job posts found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODAL: VIEW JOB DETAILS (NEW FEATURE) --- */}
            {selectedJob && (
                <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                    <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-box">
                                <h2>{selectedJob.title}</h2>
                                <div className="modal-subtitle">
                                    <Building size={16} /> <span>{selectedJob.company_name || selectedJob.company}</span>
                                    <span className="dot-separator">•</span>
                                    {renderStatusBadge(selectedJob.status)}
                                </div>
                            </div>
                            <button className="close-modal-btn" onClick={() => setSelectedJob(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-scroll">
                            <div className="detail-section">
                                <h4>Overview</h4>
                                <div className="detail-grid-4">
                                    <div className="detail-box">
                                        <span className="label">Location</span>
                                        <p><MapPin size={14} /> {selectedJob.location || 'Unknown'}</p>
                                    </div>
                                    <div className="detail-box">
                                        <span className="label">Salary</span>
                                        <p><DollarSign size={14} /> {selectedJob.salary_min && selectedJob.salary_max
                                            ? `$${selectedJob.salary_min} - $${selectedJob.salary_max}`
                                            : 'Negotiable'}</p>
                                    </div>
                                    <div className="detail-box">
                                        <span className="label">Job Type</span>
                                        <p><Briefcase size={14} /> {selectedJob.job_type || 'Full Time'}</p>
                                    </div>
                                    <div className="detail-box">
                                        <span className="label">Posted By</span>
                                        <p><User size={14} /> {selectedJob.recruiter_name || 'Recruiter'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Job Description</h4>
                                <div className="text-content">
                                    {selectedJob.description || "No description provided."}
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Requirements / Skills</h4>
                                <div className="skills-tags">
                                    {selectedJob.skills ? selectedJob.skills.split(',').map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill.trim()}</span>
                                    )) : <span className="no-skills">No specific skills listed.</span>}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer-actions">
                            <button className="btn-secondary" onClick={() => setSelectedJob(null)}>Close</button>
                            {selectedJob.status !== 'Rejected' && (
                                <button className="btn-danger" onClick={() => handleStatusChange(selectedJob.id, 'Rejected')}>
                                    <XCircle size={18} /> Reject Post
                                </button>
                            )}
                            {selectedJob.status !== 'Approved' && (
                                <button className="btn-primary" onClick={() => handleStatusChange(selectedJob.id, 'Approved')}>
                                    <CheckCircle size={18} /> Approve Post
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPosts;