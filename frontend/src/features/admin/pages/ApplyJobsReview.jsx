import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AppProviders';
import {
    LayoutDashboard, UserCog, ClipboardList,
    Menu, X, Bell, ChevronDown, Search, Filter,
    FileText, User, Calendar, Briefcase, Building,
    Eye, CheckCircle, XCircle, LogOut, Check, X as XIcon
} from 'lucide-react';
import axiosClient from '../../../infrastructure/http/axiosClient';
import '../components/ApplyJobsReview.css';

const ApplyJobsReview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State for real data
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [processingId, setProcessingId] = useState(null); // To track which app is being updated

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Fetch Applications from API
    const fetchApplications = async () => {
        try {
            setLoading(true);
            // Using the search endpoint to get all applications (can add filters if needed)
            const response = await axiosClient.get('/applications/search/');

            // Map API data to component state structure
            const mappedData = response.data.map(app => ({
                id: app.id,
                candidateName: app.user_name || 'Unknown Candidate',
                role: app.job_title || 'Unknown Role',
                company: app.company || 'Unknown Company',
                dateApplied: new Date(app.created_date).toLocaleDateString(),
                status: app.system_status, // Ensure API returns 'Pending', 'Approved', 'Rejected', etc.
                email: app.user_email || 'N/A',
                phone: app.user_phone || 'N/A',
                cvsid: app.cvsid
            }));

            setApplications(mappedData);
            setError(null);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError("Failed to load applications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Handle Approve/Reject
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            setProcessingId(id);
            // Call API to update status
            await axiosClient.put(`/applications/${id}/UpdateStatus/`, {
                new_status: newStatus
            });

            // Update local state to reflect change
            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));

            // If the updated app is currently selected in modal, update it too
            if (selectedApp && selectedApp.id === id) {
                setSelectedApp(prev => ({ ...prev, status: newStatus }));
            }

            // Optional: Close modal if open
            // setSelectedApp(null); 
        } catch (err) {
            console.error(`Error updating status to ${newStatus}:`, err);
            alert(`Failed to update status. ${err.response?.data?.error || ''}`);
        } finally {
            setProcessingId(null);
        }
    };

    // Filter Logic
    const filteredApps = applications.filter(app => {
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.company.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const renderStatusBadge = (status) => {
        const statusClass = status?.toLowerCase() || 'pending';
        return <span className={`status-badge ${statusClass}`}>{status}</span>;
    };

    return (
        <div className="apply-jobs-container">
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
                    <div className="nav-item-custom" onClick={() => navigate('/job-posts')}>
                        <ClipboardList size={20} /> <span>Job Posts Review</span>
                    </div>
                    <div className="nav-item-custom active">
                        <FileText size={20} /> <span>Apply Jobs Review</span>
                    </div>

                    <div className="nav-group-label">MANAGEMENT</div>
                    <div className="nav-item-custom" onClick={() => navigate('/manage-candidate')}>
                        <UserCog size={20} /> <span>Candidates</span>
                    </div>
                    <div className="nav-item-custom" onClick={() => navigate('/manage-recruiter')}>
                        <UserCog size={20} /> <span>Recruiters</span>
                    </div>
                    <div className="nav-item-custom" onClick={() => navigate('/manage-internal')}>
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
            <main className="apply-jobs-main">
                {/* Header */}
                <header className="apply-jobs-header">
                    <button className="menu-btn-mobile" onClick={toggleSidebar}><Menu size={24} /></button>
                    <div className="header-left">
                        <h2>Apply Jobs Review</h2>
                        <p className="header-subtitle">Track and manage job applications.</p>
                    </div>
                    <div className="header-right-actions">
                        <div className="notification">
                            <Bell size={22} />
                            <span className="badge">5</span>
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
                <div className="apply-jobs-content">
                    {/* Toolbar */}
                    <div className="toolbar-container">
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                placeholder="Search Candidate, Job Title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-box">
                            <Filter size={18} className="filter-icon" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Hired">Hired</option>
                            </select>
                        </div>
                    </div>

                    {/* Applications List */}
                    <div className="applications-list">
                        {loading ? (
                            <div className="empty-state">
                                <p>Loading applications...</p>
                            </div>
                        ) : error ? (
                            <div className="empty-state">
                                <p style={{ color: 'red' }}>{error}</p>
                            </div>
                        ) : filteredApps.length > 0 ? (
                            filteredApps.map(app => (
                                <div key={app.id} className="application-card">
                                    <div className="app-info-group">
                                        <div className="candidate-avatar">
                                            {app.candidateName.charAt(0)}
                                        </div>
                                        <div className="app-details">
                                            <h4>{app.candidateName}</h4>
                                            <div className="app-meta">
                                                <Calendar size={13} /> {app.dateApplied}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="job-info-group">
                                        <div className="job-title"><Briefcase size={14} /> {app.role}</div>
                                        <div className="company-name"><Building size={14} /> {app.company}</div>
                                    </div>

                                    <div className="status-group">
                                        {renderStatusBadge(app.status)}
                                    </div>

                                    <div className="actions-group">
                                        <button className="btn-view-app" onClick={() => setSelectedApp(app)}>
                                            <Eye size={16} /> View
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <FileText size={48} />
                                <p>No applications found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- MODAL: VIEW APPLICATION DETAILS --- */}
            {selectedApp && (
                <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
                    <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-box">
                                <h2>Application Details</h2>
                                <div className="modal-subtitle">
                                    ID: #{selectedApp.id.substring(0, 8)}... <span className="dot-separator">•</span> {renderStatusBadge(selectedApp.status)}
                                </div>
                            </div>
                            <button className="close-modal-btn" onClick={() => setSelectedApp(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body-scroll">
                            <div className="detail-row">
                                <div className="detail-item">
                                    <label>Candidate Name</label>
                                    <p>{selectedApp.candidateName}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Applied Date</label>
                                    <p>{selectedApp.dateApplied}</p>
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-item">
                                    <label>Applied For Role</label>
                                    <p>{selectedApp.role}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Company</label>
                                    <p>{selectedApp.company}</p>
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-item">
                                    <label>Email</label>
                                    <p>{selectedApp.email}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Phone</label>
                                    <p>{selectedApp.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer-actions">
                            {/* Review Actions - Only show if Pending or can be changed */}
                            <button
                                className="btn-secondary"
                                style={{ borderColor: '#EF4444', color: '#EF4444' }}
                                onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                                disabled={processingId === selectedApp.id}
                            >
                                {processingId === selectedApp.id ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                                className="btn-primary"
                                style={{ backgroundColor: '#10B981' }}
                                onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                                disabled={processingId === selectedApp.id}
                            >
                                {processingId === selectedApp.id ? 'Processing...' : 'Approve'}
                            </button>
                            <div style={{ width: '20px' }}></div> {/* Spacer */}
                            <button className="btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
                            {/* <button className="btn-primary">Download CV</button> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyJobsReview;
