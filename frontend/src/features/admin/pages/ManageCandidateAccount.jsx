import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UserCog, Activity, Library,
  ShieldCheck, ClipboardList, MessageSquare, Gift,
  Menu, X, Settings, Bell, ChevronDown, ArrowLeft, Users
} from 'lucide-react';
import '../components/ManageCandidateAccount.css';

const ManageCandidateAccount = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('candidate');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="manage-page-container">
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
          <div className="nav-item-custom" onClick={() => navigate('/admin')}><LayoutDashboard size={20} /> <span>Dashboard</span></div>

          <div className="sidebar-divider-text">ACCOUNT MANAGEMENT</div>
          <div className="nav-item-custom" onClick={() => navigate('/manage-internal')}><ShieldCheck size={20} /> <span>Internal Accounts</span></div>
          <div className="nav-item-custom active"><Users size={20} /> <span>Candidates</span></div>
          <div className="nav-item-custom" onClick={() => navigate('/manage-recruiter')}><UserCog size={20} /> <span>Recruiters</span></div>
          <div className="nav-item-custom" onClick={() => navigate('/manage-admin-acc')}><Activity size={20} /> <span>Admin Accounts</span></div>


        </nav>
      </aside>
      <aside className="manage-left-sidebar">
        <div className="sidebar-blue-header">
          <button className="header-menu-btn-white" onClick={toggleSidebar}><Menu size={20} /></button>
          <div className="uth-branding-white">
            <span className="uth-text">UTH</span>
            <span className="workplace-text"> WORKPLACE</span>
          </div>
        </div>

        <nav className="sub-nav-list">
          <div
            className={`sub-nav-item ${activeTab === 'internal' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('internal');
              navigate('/manage-internal');
            }}
          >
            Internal Account
          </div>

          <div
            className={`sub-nav-item ${activeTab === 'candidate' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('candidate');
              navigate('/manage-candidate');
            }}
          >
            Candidate Account
          </div>

          <div
            className={`sub-nav-item ${activeTab === 'recruiter' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('recruiter');
              navigate('/manage-recruiter');
            }}
          >
            Recruiter Account
          </div>

          <div
            className={`sub-nav-item ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('admin');
              navigate('/manage-admin-acc');
            }}
          >
            Admin Account
          </div>
        </nav>

        <div className="sub-sidebar-footer">
          <div className="sub-nav-item" onClick={() => navigate('/admin')}>
            <ArrowLeft size={18} style={{ marginRight: '10px' }} /> Back to menu
          </div>
          <div className="divider-sub"></div>
          <div className="sub-nav-item-small">My Profile</div>
          <div className="sub-nav-item-small">Permissions</div>
          <div className="sub-nav-item logout-sub">Logout</div>
        </div>
      </aside>
      <div className="manage-right-content">
        <header className="manage-top-header">
          <div className="header-right-actions">
            <div className="notification"><Bell size={22} /><span className="badge">6</span></div>
            <div className="user-account-box">
              <div className="avatar-placeholder"></div>
              <ChevronDown size={16} color="#94a3b8" />
            </div>
          </div>
        </header>

        <main className="manage-view-area">
          <div className="view-header">
            <h2>Candidate Account Management</h2>
            <button className="btn-add-new">Add New Candidate</button>
          </div>
          <div className="view-content-card">
            <Settings size={64} color="#e2e8f0" />
            <p>Candidate account list and information will be displayed here</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageCandidateAccount;