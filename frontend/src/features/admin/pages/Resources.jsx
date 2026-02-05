import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, MessageSquare, BookOpen,
    ArrowLeft, Bell, ChevronDown, Plus, Download, File,
    UserCog, Activity, ShieldCheck, ClipboardList, Gift, Menu, X, LogOut
} from 'lucide-react';
import '../components/Cabinets.css';

const Resources = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [resources] = useState([
        { id: 1, name: 'Effective Communication Guide.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 24, 2023' },
        { id: 2, name: 'Salary Negotiation Tactics.docx', type: 'DOCX', size: '1.1 MB', date: 'Oct 22, 2023' },
        { id: 3, name: 'Resume Action Verbs Cheat Sheet.pdf', type: 'PDF', size: '800 KB', date: 'Oct 20, 2023' },
        { id: 4, name: 'Interview Prep Checklist.xlsx', type: 'XLSX', size: '45 KB', date: 'Oct 15, 2023' },
    ]);

    return (
        <div className="cabinets-container">
            {/* --- Main Admin Sidebar --- */}
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

                    {/* Active State for Cabinets */}
                    <div className="nav-item-custom active" onClick={() => navigate('/cv-templates')}>
                        <FileText size={20} /> <span>Cabinets of Knowledge</span>
                    </div>

                    <div className="nav-item-custom" onClick={() => navigate('/system-status')}><ShieldCheck size={20} /> <span>System Status Monitor</span></div>
                    <div className="nav-item-custom"><ClipboardList size={20} /> <span>System Reports</span></div>
                    <div className="nav-item-custom"><MessageSquare size={20} /> <span>Articles Management</span></div>
                    <div className="nav-item-custom"><Gift size={20} /> <span>User Package Management</span></div>
                </nav>
            </aside>

            {/* --- Secondary Sidebar --- */}
            <aside className="cabinets-left-sidebar">
                <div className="sidebar-blue-header">
                    <BookOpen size={24} color="#4880FF" />
                    <div className="uth-branding" style={{ color: 'white' }}>
                        <span>KNOWLEDGE</span><span> CABINET</span>
                    </div>
                </div>

                <nav className="sub-nav-list">
                    <div className="sub-nav-item" onClick={() => navigate('/admin')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </div>

                    <div className="sub-nav-item" onClick={() => navigate('/cv-templates')}>
                        <FileText size={18} /> CV Templates
                    </div>

                    <div className="sub-nav-item" onClick={() => navigate('/interview-questions')}>
                        <MessageSquare size={18} /> Interview Questions
                    </div>

                    <div className="sub-nav-item active">
                        <BookOpen size={18} /> Resources
                    </div>
                </nav>

                <div className="sub-sidebar-footer">
                    <div className="sub-nav-item" onClick={() => navigate('/admin')}>
                        <ArrowLeft size={18} /> Back to Admin
                    </div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <div className="cabinets-right-content">
                <header className="cabinets-top-header">
                    <div className="header-right-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="notification" style={{ position: 'relative' }}>
                            <Bell size={22} color="#64748b" />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>2</span>
                        </div>
                        <div className="user-account-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '35px', height: '35px', background: '#e2e8f0', borderRadius: '50%' }}></div>
                            <ChevronDown size={16} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                <main className="cabinets-view-area">
                    <div className="cabinets-header-group">
                        <div>
                            <h2>Resources Library</h2>
                            <p style={{ color: '#64748B', marginTop: '5px' }}>Shared documents and guides for users</p>
                        </div>
                        <button className="btn-add-new">
                            <Plus size={18} /> Upload Resource
                        </button>
                    </div>

                    <div className="resource-list">
                        {resources.map(file => (
                            <div className="resource-item" key={file.id}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="resource-icon-box">
                                        <File size={24} />
                                    </div>
                                    <div className="resource-details">
                                        <h4>{file.name}</h4>
                                        <div className="resource-meta">{file.type} • {file.size} • Uploaded on {file.date}</div>
                                    </div>
                                </div>
                                <button className="resource-download" title="Download">
                                    <Download size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Resources;
