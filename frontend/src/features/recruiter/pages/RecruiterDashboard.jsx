import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import OrganizationProfile from './OrganizationProfile';
import { useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Briefcase,
  Users,
  Plus,
  Search,
  Bell,
  Moon,
  User,
  LogOut,
  TrendingUp,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Building2 // Gộp Building2 vào đây cho gọn
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Import CSS
import '../components/RecruiterDashboard.css';
// Import component CreateJobPost
import CreateJobPost from './CreateJobPost';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [isSidebarClosed, setSidebarClosed] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const url = `${API_BASE.replace(/\/$/, '')}/api/notification`;

      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        setNotifications(response.data);
      } else {
        // Mock Data for Testing
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      // Fallback Mock Data
      setNotifications([]);
    }
  };

  // --- LOGIC BACKEND: State lưu danh sách jobs ---
  const [jobs, setJobs] = useState([]);

  // --- LOGIC BACKEND: Hàm lấy danh sách job ---
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('access_token');
      // Use backend base URL from Vite env, fallback to localhost:8000
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      // backend routes are mounted under /api/
      const url = `${API_BASE.replace(/\/$/, '')}/api/recruiter/jobs/`;
      console.log('Requesting jobs from:', url);
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('API status:', response.status, 'data:', response.data);
      // If backend returns a JSON array on success, set it. Otherwise keep empty.
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách job:", error);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Logic Log Out
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const chartData = [
    { name: 'Sep', apps: 350 },
    { name: 'Oct', apps: 450 },
    { name: 'Nov', apps: 300 },
    { name: 'Dec', apps: 800 },
    { name: 'Jan', apps: 500 },
    { name: 'Feb', apps: 700 },
  ];

  return (
    <div className={`dashboard-wrapper ${isSidebarClosed ? 'sidebar-closed' : ''}`}>

      {/* --- SIDEBAR --- */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header-custom">
          UTH <span className="logo-workplace">Workplace</span>
        </div>
        <div className="sidebar-divider"></div>

        <nav className="sidebar-menu">
          <div
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={22} />
            <span className="menu-text">Dashboard</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={22} />
            <span className="menu-text">My Jobs</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            <Users size={22} />
            <span className="menu-text">Candidates</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'organization' ? 'active' : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            <Building2 size={22} />
            <span className="menu-text">Organization Profile</span>
          </div>
        </nav>

        {/* Nút Log Out nằm ở cuối sidebar */}
        <div className="sidebar-footer" style={{ padding: '20px' }}>
          <div className="menu-item logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogOut size={22} />
            <span className="menu-text">Log Out</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="main-container-right">

        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-titles">
            <p className="breadcrumb">
              Pages / {
                activeTab === 'dashboard' ? 'Dashboard' :
                  activeTab === 'organization' ? 'Organization' :
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
              }
            </p>
            <h2 className="page-title">
              {
                activeTab === 'dashboard' ? 'Main Dashboard' :
                  activeTab === 'organization' ? 'Organization Profile' :
                    'Management'
              }
            </h2>
          </div>

          <div className="header-right-tools">
            <div className="search-container-custom">
              <Search size={18} color="#A3AED0" />
              <input type="text" placeholder="Search..." />
            </div>

            <button className="btn-create" onClick={() => {
              console.log('🔍 Create Job clicked, showModal:', showModal);
              setShowModal(true);
              console.log('🔍 showModal state updated to true');
            }}>
              <Plus size={20} />
              <span>Create Job</span>
            </button>

            {/* Notification Logic */}
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <Bell
                size={20}
                color="#A3AED0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  // Toggle notification dropdown
                  const newState = !showNotifications;
                  setShowNotifications(newState);
                  if (newState) {
                    fetchNotifications();
                  }
                }}
              />
              {notifications.length > 0 && <span className="notification-badge"></span>}

              {showNotifications && (
                <div className="recruiter-notification-dropdown">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                  </div>
                  <div className="dropdown-content">
                    {notifications.length > 0 ? (
                      notifications.map((item, idx) => (
                        <div key={idx} className="dropdown-item">
                          <div className="item-title">{item.title || 'System Notification'}</div>
                          <div className="item-message">{item.message}</div>
                          <div className="item-time">{new Date(item.created_date).toLocaleString()}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-notification">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Moon size={20} color="#A3AED0" style={{ cursor: 'pointer' }} />
            <div className="avatar-circle" style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: '#F4F7FE', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#2b3674'
            }}>
              <User size={20} />
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="dashboard-content">

          {/* TRƯỜNG HỢP 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* STATS GRID */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-box"><Briefcase size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Total Jobs</p>
                    <h3 className="stat-value">{jobs.length || 124}</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-box" style={{ color: '#05cd99' }}><Users size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Applicants</p>
                    <h3 className="stat-value">1,482</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-box" style={{ color: '#ffb547' }}><Clock size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Interviews</p>
                    <h3 className="stat-value">45</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-box" style={{ color: '#ee5d50' }}><CheckCircle size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Hired</p>
                    <h3 className="stat-value">12</h3>
                  </div>
                </div>
              </div>

              {/* CHART & STATISTICS */}
              <div className="bottom-grid">
                <div className="chart-container">
                  <div className="chart-header" style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#2b3674', fontSize: '20px' }}>Application Trends</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4318FF" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F7FE" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="apps" stroke="#4318FF" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h4 style={{ color: '#2b3674', fontSize: '20px', marginBottom: '20px' }}>Daily Statistics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p style={{ color: '#A3AED0' }}>Dữ liệu tổng hợp theo ngày sẽ hiển thị tại đây.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TRƯỜNG HỢP 2: MY JOBS */}
          {activeTab === 'jobs' && (
            <div className="table-card">
              <div className="table-header">
                <h3>Active Job Listings</h3>
                <MoreHorizontal style={{ color: '#A3AED0', cursor: 'pointer' }} />
              </div>
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job Name</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr key={job.id}>
                        <td><span className="job-name-text">{job.title}</span></td>
                        <td>
                          <div className={`status-badge ${job.status === 'Open' ? 'active' : job.status === 'Pending' ? 'pending' : 'pending'}`}>
                            {job.status === 'Open' ? <CheckCircle size={14} /> : <Clock size={14} />} {job.status || 'Pending'}
                          </div>
                        </td>
                        <td>{new Date().toLocaleDateString('en-GB')}</td>
                        <td>
                          <div className="progress-container">
                            <div className="progress-bar" style={{ width: '10%' }}></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#A3AED0' }}>
                        Không có job postings
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TRƯỜNG HỢP 3: CANDIDATES */}
          {activeTab === 'candidates' && (
            <div className="dashboard-view">
              <h3>Candidates Management</h3>
              <p>Tính năng đang phát triển...</p>
            </div>
          )}

          {/* TRƯỜNG HỢP 4: ORGANIZATION PROFILE */}
          {activeTab === 'organization' && (
            <div className="dashboard-view">
              <OrganizationProfile />
            </div>
          )}

        </main>
      </div>

      {/* PORTAL CHO MODAL */}
      {showModal && (
        <>
          {console.log('📋 Rendering CreateJobPost modal, showModal:', showModal)}
          {ReactDOM.createPortal(
            <CreateJobPost
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false);
                fetchJobs();
              }}
            />,
            document.body
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterDashboard;