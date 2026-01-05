import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Home, Users, Briefcase, Bot, FileText, 
  UserCircle, UserPlus, Key, Bookmark, Newspaper, 
  ThumbsUp, MessageCircle, ChevronDown, CreditCard, Bell, LogOut, Settings
} from 'lucide-react';
import './HomepageCandidates.css';

const HomepageCandidates = () => {
  const navigate = useNavigate();
  
  // States quản lý UI
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  // Dữ liệu mẫu thông báo
  const notifications = [
    { id: 1, type: 'Admin', user: 'System Admin', msg: 'Your account security settings have been updated successfully.', time: '12/26/2026 4:04 PM' },
    { id: 2, type: 'Recruiter', user: 'Techcombank HR', msg: 'We have received your application for Senior Frontend Developer position.', time: '12/27/2026 9:15 AM' },
    { id: 3, type: 'Recruiter', user: 'FPT Software', msg: 'Invitation to interview: Monday at 2:00 PM via Google Meet.', time: '12/28/2026 10:30 AM' }
  ];

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'All') return true;
    return item.type === activeTab;
  });

  return (
    <div className="hp-container">
      {/* HEADER */}
      <header className="hp-header">
        <div className="header-left-section">
          <div className="logo-vertical" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <div className="logo-line">UTH</div>
            <div className="logo-line">WORKPLACE</div>
          </div>
          <div className="search-wrapper">
            <Search size={18} className="search-icon-svg" />
            <input type="text" placeholder="Search Users by Name, Email or ID" />
          </div>
        </div>
        
        <nav className="header-nav">
          <div className="nav-item active" onClick={() => navigate('/home')}><Home size={18} /> <span>Home</span></div>
          <div className="nav-item"><Users size={18} /> <span>Company</span></div>
          <div className="nav-item"><Briefcase size={18} /> <span>Job</span></div>
          <div className="nav-item"><Bot size={18} /> <span>AI</span></div>
          
          {/* ĐỒNG BỘ 1: Click trên Nav Bar sang Create CV */}
          <div className="nav-item" onClick={() => navigate('/create-cv')}>
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
                  <div className="mini-item" onClick={() => { setIsNotifyOpen(true); setIsAccountOpen(false); }}>
                    <div className="icon-box"><Bell size={28} /></div>
                    <span>Notification</span>
                  </div>
                  <div className="mini-item" onClick={() => navigate('/create-cv')}>
                    <div className="icon-box"><FileText size={28} /></div>
                    <span>Jobs</span>
                  </div>
                </div>
                <div className="mini-footer"><LogOut size={16} /> Sign out</div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* BOX NOTIFICATION */}
      {isNotifyOpen && (
        <div className="notification-overlay" onClick={() => setIsNotifyOpen(false)}>
          <div className="notification-box" onClick={(e) => e.stopPropagation()}>
            <div className="notify-header">
              <div className="header-title"><span>Inbox</span> <ChevronDown size={14} /></div>
              <Settings size={18} className="settings-icon" />
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
                      <div className="notify-user">{item.user} <span className={`type-tag ${item.type.toLowerCase()}`}>{item.type}</span></div>
                      <div className="notify-msg">{item.msg}</div>
                      <div className="notify-time">{item.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-notify">No notifications in {activeTab}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="hp-main">
        <aside className="col-left">
          <div className="card profile-card" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>
            <div className="banner-purple"></div>
            <div className="avatar-circle"><UserCircle size={48} color="#4b49ac" /></div>
            <div className="profile-info">
              <div className="user-name">Your Name</div>
              <div className="sub-text">Your University</div>
            </div>
          </div>

          <div className="card premium-shortcut-card" onClick={() => navigate('/premium')}>
             <div className="premium-content">
                <p className="premium-title">Unlock premium</p>
                <span className="premium-desc">Open premium now starting from just 50K</span>
             </div>
             <Key size={18} className="premium-key-icon" />
          </div>

          <div className="card action-card">
            <div className="action-row"><span>Connect with businesses</span><UserPlus size={18} /></div>
          </div>
          
          {/* ĐỒNG BỘ 2: Ô quản lý CV bên cột trái theo ảnh mẫu */}
          <div className="card action-card" onClick={() => navigate('/create-cv')} style={{cursor: 'pointer'}}>
            <div className="action-row"><span>CV Management</span><FileText size={18} /></div>
          </div>

          <div className="card menu-list-card">
            <div className="menu-row"><Bookmark size={16} /> Saved items</div>
            <div className="menu-row"><Newspaper size={16} /> News</div>
          </div>
        </aside>

        <main className="col-center">
          <div className="card banner-box">
            <div className="placeholder-img-sim"><FileText size={80} color="#eee" /></div>
            <p>Let's create a CV for yourself right now</p>
            {/* ĐỒNG BỘ 3: Nút Create CV chính giữa màn hình */}
            <button className="btn-main-action" onClick={() => navigate('/create-cv')}>Create CV</button>
          </div>
          
          <div className="card post-sample">
             <div className="post-top">
                <div className="brand-sq">NCS</div>
                <div><b>NCS Group</b><div className="post-sub">Promoted</div></div>
             </div>
             <div className="post-mid"><p>How can we secure AI in the age of chaos? 🤔</p></div>
             <div className="post-foot">
                <div className="foot-item"><ThumbsUp size={18} /> Like</div>
                <div className="foot-item"><MessageCircle size={18} /> Comment</div>
             </div>
          </div>
        </main>

        <aside className="col-right">
          <div className="card news-card">
            <div className="news-header-section"><span className="news-title">News</span></div>
            <div className="news-content-placeholder">Latest updates...</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomepageCandidates;