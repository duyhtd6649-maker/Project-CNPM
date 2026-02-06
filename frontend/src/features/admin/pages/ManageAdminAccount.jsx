import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AppProviders';
import {
  LayoutDashboard, UserCog, Activity, Library,
  ShieldCheck, ClipboardList, MessageSquare, Gift,
  Menu, X, Settings, Bell, ChevronDown, ArrowLeft, Users
} from 'lucide-react';
import '../components/ManageInternalAccount.css';
import axios from 'axios';

const ManageAdminAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeTab = 'admin';
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/users/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter for superusers or admin role
        const adminUsers = response.data.filter(u => u.role === 'admin' || u.is_active);
        // Wait, 'is_active' is true for everyone. I need 'is_superuser' but UserSerializer usually doesn't expose it unless I check fields.
        // Step 457 UserSerializer fields: ['username','email', 'company', 'role','is_active']
        // It DOES NOT have 'is_superuser'.
        // However, I can filter by role === 'admin' if that's how they are set.
        // Or I can assume 'role' field is used for admins too if set manually.
        // For now, I'll filter by role === 'admin' which I saw in the dropdown in ManageInternalAccount.

        const filtered = response.data.filter(u => u.role === 'admin' || u.username === 'admin'); // Fallback
        setAdmins(filtered);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError("Không thể tải danh sách Admin.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="manage-page-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header-uth">
          <div className="uth-branding" onClick={() => navigate('/admin')}>
            <span className="uth-blue-text">UTH</span>
            <span className="workplace-green-text"> WORKPLACE</span>
          </div>
          <button className="close-sidebar-btn" onClick={toggleSidebar}><X size={24} /></button>
        </div>
        <nav className="sidebar-nav-custom">
          <div className="nav-item-custom" onClick={() => navigate('/admin')}><LayoutDashboard size={20} /> <span>Dashboard</span></div>

          <div className="sidebar-divider-text">ACCOUNT MANAGEMENT</div>
          <div className="nav-item-custom" onClick={() => navigate('/manage-internal')}><ShieldCheck size={20} /> <span>Internal Accounts</span></div>
          <div className="nav-item-custom" onClick={() => navigate('/manage-candidate')}><Users size={20} /> <span>Candidates</span></div>
          <div className="nav-item-custom" onClick={() => navigate('/manage-recruiter')}><UserCog size={20} /> <span>Recruiters</span></div>
          <div className="nav-item-custom active"><Activity size={20} /> <span>Admin Accounts</span></div>


        </nav>
      </aside>

      <aside className="manage-left-sidebar">
        <div className="sidebar-blue-header">
          <button className="header-menu-btn-white" onClick={toggleSidebar}><Menu size={20} /></button>
          <div className="uth-branding-white">
            <span className="uth-text">UTH</span>
            <span className="workplace-text"> WORKPLACE</span>
          </div>
        </div>

        <nav className="sub-nav-list">
          <div className={`sub-nav-item ${activeTab === 'internal' ? 'active' : ''}`} onClick={() => navigate('/manage-internal')}>Internal Account</div>
          <div className={`sub-nav-item ${activeTab === 'candidate' ? 'active' : ''}`} onClick={() => navigate('/manage-candidate')}>Candidate Account</div>
          <div className={`sub-nav-item ${activeTab === 'recruiter' ? 'active' : ''}`} onClick={() => navigate('/manage-recruiter')}>Recruiter Account</div>
          <div className={`sub-nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => navigate('/manage-admin-acc')}>Admin Account</div>
        </nav>

        <div className="sub-sidebar-footer">
          <div className="sub-nav-item" onClick={() => navigate('/admin')}>
            <ArrowLeft size={18} style={{ marginRight: '10px' }} /> Back to menu
          </div>
          <div className="divider-sub"></div>
          <div className="sub-nav-item-small">My Profile</div>
          <div className="sub-nav-item-small">Permissions</div>
          <div className="sub-nav-item logout-sub">Logout</div>
        </div>
      </aside>

      <div className="manage-right-content">
        <header className="manage-top-header">
          <div className="header-right-actions">
            <div className="notification"><Bell size={22} /><span className="badge">1</span></div>
            <div className="user-account-box">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Admin')}&background=4880FF&color=fff&bold=true`} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
              <ChevronDown size={16} color="#94a3b8" />
            </div>
          </div>
        </header>

        <main className="manage-view-area">
          <div className="view-header">
            <h2>Admin Account Management</h2>
            <button className="btn-add-new">Add New Account</button>
          </div>
          <div className="view-content-card" style={{ display: 'block', padding: '20px' }}>
            {loading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <table className="custom-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Admin</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.username} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar-sm" style={{ width: 32, height: 32, background: '#E0E7FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {admin.username?.charAt(0).toUpperCase()}
                          </div>
                          <span>{admin.username}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px' }}>{admin.email}</td>
                      <td style={{ padding: '10px' }}>N/A</td>
                      <td style={{ padding: '10px' }}>
                        <Settings size={16} color="#666" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageAdminAccount;