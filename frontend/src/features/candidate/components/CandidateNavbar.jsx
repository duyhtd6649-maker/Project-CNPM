import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search, Home, Users, Briefcase, Bot, FileText,
    UserCircle, ChevronDown, CreditCard, Bell, LogOut, Settings
} from 'lucide-react';
import "./HomepageCandidates.css";

const CandidateNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    const notifications = [
        { id: 1, type: 'Admin', user: 'System Admin', msg: 'Your account security settings have been updated successfully.', time: '12/26/2026 4:04 PM' },
        { id: 2, type: 'Recruiter', user: 'Techcombank HR', msg: 'We have received your application for Senior Frontend Developer position.', time: '12/27/2026 9:15 AM' },
        { id: 3, type: 'Recruiter', user: 'FPT Software', msg: 'Invitation to interview: Monday at 2:00 PM via Google Meet.', time: '12/28/2026 10:30 AM' }
    ];

    const filteredNotifications = notifications.filter(item => {
        if (activeTab === 'All') return true;
        return item.type === activeTab;
    });

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        if (path === 'feature-locked') {
            navigate('/feature-locked');
        } else {
            navigate(path);
        }
    };

    return (
        <>
            <header className="hp-header">
                <div className="header-left-section">
                    <div className="logo-vertical" onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>
                        <div className="logo-line">UTH</div>
                        <div className="logo-line">WORKPLACE</div>
                    </div>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon-svg" />
                        <input type="text" placeholder="Search Users by Name, Email or ID" />
                    </div>
                </div>

                <nav className="header-nav">
                    <div className={`nav-item ${isActive('/homepage') ? 'active' : ''}`} onClick={() => navigate('/homepage')}>
                        <Home size={18} /> <span>Home</span>
                    </div>
                    <div className={`nav-item ${isActive('/companies') || location.pathname.startsWith('/company-profile') ? 'active' : ''}`} onClick={() => navigate('/companies')}>
                        <Users size={18} /> <span>Company</span>
                    </div>
                    <div className={`nav-item ${isActive('/job-list') ? 'active' : ''}`} onClick={() => navigate('/job-list')}>
                        <Briefcase size={18} /> <span>Job</span>
                    </div>
                    <div className={`nav-item ${isActive('/chatbot') ? 'active' : ''}`} onClick={() => navigate('/chatbot')}>
                        <Bot size={18} /> <span>AI</span>
                    </div>

                    <div className="nav-item account-btn-container" onClick={() => setIsAccountOpen(!isAccountOpen)}>
                        <div className="account-icon-wrapper">
                            <UserCircle size={24} />
                            <ChevronDown size={14} className={isAccountOpen ? 'rotate' : ''} />
                        </div>
                        <span>Account</span>

                        {isAccountOpen && (
                            <div className="mini-account-page" onClick={(e) => e.stopPropagation()}>
                                <div className="mini-page-grid">
                                    <div className="mini-item" onClick={() => navigate('/profile')}>
                                        <div className="icon-box"><UserCircle size={28} /></div>
                                        <span>Information</span>
                                    </div>
                                    <div className="mini-item" onClick={() => navigate('/premium')}>
                                        <div className="icon-box"><CreditCard size={28} /></div>
                                        <span>Premium</span>
                                    </div>
                                    <div className="mini-item" onClick={() => { setIsNotifyOpen(true); setIsAccountOpen(false); }}>
                                        <div className="icon-box"><Bell size={28} /></div>
                                        <span>Notification</span>
                                    </div>
                                    <div className="mini-item" onClick={() => navigate('/create-cv')}>
                                        <div className="icon-box"><FileText size={28} /></div>
                                        <span>Jobs</span>
                                    </div>
                                </div>
                                <div className="mini-footer" onClick={() => navigate('/login')}><LogOut size={16} /> Sign out</div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* NOTIFICATION BOX */}
            {isNotifyOpen && (
                <div className="notification-overlay" onClick={() => setIsNotifyOpen(false)}>
                    <div className="notification-box" onClick={(e) => e.stopPropagation()}>
                        <div className="notify-header">
                            <div className="header-title"><span>Inbox</span> <ChevronDown size={14} /></div>
                        </div>
                        <div className="notify-tabs">
                            {['All', 'Admin', 'Recruiter'].map(tab => (
                                <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
                            ))}
                        </div>
                        <div className="notify-content">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map(item => (
                                    <div key={item.id} className="notify-item">
                                        <div className="notify-avatar"><UserCircle size={32} color={item.type === 'Admin' ? '#4b49ac' : '#666'} /></div>
                                        <div className="notify-info">
                                            <div className="notify-user">{item.user} <span className={`type-tag-small ${item.type.toLowerCase()}`}>{item.type}</span></div>
                                            <div className="notify-msg">{item.msg}</div>
                                            <div className="notify-time">{item.time}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-notify">No notifications in {activeTab}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CandidateNavbar;
