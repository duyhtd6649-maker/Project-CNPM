import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, UserCog, X, Bell, ChevronDown, ArrowLeft,
  MoreVertical, ShieldAlert, Trash2, UserCheck, Search, Mail, Phone,
  Building2, AlertCircle, Loader2, RefreshCcw, UserPlus
} from 'lucide-react';
import '../components/ManageInternalAccount.css';

const ManageInternalAccount = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- CẤU HÌNH FE KHỚP VỚI BE CỦA BẠN ---
  const API_BASE = "http://127.0.0.1:8000"; // Đổi port nếu BE của bạn chạy port khác
  
  // Hàm lấy Token (Bạn hãy đảm bảo key 'access' đúng với lúc bạn lưu khi Login)
  const getHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
  });

  // --- 1. FETCH DỮ LIỆU: Khớp với path('recruiters/', user_views.GetRecruitersInfor) ---
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/recruiters/`, getHeader());
      // BE trả về danh sách, mỗi item có: username, email, company, is_active (từ UserSerializer)
      setAccounts(response.data);
    } catch (err) {
      setError("Không thể lấy dữ liệu. Hãy kiểm tra Token hoặc Server BE.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // --- 2. BAN/UNBAN: Khớp với banuser/ và unbanuser/ (Nhận username) ---
  const handleToggleStatus = async (user) => {
    const isCurrentlyActive = user.is_active;
    const endpoint = isCurrentlyActive ? "banuser" : "unbanuser";
    
    try {
      // BE của bạn yêu cầu: return UserService.Ban_User(request.data.get('username'))
      await axios.post(`${API_BASE}/${endpoint}/`, { username: user.username }, getHeader());
      
      // Cập nhật UI ngay lập tức
      const updated = accounts.map(acc => 
        acc.username === user.username ? { ...acc, is_active: !isCurrentlyActive } : acc
      );
      setAccounts(updated);
      if (selectedAcc?.username === user.username) {
        setSelectedAcc({ ...selectedAcc, is_active: !isCurrentlyActive });
      }
    } catch (err) {
      alert("Lỗi khi thay đổi trạng thái người dùng!");
    }
  };

  // --- 3. XÓA USER: Khớp với removeuser/ (Nhận username) ---
  const handleDelete = async (username) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn @${username}?`)) return;

    try {
      // BE yêu cầu: return UserService.Remove_User(request.data.get('username'))
      await axios.post(`${API_BASE}/removeuser/`, { username }, getHeader());
      setAccounts(accounts.filter(acc => acc.username !== username));
      setSelectedAcc(null);
    } catch (err) {
      alert("Lỗi khi xóa người dùng!");
    }
  };

  return (
    <div className="manage-page-container">
      {/* SIDEBAR TỐI GIẢN - TONE NAVY */}
      <aside className="manage-left-sidebar-navy">
        <div className="sidebar-blue-header">
          <div className="uth-branding-box" onClick={() => navigate('/admin')}>
            <span className="uth-text">UTH</span>
            <span className="workplace-text"> WORKPLACE</span>
          </div>
        </div>

        <nav className="manage-nav-list">
          <div className="nav-group-label">Chính</div>
          <div className="manage-nav-item" onClick={() => navigate('/admin')}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </div>

          <div className="nav-group-label">Quản lý nhân sự</div>
          <div className="manage-nav-item active">
            <UserCog size={20} /> <span>Internal Account</span>
          </div>
        </nav>

        <div className="manage-sidebar-footer">
          <div className="back-btn" onClick={() => navigate('/admin')}>
            <ArrowLeft size={18} /> <span>Quay lại Dashboard</span>
          </div>
        </div>
      </aside>

      <div className="manage-right-content">
        <header className="manage-top-header">
          <div className="header-search-box">
             <Search size={18} color="#8A92A6" />
             <input 
                type="text" 
                placeholder="Tìm username hoặc email..." 
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="header-actions">
            <button className="icon-btn-circle" onClick={fetchAccounts} title="Tải lại dữ liệu">
              <RefreshCcw size={18} />
            </button>
            <div className="icon-badge"><Bell size={22} /></div>
            <div className="profile-pill">
              <div className="avatar-sm">AD</div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <main className="manage-view-area">
          <div className="view-header">
            <div className="title-stack">
              <h2>Quản lý tài khoản nội bộ</h2>
              <p>Kết nối trực tiếp từ Recruiters Database</p>
            </div>
            <button className="btn-add-new">
              <UserPlus size={18} /> Thêm thành viên
            </button>
          </div>

          <div className="table-card-container">
            {loading ? (
              <div className="loading-state-box">
                <Loader2 className="spin-icon" /> <p>Đang tải dữ liệu từ server...</p>
              </div>
            ) : error ? (
              <div className="error-state-box">
                <AlertCircle color="#FF4842" /> <p>{error}</p>
              </div>
            ) : (
              <table className="account-table">
                <thead>
                  <tr>
                    <th>Thành viên</th>
                    <th>Username</th>
                    <th>Công ty</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {accounts
                    .filter(a => a.username.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(acc => (
                      <tr key={acc.username} onClick={() => setSelectedAcc(acc)} className={selectedAcc?.username === acc.username ? 'row-active' : ''}>
                        <td>
                          <div className="user-info-row">
                            <div className="avatar-box">{acc.username.charAt(0).toUpperCase()}</div>
                            <div className="text-info">
                              <span className="name-bold">{acc.username}</span>
                              <span className="email-small">{acc.email}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="username-tag">@{acc.username}</span></td>
                        <td>
                          <div className="company-cell">
                            <Building2 size={14} /> {acc.company || "N/A"}
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${acc.is_active ? 'active' : 'banned'}`}>
                            {acc.is_active ? 'Đang hoạt động' : 'Đã bị khóa'}
                          </span>
                        </td>
                        <td><button className="btn-dots"><MoreVertical size={18}/></button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* SIDEBAR CHI TIẾT (BÊN PHẢI) */}
        <div className={`panel-overlay ${selectedAcc ? 'show' : ''}`} onClick={() => setSelectedAcc(null)}></div>
        
        <aside className={`action-panel-right ${selectedAcc ? 'open' : ''}`}>
           <div className="panel-header">
              <h3>Thông tin tài khoản</h3>
              <button className="btn-close-panel" onClick={() => setSelectedAcc(null)}><X size={24} /></button>
           </div>
           
           {selectedAcc && (
             <div className="panel-body">
                <div className="panel-profile">
                   <div className="avatar-lg">{selectedAcc.username.charAt(0).toUpperCase()}</div>
                   <h4>{selectedAcc.username}</h4>
                   <span className="pill-role">Nhà tuyển dụng</span>
                </div>

                <div className="detail-list">
                   <div className="detail-item">
                      <Mail size={16} />
                      <div className="labels"><label>Email hệ thống</label><p>{selectedAcc.email}</p></div>
                   </div>
                   <div className="detail-item">
                      <Building2 size={16} />
                      <div className="labels"><label>Thuộc công ty</label><p>{selectedAcc.company || 'N/A'}</p></div>
                   </div>
                </div>

                <div className="panel-footer-btns">
                   <button 
                      className={`btn-panel-act ${selectedAcc.is_active ? 'ban' : 'unban'}`}
                      onClick={() => handleToggleStatus(selectedAcc)}
                   >
                      {selectedAcc.is_active ? <ShieldAlert size={20}/> : <UserCheck size={20}/>}
                      {selectedAcc.is_active ? "Khóa tài khoản" : "Kích hoạt lại"}
                   </button>

                   <button className="btn-panel-act delete" onClick={() => handleDelete(selectedAcc.username)}>
                      <Trash2 size={20}/> Xóa vĩnh viễn
                   </button>
                </div>
             </div>
           )}
        </aside>
      </div>
    </div>
  );
};

export default ManageInternalAccount;