import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Users, Search, Bell, ChevronDown, 
  MoreHorizontal, Shield, Trash2, CheckCircle, XCircle, 
  Plus, X, Mail, Phone, Lock, Eye, EyeOff, Building2, UserCog,
  ArrowLeft, LogOut
} from 'lucide-react';
import '../components/ManageInternalAccount.css';

const ManageInternalAccount = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State tìm kiếm & Giao diện
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAcc, setSelectedAcc] = useState(null); // User đang xem chi tiết
  
  // State cho Modal Thêm Mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'candidate' // Mặc định là ứng viên
  });

  // Cấu hình API
  const API_URL = "http://127.0.0.1:8000/api/users/"; 

  // --- 1. GỌI API LẤY DATA ---
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      // Xử lý dữ liệu trả về (nếu API trả về dạng phân trang .results)
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error("Lỗi API:", err);
      setError("Không thể kết nối đến server. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // --- 2. XỬ LÝ FORM THÊM MỚI ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API tạo user (Tùy endpoint backend của bạn)
      await axios.post(API_URL, formData);
      alert("Thêm thành công!");
      setShowAddModal(false);
      setFormData({ username: '', email: '', password: '', role: 'candidate' });
      fetchAccounts(); // Load lại danh sách
    } catch (err) {
      alert("Lỗi khi thêm: " + (err.response?.data?.detail || err.message));
    }
  };

  // --- 3. XỬ LÝ SEARCH ---
  const filteredAccounts = accounts.filter(acc => 
    acc.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-page-container">
      {/* --- SIDEBAR TRÁI (Giữ nguyên class cũ để ko lỗi) --- */}
      <aside className="manage-left-sidebar-navy" style={{color: 'white'}}>
        <div className="sidebar-blue-header">
          <div className="uth-branding-box">
            <span style={{color:'white'}}>UTH</span> 
            <span className="workplace-text"> WORKPLACE</span>
          </div>
        </div>
        
        <nav className="manage-nav-list">
          <div className="nav-item active">
            <Users size={20} color="white" /> 
            <span style={{color:'white'}}>Quản lý tài khoản</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/admin')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
        </nav>

        <div className="sidebar-footer-user">
          <div className="sub-nav-item logout-sub" onClick={() => navigate('/login')}>
            <LogOut size={16} /> Đăng xuất
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="manage-main-content" style={{flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden'}}>
        
        {/* Top Header */}
        <header className="top-header-area">
          <div className="header-right-actions">
            <div className="search-box">
              <Search size={16} color="#666"/>
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="notification"><Bell size={20} /></div>
            <div className="user-account-box">
              <div className="avatar-placeholder" style={{width:35, height:35, borderRadius:'50%', background:'#ddd'}}></div>
            </div>
          </div>
        </header>

        {/* View Area */}
        <main className="manage-view-area">
          <div className="data-table-container">
            <div className="table-header-actions">
              <h2>Danh sách tài khoản ({filteredAccounts.length})</h2>
              <button className="btn-add-new" onClick={() => setShowAddModal(true)}>
                <Plus size={18} /> Thêm mới
              </button>
            </div>

            {loading ? (
              <div style={{padding:40, textAlign:'center'}}>Đang tải dữ liệu...</div>
            ) : error ? (
              <div style={{padding:40, textAlign:'center', color:'red'}}>{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Người dùng</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((acc) => (
                      <tr key={acc.id} onClick={() => setSelectedAcc(acc)}>
                        <td>
                          <div style={{display:'flex', alignItems:'center', gap:10}}>
                            <div style={{width:32, height:32, background:'#E0E7FF', color:'#4880FF', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>
                              {acc.username?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{fontWeight:600}}>{acc.username}</span>
                          </div>
                        </td>
                        <td>{acc.email}</td>
                        <td>
                          {acc.is_superuser ? <span className="status-badge active">Admin</span> :
                           acc.role === 'recruiter' ? <span className="status-badge inactive">Recruiter</span> :
                           <span className="status-badge" style={{background:'#F1F5F9', color:'#64748B'}}>Candidate</span>}
                        </td>
                        <td>
                          {acc.is_active ? 
                            <span style={{color:'#10B981', fontWeight:600}}>Active</span> : 
                            <span style={{color:'#EF4444', fontWeight:600}}>Locked</span>}
                        </td>
                        <td><MoreHorizontal size={16} color="#999"/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- PANEL CHI TIẾT (Trượt phải) --- */}
      {selectedAcc && (
        <div className="right-action-panel open" style={{zIndex: 200}}>
          <div className="panel-header">
            <button className="btn-close-panel" onClick={() => setSelectedAcc(null)}>
              <X size={20} />
            </button>
          </div>
          <div className="panel-profile">
            <div className="avatar-lg">{selectedAcc.username?.charAt(0).toUpperCase()}</div>
            <h4>{selectedAcc.username}</h4>
            <span style={{color:'#64748B', fontSize:14}}>{selectedAcc.email}</span>
          </div>
          
          <div className="detail-list">
            <div className="detail-item">
              <Mail size={16} color="#64748B"/>
              <div className="labels">
                <label>Email</label>
                <p>{selectedAcc.email}</p>
              </div>
            </div>
            <div className="detail-item">
              <Shield size={16} color="#64748B"/>
              <div className="labels">
                <label>Quyền hạn</label>
                <p>{selectedAcc.is_superuser ? "Administrator" : "User"}</p>
              </div>
            </div>
          </div>

          <div className="panel-footer-btns">
            <button className="btn-panel-act unban">Reset Mật khẩu</button>
            <button className={`btn-panel-act ${selectedAcc.is_active ? 'ban' : 'unban'}`}>
              {selectedAcc.is_active ? <XCircle size={18}/> : <CheckCircle size={18}/>}
              {selectedAcc.is_active ? "Khóa tài khoản" : "Mở khóa"}
            </button>
            <button className="btn-panel-act delete"><Trash2 size={18}/> Xóa</button>
          </div>
        </div>
      )}

      {/* --- MODAL THÊM MỚI (Popup) --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Thêm người dùng mới</h3>
              <button onClick={() => setShowAddModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input name="username" required value={formData.username} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" required value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <div style={{position:'relative'}}>
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={formData.password} 
                    onChange={handleInputChange} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position:'absolute', right:10, top:10, background:'none', border:'none', cursor:'pointer'}}>
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select name="role" value={formData.role} onChange={handleInputChange} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd'}}>
                  <option value="candidate">Ứng viên (Candidate)</option>
                  <option value="recruiter">Nhà tuyển dụng (Recruiter)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button type="submit" className="btn-submit">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInternalAccount;