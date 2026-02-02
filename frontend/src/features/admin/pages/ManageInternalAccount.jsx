import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, UserCog, X, Bell, ChevronDown, ArrowLeft,
  MoreVertical, ShieldAlert, Trash2, UserCheck, Search, Mail, 
  Building2, AlertCircle, Loader2, RefreshCcw, UserPlus, Eye, EyeOff 
} from 'lucide-react';
import '../components/ManageInternalAccount.css';

const ManageInternalAccount = () => {
  const navigate = useNavigate();
  
  // Dữ liệu danh sách
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trạng thái Modal Thêm thành viên
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  // --- Cấu hình API ---
  const API_BASE = "http://127.0.0.1:8000"; 
  
  const getHeader = useCallback(() => {
    const token = localStorage.getItem('access');
    return {
      headers: { 
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      }
    };
  }, []);

  // --- 1. Lấy danh sách thành viên (Review) ---
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/api/recruiters/`, getHeader());
      // Kết quả trả về từ UserSerializer sẽ có: username, email, company, is_active
      setAccounts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Không thể tải danh sách từ Database. Kiểm tra Server hoặc Quyền truy cập.");
    } finally {
      setLoading(false);
    }
  }, [getHeader]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // --- 2. Xử lý Thêm thành viên (Đăng ký) ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setIsSubmitting(true);
      // Payload khớp hoàn toàn với CustomRegisterSerializer bạn đã gửi
      const payload = {
        username: formData.username,
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2,
        role: 'recruiter' 
      };

      await axios.post(`${API_BASE}/api/auth/registration/`, payload, getHeader());
      
      alert("Thành viên mới đã được tạo thành công!");
      setShowAddModal(false);
      setFormData({ username: '', email: '', password1: '', password2: '' });
      fetchAccounts(); // Cập nhật lại danh sách ngay lập tức
    } catch (err) {
      const serverErr = err.response?.data;
      alert(serverErr ? JSON.stringify(serverErr) : "Lỗi khi đăng ký thành viên.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Xử lý Ban/Unban ---
  const handleToggleStatus = async (user) => {
    const endpoint = user.is_active ? "api/banuser" : "api/unbanuser";
    try {
      // BE yêu cầu UserNameSerializer { username: ... }
      await axios.post(`${API_BASE}/${endpoint}/`, { username: user.username }, getHeader());
      
      // Cập nhật State cục bộ để giao diện mượt mà
      setAccounts(prev => prev.map(acc => 
        acc.username === user.username ? { ...acc, is_active: !user.is_active } : acc
      ));
      if (selectedAcc?.username === user.username) {
        setSelectedAcc({ ...selectedAcc, is_active: !user.is_active });
      }
    } catch (err) {
      alert("Lỗi thao tác trên Server.");
    }
  };

  // --- 4. Xử lý Xóa thành viên ---
  const handleDelete = async (username) => {
    if (!window.confirm(`Bạn có chắc muốn xóa vĩnh viễn tài khoản @${username}?`)) return;
    try {
      await axios.post(`${API_BASE}/api/removeuser/`, { username }, getHeader());
      setAccounts(prev => prev.filter(acc => acc.username !== username));
      setSelectedAcc(null);
    } catch (err) {
      alert("Không thể xóa người dùng này.");
    }
  };

  return (
    <div className="manage-page-container">
      {/* SIDEBAR TRÁI - NAVY DARK */}
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

      {/* NỘI DUNG CHÍNH BÊN PHẢI */}
      <div className="manage-right-content">
        <header className="manage-top-header">
          <div className="header-search-box">
             <Search size={18} color="#8A92A6" />
             <input 
                type="text" 
                placeholder="Tìm username hoặc email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="header-actions">
            <button className="icon-btn-circle" onClick={fetchAccounts} title="Làm mới">
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
              <p>Danh sách thành viên đăng ký từ Database</p>
            </div>
            <button className="btn-add-new" onClick={() => setShowAddModal(true)}>
              <UserPlus size={18} /> Thêm thành viên
            </button>
          </div>

          <div className="table-card-container">
            {loading ? (
              <div className="loading-state-box">
                <Loader2 className="spin-icon" /> <p>Đang đồng bộ Database...</p>
              </div>
            ) : error ? (
              <div className="error-state-box">
                <AlertCircle color="#FF4842" size={40} />
                <p>{error}</p>
                <button onClick={fetchAccounts} className="btn-retry">Thử lại</button>
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
                    .filter(a => a.username.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(acc => (
                      <tr 
                        key={acc.username} 
                        onClick={() => setSelectedAcc(acc)} 
                        className={selectedAcc?.username === acc.username ? 'row-active' : ''}
                      >
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
                        <td>{acc.company || "N/A"}</td>
                        <td>
                          <span className={`status-pill ${acc.is_active ? 'active' : 'banned'}`}>
                            {acc.is_active ? 'Hoạt động' : 'Bị khóa'}
                          </span>
                        </td>
                        <td><MoreVertical size={18}/></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* MODAL THÊM THÀNH VIÊN - HIỂN THỊ KHI BẤM NÚT */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Tạo tài khoản Recruiter</h3>
              <button onClick={() => setShowAddModal(false)} className="btn-close-modal"><X /></button>
            </div>
            <form onSubmit={handleAddMember} className="modal-form">
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input required type="text" value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  placeholder="Nhập username..." />
              </div>
              <div className="form-group">
                <label>Email liên kết</label>
                <input required type="email" value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="email@uth.edu.vn" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mật khẩu</label>
                  <div className="pass-box">
                    <input required type={showPassword ? "text" : "password"} value={formData.password1}
                      onChange={e => setFormData({...formData, password1: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Xác nhận lại</label>
                  <input required type={showPassword ? "text" : "password"} value={formData.password2}
                    onChange={e => setFormData({...formData, password2: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="spin-icon" size={16} /> : "Tạo ngay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTION PANEL CHI TIẾT BÊN PHẢI */}
      <div className={`panel-overlay-right ${selectedAcc ? 'show' : ''}`} onClick={() => setSelectedAcc(null)}></div>
      <aside className={`action-panel-right ${selectedAcc ? 'open' : ''}`}>
        {selectedAcc && (
          <div className="panel-body">
            <div className="panel-header">
              <h3>Thông tin thành viên</h3>
              <button className="btn-close-panel" onClick={() => setSelectedAcc(null)}><X size={20}/></button>
            </div>
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
                  <div className="labels"><label>Thuộc công ty</label><p>{selectedAcc.company || 'Chưa cập nhật'}</p></div>
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
  );
};

export default ManageInternalAccount;