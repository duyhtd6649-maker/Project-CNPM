import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import CandidateNavbar from '../components/CandidateNavbar';
import { useNavigate } from 'react-router-dom';
// Đảm bảo đường dẫn import đúng tới file axiosClient của bạn
import axiosClient from "/src/infrastructure/http/axiosClient";
import {
  Search, Home, Users, Briefcase, Bot, FileText,
  UserCircle, UserPlus, Key, Bookmark, Newspaper,
  ThumbsUp, MessageCircle, ChevronDown, CreditCard, Bell, LogOut, Settings, Share2, MoreHorizontal,
  Send, Smile, Paperclip
} from 'lucide-react';
import "../components/HomepageCandidates.css";

const HomepageCandidates = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [userData, setUserData] = useState({ fullName: 'Loading...', university: '' });
  const [notifications, setNotifications] = useState([]); // State lưu thông báo từ API
  const [loading, setLoading] = useState(true);

  // UI States
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  // --- GỌI API KHI COMPONENT MOUNT ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Gọi API lấy thông tin User
        // Giả sử backend bạn có endpoint: GET /api/users/me/ hoặc /api/profile/
        const userRes = await axiosClient.get('users/profile/');
        setUserData(userRes.data);

        // 2. Gọi API lấy thông báo
        // Giả sử backend có endpoint: GET /api/notifications/
        const notifyRes = await axiosClient.get('notifications/');
        setNotifications(notifyRes.data);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        // Có thể navigate về trang login nếu lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
          // navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // [] rỗng nghĩa là chỉ chạy 1 lần khi vào trang

  // --- XỬ LÝ DỮ LIỆU HIỂN THỊ ---
  // Lọc thông báo dựa trên Tab đang chọn
  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'All') return true;
    return item.type === activeTab;
    // Lưu ý: Backend cần trả về field 'type' khớp với 'Admin'/'Recruiter'
    // Nếu backend trả về số (vd: 1, 2), bạn cần map lại ở đây.
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
              {loading ? (
                <div className="empty-state-notify">Đang tải...</div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map(item => (
                  <div key={item.id} className="notify-item">
                    <div className="notify-avatar">
                      <UserCircle size={32} color={item.type === 'Admin' ? '#4b49ac' : '#666'} />
                    </div>
                    <div className="notify-info">
                      <div className="notify-user">
                        {item.user} {/* Thay bằng field tên user từ API */}
                        <span className={`type-tag-small ${item.type?.toLowerCase()}`}>{item.type}</span>
                      </div>
                      <div className="notify-msg">{item.msg}</div> {/* Thay msg bằng field nội dung từ API */}
                      <div className="notify-time">{item.time}</div> {/* Thay time bằng field thời gian từ API */}
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
              {/* DỮ LIỆU TỪ API ĐƯỢC HIỂN THỊ Ở ĐÂY */}
              <div className="user-name">{userData?.full_name || "Guest User"}</div>
              <div className="sub-text">{userData?.university || "Cập nhật trường học"}</div>
            </div>
          </div>

          {/* ... (Các phần code giữ nguyên: Premium, Action Card...) */}
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

        {/* ... (Các phần code main content và right col giữ nguyên) */}
        {/* CENTER COL */}
        <main className="col-center">
          {/* ... Code cũ giữ nguyên ... */}
          <div className="card create-post-mimic">
            {/* ... */}
            <div className="fake-input">Bạn đang nghĩ gì, {userData?.first_name}?</div>
          </div>
          {/* ... */}
        </main>

        <aside className="col-right">
          {/* ... Code cũ giữ nguyên ... */}
        </aside>
      </div>
    </div>
  );
};

export default HomepageCandidates;