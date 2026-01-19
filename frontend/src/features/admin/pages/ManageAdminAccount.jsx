import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, UserCog, Activity, Library, 
  ShieldCheck, ClipboardList, MessageSquare, Gift, 
  Menu, X, Settings, Bell, ChevronDown, ArrowLeft
} from 'lucide-react';
import '../components/ManageInternalAccount.css';

const ManageAdminAccount = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeTab = 'admin';

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
          <div className="nav-item-custom active"><UserCog size={20} /> <span>Manage Account</span></div>
          <div className="nav-item-custom"><Activity size={20} /> <span>Monitor Logs & Analytics</span></div>
          <div className="nav-item-custom"><Library size={20} /> <span>Cabinets of Knowledge</span></div>
          <div className="nav-item-custom"><ShieldCheck size={20} /> <span>System Status Monitor</span></div>
          <div className="nav-item-custom"><ClipboardList size={20} /> <span>System Reports</span></div>
          <div className="nav-item-custom"><MessageSquare size={20} /> <span>Articles Management</span></div>
          <div className="nav-item-custom"><Gift size={20} /> <span>User Package Management</span></div>
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
          <div className={`sub-nav-item ${activeTab === 'internal' ? 'active' : ''}`} onClick={() => navigate('/manage-internal')}>Internal Account</div>
          <div className={`sub-nav-item ${activeTab === 'candidate' ? 'active' : ''}`} onClick={() => navigate('/manage-candidate')}>Candidate Account</div>
          <div className={`sub-nav-item ${activeTab === 'recruiter' ? 'active' : ''}`} onClick={() => navigate('/manage-recruiter')}>Recruiter Account</div>
          <div className={`sub-nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => navigate('/manage-admin-acc')}>Admin Account</div>
        </nav>

        <div className="sub-sidebar-footer">
          <div className="sub-nav-item" onClick={() => navigate('/admin')}>
            <ArrowLeft size={18} style={{marginRight: '10px'}}/> Back to menu
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
            <div className="notification"><Bell size={22} /><span className="badge">1</span></div>
            <div className="user-account-box">
              <div className="avatar-placeholder"></div>
              <ChevronDown size={16} color="#94a3b8" />
            </div>
          </div>
        </header>

        <main className="manage-view-area">
          <div className="view-header">
            <h2>Admin Account Management</h2>
            <button className="btn-add-new">Add New Account</button>
          </div>
          <div className="view-content-card">
            <Settings size={64} color="#e2e8f0" />
            <p>Select an account type to view details</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageAdminAccount;