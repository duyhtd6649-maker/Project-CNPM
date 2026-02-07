import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Home, Users, Briefcase, Bot, FileText,
  UserCircle, UserPlus, Key, Bookmark, Newspaper,
  ThumbsUp, MessageCircle, ChevronDown, CreditCard, Bell, LogOut, Settings, Share2, MoreHorizontal,
  Send, Smile, Paperclip
} from 'lucide-react';
import "../components/HomepageCandidates.css";

const HomepageCandidates = () => {
  const navigate = useNavigate();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const [notifications, setNotifications] = useState([]);

  // Fetch Notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
        const response = await fetch(`${API_BASE.replace(/\/$/, '')}/api/notification`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          let mappedData = [];

          if (Array.isArray(data) && data.length > 0) {
            mappedData = data.map((item, index) => ({
              id: index,
              type: 'System',
              title: item.title || 'Notification',
              user: item.actor || 'System',
              msg: item.message,
              time: new Date(item.created_date).toLocaleString()
            }));
          }
          setNotifications(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
        setNotifications([]);
      }
    };

    if (isNotifyOpen) {
      fetchNotifications();
    }
  }, [isNotifyOpen]);

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Admin') return item.user && (item.user.toLowerCase().includes('admin') || item.type === 'System');
    if (activeTab === 'Recruiter') return item.user && item.user.toLowerCase().includes('recruiter');
    return false;
  });

  return (
    <div className="hp-container">
      {/* HEADER */}
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
          <div className="nav-item active" onClick={() => navigate('/homepage')}><Home size={18} /> <span>Home</span></div>
          <div className="nav-item" onClick={() => navigate('/companies')}><Users size={18} /> <span>Company</span></div>
          <div className="nav-item" onClick={() => navigate('/job-list')}><Briefcase size={18} /> <span>Job</span></div>
          <div className="nav-item" onClick={() => navigate('/chatbot')}><Bot size={18} /> <span>AI</span></div>

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
                  <div className="mini-item" onClick={() => navigate('/my-applications')}>
                    <div className="icon-box"><FileText size={28} /></div>
                    <span>My Application</span>
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
              {['All', 'Admin', 'Recruiter'].map(tab => (
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

      {/* MAIN CONTENT */}
      <div className="hp-main">
        {/* LEFT COL */}
        <aside className="col-left">
          <div className="card profile-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
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

          <div className="card action-card" onClick={() => navigate('/saved-cv')} style={{ cursor: 'pointer' }}>
            <div className="action-row"><span>CV Management</span><FileText size={18} /></div>
          </div>

          <div className="card menu-list-card">
            <div className="menu-row"><Newspaper size={16} /> News</div>
          </div>
        </aside>

        {/* CENTER COL */}
        <main className="col-center">
          {/* Ô tạo bài viết bổ sung */}
          <div className="card create-post-mimic">
            <div className="post-input-row">
              <UserCircle size={40} color="#ddd" />
              <div className="fake-input">Bạn đang nghĩ gì?</div>
            </div>
            <div className="post-actions-row">
              <div className="post-action-item">🖼️ Ảnh</div>
              <div className="post-action-item">🎥 Video</div>
              <div className="post-action-item">💼 Việc làm</div>
            </div>
          </div>

          {/* Create CV Banner (PHẦN CŨ - ĐÃ GIỮ LẠI) */}
          <div className="card banner-box">
            <div className="placeholder-img-sim"><FileText size={80} color="#eee" /></div>
            <p>Let's create a CV for yourself right now</p>
            <button className="btn-main-action" onClick={() => navigate('/create-cv')}>Create CV</button>
          </div>

          {/* Post Sample (PHẦN CŨ - ĐÃ GIỮ LẠI) */}
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

          {/* Bài đăng nhúng Iframe bổ sung */}
          <div className="card news-feed-item">
            <div className="post-header">
              <div className="brand-logo-circle cnet-bg">C</div>
              <div className="post-meta">
                <div className="post-author">CNET News</div>
                <div className="post-date">Vừa đăng • World Tech</div>
              </div>
              <MoreHorizontal size={20} className="post-more" />
            </div>
            <div className="post-iframe-container">
              <iframe
                src="https://www.cnet.com/tech/"
                title="Cnet Feed"
                className="feed-iframe"
                style={{ top: '-400px' }}
                scrolling="no"
              ></iframe>
            </div>
            <div className="post-footer-actions">
              <div className="f-action"><ThumbsUp size={16} /> Thích</div>
              <div className="f-action"><MessageCircle size={16} /> Bình luận</div>
              <div className="f-action"><Share2 size={16} /> Chia sẻ</div>
            </div>
          </div>
        </main>

        {/* RIGHT COL */}
        <aside className="col-right">
          <div className="card news-card">
            <div className="news-header-section">
              <span className="news-title">CNet Blog (Live)</span>
              <span className="news-tag">NHÚNG</span>
            </div>

            <div className="iframe-viewport">
              <iframe
                src="https://www.cnet.com/news/"
                title="CNet Blog"
                className="clipped-iframe"
                scrolling="no"
              ></iframe>
            </div>

            <div className="iframe-footer" onClick={() => window.open('https://www.cnet.com/news/', '_blank')}>
              Xem tất cả bài báo ↗
            </div>
          </div>


        </aside>
      </div>
    </div>
  );
};

export default HomepageCandidates;