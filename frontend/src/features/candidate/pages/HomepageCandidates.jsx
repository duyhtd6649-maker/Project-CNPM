import React, { useState, useEffect } from 'react';
import CandidateNavbar from '../components/CandidateNavbar';
import { useNavigate } from 'react-router-dom';
import axiosClient from "/src/infrastructure/http/axiosClient";
import {
  Search, Home, Users, Briefcase, Bot, FileText,
  UserCircle, UserPlus, Key, Bookmark, Newspaper,
  ThumbsUp, MessageCircle, ChevronDown, CreditCard, Bell, LogOut, Settings, Share2, MoreHorizontal,
  Send, Smile, Paperclip, ImageIcon, Video, Calendar, Edit3, Globe
} from 'lucide-react';
import "../components/HomepageCandidates.css";

const HomepageCandidates = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ fullName: 'Loading...', university: '' });
  const [loading, setLoading] = useState(true);

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await axiosClient.get('/api/auth/profile/');
        setUserData(userRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="hp-container">
      <CandidateNavbar 
        userData={userData} 
        isAccountOpen={isAccountOpen}
        setIsAccountOpen={setIsAccountOpen}
        isNotifyOpen={isNotifyOpen}
        setIsNotifyOpen={setIsNotifyOpen}
      />

      <div className="hp-main-layout">
        {/* --- CỘT TRÁI --- */}
        <aside className="col-left">
          <div className="card profile-card">
            <div className="banner-top"></div>
            <div className="profile-content">
              <div className="avatar-wrapper">
                <UserCircle size={72} className="avatar-img" />
              </div>
              <div className="user-meta">
                <h2 className="name">{userData?.first_name} {userData?.last_name}</h2>
                <p className="bio">{userData?.university || "Sinh viên tại UTH"}</p>
              </div>
            </div>
            
            <div className="stats-box">
              <div className="stat-line">
                <span className="label">Lượt xem hồ sơ</span>
                <span className="value">42</span>
              </div>
              <div className="stat-line">
                <span className="label">Ấn tượng bài viết</span>
                <span className="value">128</span>
              </div>
            </div>

            <div className="premium-box-pro" onClick={() => navigate('/premium')}>
              <p className="p-title">Tính năng độc quyền</p>
              <div className="p-cta"><Key size={14} className="k-icon"/> Thử Premium miễn phí</div>
            </div>

            <div className="my-items" onClick={() => navigate('/saved-cv')}>
              <Bookmark size={16} /> <span>Mục đã lưu</span>
            </div>
          </div>

          <div className="card group-card">
            <p className="card-title">Gần đây</p>
            <div className="group-item"><Users size={14} /> CLB Kỹ năng UTH</div>
            <div className="group-item"><Users size={14} /> ReactJS Vietnam</div>
            <div className="group-more">Xem tất cả</div>
          </div>
        </aside>

        {/* --- CỘT GIỮA --- */}
        <main className="col-center">
          <div className="card post-box-full">
            <div className="post-top">
              <UserCircle size={48} color="#ccc" />
              <button className="post-trigger-btn">Bạn đang nghĩ gì, {userData?.first_name}?</button>
            </div>
            <div className="post-bottom">
              <div className="action-btn"><ImageIcon size={20} color="#378fe9" /> <span>Ảnh</span></div>
              <div className="action-btn"><Video size={20} color="#5f9b41" /> <span>Video</span></div>
              <div className="action-btn"><Calendar size={20} color="#c37d16" /> <span>Sự kiện</span></div>
              <div className="action-btn"><Edit3 size={20} color="#e16745" /> <span>Bài viết</span></div>
            </div>
          </div>

          <div className="feed-sort-divider">
            <hr /> <span>Sắp xếp theo: <b>Phù hợp nhất</b> <ChevronDown size={14} /></span>
          </div>

          {/* Post mẫu 1 */}
          <div className="card feed-post">
            <div className="p-header">
              <div className="p-brand-avatar">UTH</div>
              <div className="p-user-details">
                <div className="p-name-row">
                  <span className="p-name">UTH Workplace</span>
                  <span className="p-follow">• Đang theo dõi</span>
                </div>
                <p className="p-desc">Hệ thống hỗ trợ việc làm sinh viên UTH</p>
                <p className="p-time">2 giờ • <Globe size={12} /></p>
              </div>
              <MoreHorizontal size={20} className="p-more" />
            </div>
            
            <div className="p-text">
              🚀 Bạn đã sẵn sàng cho kỳ thực tập sắp tới chưa? Đừng quên cập nhật Hồ sơ cá nhân trên hệ thống để không bỏ lỡ những cơ hội hấp dẫn nhất nhé!
            </div>

            <div className="p-image">
              <img src="https://uth.edu.vn/images/slider/vi/uth-banner.jpg" alt="UTH Banner" />
            </div>

            <div className="p-stats-bar">
              <div className="p-likes">👍❤️ 1,240</div>
              <div className="p-comments">86 bình luận • 12 lượt chia sẻ</div>
            </div>

            <div className="p-actions-footer">
              <button><ThumbsUp size={18} /> <span>Thích</span></button>
              <button><MessageCircle size={18} /> <span>Bình luận</span></button>
              <button><Share2 size={18} /> <span>Chia sẻ</span></button>
              <button><Send size={18} /> <span>Gửi</span></button>
            </div>
          </div>
        </main>

        {/* --- CỘT PHẢI --- */}
        <aside className="col-right">
          <div className="card job-widget">
            <div className="j-header">
              <h3>Gợi ý việc làm</h3>
              <Settings size={16} />
            </div>

            <div className="j-list">
              <div className="j-item">
                <div className="j-logo" style={{background: '#0a66c2'}}>F</div>
                <div className="j-content">
                  <div className="j-name">Senior Frontend Developer</div>
                  <div className="j-company">FPT Software</div>
                  <div className="j-loc">TP. Hồ Chí Minh</div>
                  <button className="j-apply">Ứng tuyển nhanh</button>
                </div>
              </div>

              <div className="j-item">
                <div className="j-logo" style={{background: '#e11d48'}}>V</div>
                <div className="j-content">
                  <div className="j-name">UI/UX Designer (Junior)</div>
                  <div className="j-company">VNG Corporation</div>
                  <div className="j-loc">Quận 7, TP. HCM</div>
                  <button className="j-apply">Ứng tuyển nhanh</button>
                </div>
              </div>
            </div>
            <div className="j-footer">Xem tất cả gợi ý →</div>
          </div>

          <div className="card footer-card">
            <div className="f-links">
              <span>Giới thiệu</span>
              <span>Trợ giúp</span>
              <span>Quyền riêng tư</span>
            </div>
            <p className="f-copy">UTH WORKPLACE © 2026</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomepageCandidates;