import React from 'react';
import './Organization.css';
import { Menu, Search, Edit3, Bell, User, ChevronDown } from 'lucide-react';

const App = () => {
  return (
    <div className="app-container">
      {}
      <header className="header">
        <div className="header-left">
          <button className="icon-btn"><Menu size={24} /></button>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="header-right">
          <div className="action-link">
             {}
          </div>
          
          <div className="notification-wrapper">
            <Bell size={24} color="#555" />
            <span className="badge">6</span>
          </div>

          <div className="user-profile">
            <div className="avatar-circle-sm">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">Manager</span>
              <span className="user-role">Recruiter</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      {}
      <main className="main-layout">
        
        {}
        <div className="left-column">
          
          {}
          <div className="card company-card">
            {/* Ảnh bìa */}
            <div className="cover-image">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Cover" 
              />
            </div>
            
            <div className="company-info-container">
              {}
              <div className="company-avatar">
                {}
                <img src="https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Logo" alt="Company Logo" />
              </div>
              
              {}
              <h1 className="company-name">Name company</h1>
              
              <p className="company-desc">description</p>
              <p className="company-meta">company sector - position - number of employees</p>
              
              <div className="action-buttons">
                <button className="btn btn-primary">+ Follow</button>
                <button className="btn btn-primary">Chat</button>
              </div>
            </div>
          </div>

          {}
          <div className="card overview-card">
            <h3 className="card-title">Tổng quan</h3>
            <p className="content-text">description</p>
          </div>

          {}
          <div className="card posts-card">
            <h3 className="card-title">Post on the page</h3>
            <div className="posts-grid">
              {}
              <div className="gray-placeholder">
                <span>note: Post 1</span>
              </div>
              {}
              <div className="gray-placeholder">
                <span>note: post 2</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="right-column">
          <div className="card thumbnail-card">
             {}
             <div className="gray-placeholder full-height">
                <span>Note: thumnail</span>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;