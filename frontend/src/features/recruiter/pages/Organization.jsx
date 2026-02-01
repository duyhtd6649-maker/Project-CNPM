import React from 'react';
import './Organization.css';
import { 
  Menu, Search, Bell, User, ChevronDown, 
  LayoutDashboard, Briefcase, Users, Building2 
} from 'lucide-react';

const App = () => {
  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <button className="icon-btn"><Menu size={24} /></button>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search Users by Name, Email or ID" />
          </div>
        </div>

        <div className="header-right">
          <div className="notification-wrapper">
            <Bell size={24} color="#555" />
            <span className="badge">6</span>
          </div>
          <div className="user-profile">
            <div className="avatar-circle-sm"><User size={20} /></div>
            <div className="user-info">
              <span className="user-name">Manager</span>
              <span className="user-role">Recruiter</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      <div className="page-body">
        
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-uth">UTH</span>
            <span className="logo-workplace">WORKPLACE</span>
          </div>
          <nav className="nav-menu">
            <div className="nav-item active">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
            <div className="nav-item">
              <Briefcase size={20} />
              <span>Manage Jobs</span>
            </div>
            <div className="nav-item">
              <Users size={20} />
              <span>Candidate Pipeline</span>
            </div>
            <div className="nav-item">
              <Building2 size={20} />
              <span>Organization Profile</span>
            </div>
          </nav>
        </aside>

        <main className="main-layout">
          <div className="left-column">
            <div className="card company-card">
              <div className="cover-image">
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000" alt="cover" />
              </div>
              <div className="company-info-container">
                <div className="company-avatar">
                   <div className="avatar-placeholder">Logo</div>
                </div>
                <h1 className="company-name">Name company</h1>
                <p className="company-desc">description</p>
                <p className="company-meta">Sector - Position - 100 Employees</p>
                <div className="action-buttons">
                  <button className="btn btn-primary">+ Follow</button>
                  <button className="btn btn-primary">Chat</button>
                </div>
              </div>
            </div>

            <div className="card overview-card">
              <h3 className="card-title">Tổng quan</h3>
              <p className="content-text">Nội dung mô tả công ty của bạn...</p>
            </div>
          </div>

          <div className="right-column">
            <div className="card thumbnail-card">
               <div className="gray-placeholder full-height">Thumbnail</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;