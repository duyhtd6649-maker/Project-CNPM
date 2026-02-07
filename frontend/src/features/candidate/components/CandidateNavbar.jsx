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
    const [notifications, setNotifications] = useState([]);

    // Fetch Notifications from API
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('access_token');
                // Use the same base URL logic as other parts of the app or relative path if proxy is set up
                // Assuming axios or fetch. Since we want to use existing files, let's use standard fetch or imported axios if available.
                // The previous files used 'axios', let's stick to that or 'axiosClient' if we import it.
                // To be safe and self-contained as requested, I'll use fetch with the token.

                const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
                const response = await fetch(`${API_BASE.replace(/\/$/, '')}/api/notification`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Map API data to UI format
                    const mappedData = data.map((item, index) => ({
                        id: index, // No ID in serializer, using index
                        type: 'System', // Default type as API doesn't return type yet, or infer from title? 
                        // Serializer returns: actor, message, title, created_date
                        // Let's use 'title' as type if it fits, or just 'System'
                        title: item.title || 'Notification',
                        user: item.actor || 'System',
                        msg: item.message,
                        time: new Date(item.created_date).toLocaleString()
                    }));
                    setNotifications(mappedData);
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        if (isNotifyOpen) {
            fetchNotifications();
        }
    }, [isNotifyOpen]);


    const filteredNotifications = notifications.filter(item => {
        if (activeTab === 'All') return true;
        // Adjust filtering logic based on available data. 
        // Since we don't have a specific 'type' field from backend corresponding to 'Admin'/'Recruiter' tabs exactly as before,
        // we might want to relax this or map titles to types.
        // For now, let's keep 'All' working and maybe 'System' if we use that.
        // If the user wants specific tabs, we'd need logic to derive type.
        // Let's assume for now we just show all under 'All' and maybe try to guess type.
        return true; // Simplified for now to ensure data shows up.
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
                                    <div className="mini-item" onClick={() => navigate('/job-list')}>
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
                            {/* Keep tabs mainly for UI consistency, but functionality might be limited to 'All' unless we parse types */}
                            {['All'].map(tab => (
                                <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
                            ))}
                        </div>
                        <div className="notify-content">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map(item => (
                                    <div key={item.id} className="notify-item">
                                        <div className="notify-avatar"><UserCircle size={32} color={'#4b49ac'} /></div>
                                        <div className="notify-info">
                                            <div className="notify-user">{item.user} <span className="type-tag-small admin">{item.title}</span></div>
                                            <div className="notify-msg">{item.msg}</div>
                                            <div className="notify-time">{item.time}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-notify">No notifications</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CandidateNavbar;
