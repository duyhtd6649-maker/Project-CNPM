import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search, Home, Users, Briefcase, Bot, FileText,
    UserCircle, ChevronDown, CreditCard, Bell, LogOut
} from 'lucide-react';
import "./HomepageCandidates.css";

const CandidateNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        if (path === 'feature-locked') {
            navigate('/feature-locked');
        } else {
            navigate(path);
        }
    };

    return (
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
                <div className="nav-item" onClick={() => handleNavigation('feature-locked')}>
                    <Users size={18} /> <span>Company</span>
                </div>
                <div className={`nav-item ${isActive('/job-list') ? 'active' : ''}`} onClick={() => navigate('/job-list')}>
                    <Briefcase size={18} /> <span>Job</span>
                </div>
                <div className={`nav-item ${isActive('/chatbot') ? 'active' : ''}`} onClick={() => navigate('/chatbot')}>
                    <Bot size={18} /> <span>AI</span>
                </div>

                <div className={`nav-item ${isActive('/create-cv') ? 'active' : ''}`} onClick={() => navigate('/create-cv')}>
                    <FileText size={18} /> <span>Create CV</span>
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
                                <div className="mini-item" onClick={() => navigate('/feature-locked')}>
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
    );
};

export default CandidateNavbar;
