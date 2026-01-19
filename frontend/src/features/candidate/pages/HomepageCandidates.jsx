import React, { useState } from 'react';
import CandidateNavbar from '../components/CandidateNavbar';
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

  const notifications = [
    { id: 1, type: 'Admin', user: 'System Admin', msg: 'Your account security settings have been updated successfully.', time: '12/26/2026 4:04 PM' },
    { id: 2, type: 'Recruiter', user: 'Techcombank HR', msg: 'We have received your application for Senior Frontend Developer position.', time: '12/27/2026 9:15 AM' },
    { id: 3, type: 'Recruiter', user: 'FPT Software', msg: 'Invitation to interview: Monday at 2:00 PM via Google Meet.', time: '12/28/2026 10:30 AM' }
  ];

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'All') return true;
    return item.type === activeTab;
  });

  const handleFeatureLocked = () => {
    navigate('/feature-locked');
  };

  return (
    <div className="hp-container">
      <CandidateNavbar />

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

          <div className="card action-card" onClick={() => navigate('/create-cv')} style={{ cursor: 'pointer' }}>
            <div className="action-row"><span>CV Management</span><FileText size={18} /></div>
          </div>

          <div className="card menu-list-card">
            <div className="menu-row" onClick={() => navigate('/saved-cv')} style={{ cursor: 'pointer' }}><Bookmark size={16} /> Saved items</div>
            <div className="menu-row"><Newspaper size={16} /> News</div>
          </div>
        </aside>

        {/* CENTER COL */}
        <main className="col-center">
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

          <div className="card banner-box">
            <div className="placeholder-img-sim"><FileText size={80} color="#eee" /></div>
            <p>Let's create a CV for yourself right now</p>
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

          <div className="card chat-mini-card">
            <div className="news-header-section">
              <span className="news-title">Messenger</span>
              <Settings size={14} className="settings-icon" style={{ cursor: 'pointer' }} />
            </div>

            <div className="chat-body">
              <div className="chat-bubble received">Chào bạn! Chúc bạn ngày mới tốt lành.</div>
              <div className="chat-bubble sent">Cảm ơn nhé!</div>
              <div className="chat-bubble received">Bạn đã cập nhật CV chưa?</div>
            </div>

            <div className="chat-footer-input">
              <div className="chat-input-wrapper">
                <input type="text" placeholder="Aa" />
                <Smile size={16} color="#666" />
                <Paperclip size={16} color="#666" />
              </div>
              <button className="chat-send-btn"><Send size={16} /></button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomepageCandidates;