import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, UserCog, Activity, Library,
    ShieldCheck, ClipboardList, MessageSquare, Gift,
    Menu, X, Bell, ChevronDown, ArrowLeft,
    Plus, Edit, Trash2, Users, Briefcase, Building
} from 'lucide-react';
import '../components/JobPosts.css';
import adminApi from '../services/adminApi';

const JobPosts = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Data State
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getJobPosts();
            setJobs(data);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Failed to load job posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job post?')) {
            try {
                await adminApi.deleteJobPost(id);
                // Optimistically update or refetch
                setJobs(jobs.filter(job => job.id !== id));
            } catch (err) {
                alert("Failed to delete job post.");
            }
        }
    };


    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newJob, setNewJob] = useState({ title: '', company: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const createdJob = await adminApi.createJobPost(newJob);
            setJobs([createdJob, ...jobs]);
            setShowAddModal(false);
            setNewJob({ title: '', company: '' });
        } catch (err) {
            console.error("Create Job Error:", err);
            alert("Failed to create job. Ensure you have Recruiter permissions.");
        }
    };

    return (
        <div className="job-posts-container">
            {/* ... Sidebar and other existing code ... */}
            {/* Same Sidebars as before... skipping to Main Content update to keep context minimal if possible, but replace_file_content needs context. */}
            {/* Actually, I need to wrap the WHOLE return to be safe or target specific blocks. */}
            {/* Let's target the btn-add-job and the end of file to insert modal. */}

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
                        <button className="btn-add-job" onClick={() => setShowAddModal(true)}>
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
                                                    <button className="action-btn btn-delete" onClick={() => handleDelete(job.id)}><Trash2 size={16} /></button>
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

            {/* --- ADD JOB MODAL --- */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Job Post</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label>Job Title</label>
                                <div className="input-with-icon">
                                    <Briefcase size={18} className="input-icon" />
                                    <input
                                        className="modern-input"
                                        name="title"
                                        placeholder="e.g. Senior Product Designer"
                                        required
                                        value={newJob.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Company Name</label>
                                <div className="input-with-icon">
                                    <Building size={18} className="input-icon" />
                                    <input
                                        className="modern-input"
                                        name="company"
                                        placeholder="e.g. Acme Corp"
                                        required
                                        value={newJob.company}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Create Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPosts;
