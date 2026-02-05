import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, UserCog, Activity, Library,
    ShieldCheck, ClipboardList, MessageSquare, Gift,
    Menu, X, Bell, ChevronDown, ArrowLeft,
    Plus, Edit, Trash2, Users
} from 'lucide-react';
import '../components/JobPosts.css';
import adminApi from '../services/adminApi';

const JobPosts = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Data State
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const fetchJobs = async () => {
        setLoading(true);
        const data = await adminApi.getJobPosts();
        setJobs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="job-posts-container">
            {/* --- Main Sidebar --- */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header-uth">
                    <div className="uth-branding" onClick={() => navigate('/admin')}>
                        <span className="uth-blue-text">UTH</span>
                        <span className="workplace-green-text"> WORKPLACE</span>
                    </div>
                    <button className="close-sidebar-btn" onClick={toggleSidebar}><X size={24} /></button>
                </div>
                <nav className="sidebar-nav-custom">
                    <div className="nav-item-custom" onClick={() => navigate('/admin')}><LayoutDashboard size={20} /> <span>Dashboard</span></div>

                    <div className="sidebar-divider-text">ACCOUNT MANAGEMENT</div>
                    <div className="nav-item-custom" onClick={() => navigate('/manage-internal')}><UserCog size={20} /> <span>Manage Account</span></div>

                    <div className="sidebar-divider-text">FEATURES</div>
                    <div className="nav-item-custom"><Activity size={20} /> <span>Monitor Logs & Analytics</span></div>
                    <div className="nav-item-custom"><Library size={20} /> <span>Cabinets of Knowledge</span></div>
                    <div className="nav-item-custom active" onClick={() => navigate('/system-status')}><ShieldCheck size={20} /> <span>System Status Monitor</span></div>
                    <div className="nav-item-custom"><ClipboardList size={20} /> <span>System Reports</span></div>
                    <div className="nav-item-custom"><MessageSquare size={20} /> <span>Articles Management</span></div>
                    <div className="nav-item-custom"><Gift size={20} /> <span>User Package Management</span></div>
                </nav>
            </aside>

            {/* --- Secondary Sidebar --- */}
            <aside className="manage-left-sidebar">
                <div className="sidebar-blue-header">
                    <button className="header-menu-btn-white" onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: 'white' }}><Menu size={20} /></button>
                    <div className="uth-branding" style={{ color: 'white' }}>
                        <span>SYSTEM</span><span> MONITOR</span>
                    </div>
                </div>

                <nav className="sub-nav-list">
                    <div className="sub-nav-item" onClick={() => navigate('/system-status')}>
                        <Activity size={18} /> Monitor System Status
                    </div>

                    <div className="sub-nav-item active">
                        <ClipboardList size={18} /> Monitor Job Post
                    </div>
                </nav>

                <div className="sub-sidebar-footer">
                    <div className="sub-nav-item" onClick={() => navigate('/admin')}>
                        <ArrowLeft size={18} style={{ marginRight: '10px' }} /> Back to menu
                    </div>
                    <div className="divider-sub"></div>
                    <div className="sub-nav-item-small">Admin Profile</div>
                    <div className="sub-nav-item logout-sub">Logout</div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <div className="job-right-content">
                <header className="job-top-header">
                    <div className="header-right-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="notification" style={{ position: 'relative' }}>
                            <Bell size={22} color="#64748b" />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>3</span>
                        </div>
                        <div className="user-account-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '35px', height: '35px', background: '#e2e8f0', borderRadius: '50%' }}></div>
                            <ChevronDown size={16} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                <main className="job-view-area">
                    <div className="job-view-header">
                        <h2>Job Posts Management</h2>
                        <button className="btn-add-job">
                            <Plus size={18} /> Add New Job Post
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading job posts...</div>
                    ) : (
                        <div className="job-table-card">
                            <table className="job-table">
                                <thead>
                                    <tr>
                                        <th>Job Detail</th>
                                        <th>Posted Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id}>
                                            <td>
                                                <span className="job-title-cell">{job.title}</span>
                                                <span className="job-company-cell">{job.company}</span>
                                            </td>
                                            <td>{job.postedDate}</td>
                                            <td>
                                                <span className={`status-chip ${job.status === 'Active' ? 'status-active' : job.status === 'Closed' ? 'status-closed' : 'status-draft'}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-btn-group">
                                                    <button className="action-btn btn-edit"><Edit size={16} /></button>
                                                    <button className="action-btn btn-delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobPosts;
