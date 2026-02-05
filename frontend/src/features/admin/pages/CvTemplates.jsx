import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, MessageSquare, BookOpen,
    ArrowLeft, Bell, ChevronDown, Plus, Eye, Edit, Users,
    UserCog, Activity, ShieldCheck, ClipboardList, Gift, Menu, X, LogOut
} from 'lucide-react';
import '../components/Cabinets.css';

const CvTemplates = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Mock Data
    const [templates] = useState([
        { id: 1, title: 'Modern Professional', category: 'General', usage: 1240, image: 'https://via.placeholder.com/300x400?text=Modern+Pro' },
        { id: 2, title: 'Creative Designer', category: 'Design', usage: 856, image: 'https://via.placeholder.com/300x400?text=Creative' },
        { id: 3, title: 'Software Engineer', category: 'Tech', usage: 2100, image: 'https://via.placeholder.com/300x400?text=Engineer' },
        { id: 4, title: 'Executive Suite', category: 'Management', usage: 340, image: 'https://via.placeholder.com/300x400?text=Executive' },
        { id: 5, title: 'Minimalist Clean', category: 'General', usage: 1560, image: 'https://via.placeholder.com/300x400?text=Minimalist' },
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

                    <div className="sub-nav-item active">
                        <FileText size={18} /> CV Templates
                    </div>

                    <div className="sub-nav-item" onClick={() => navigate('/interview-questions')}>
                        <MessageSquare size={18} /> Interview Questions
                    </div>

                    <div className="sub-nav-item" onClick={() => navigate('/resources')}>
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
                            <h2>CV Templates</h2>
                            <p style={{ color: '#64748B', marginTop: '5px' }}>Manage and organize CV templates for candidates</p>
                        </div>
                        <button className="btn-add-new">
                            <Plus size={18} /> Add Template
                        </button>
                    </div>

                    <div className="templates-grid">
                        {templates.map(template => (
                            <div className="template-card" key={template.id}>
                                <div className="template-preview">
                                    <div style={{ color: '#CBD5E1', fontSize: '14px' }}>Preview Image</div>
                                    {/* <img src={template.image} alt={template.title} /> */}
                                </div>
                                <div className="template-info">
                                    <div className="template-category">{template.category}</div>
                                    <div className="template-title">{template.title}</div>
                                    <div className="template-stats">
                                        <Users size={14} /> {template.usage} uses
                                    </div>
                                    <div className="template-actions">
                                        <button className="btn-view-template"><Eye size={16} /> View</button>
                                        <button className="btn-edit-template"><Edit size={16} /> Edit</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CvTemplates;
