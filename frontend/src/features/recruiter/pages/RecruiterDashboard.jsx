import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import OrganizationProfile from './OrganizationProfile';
import { useNavigate } from 'react-router-dom';
import RecruiterApplicationManagement from './RecruiterApplicationManagement';
import RecruiterInterviews from './RecruiterInterviews'; // IMPORT NEW COMPONENT

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
  Building2,
  FileText,
  Calendar // Added Calendar Icon
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

import '../components/RecruiterDashboard.css';
import CreateJobPost from './CreateJobPost';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [isSidebarClosed, setSidebarClosed] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // --- 1. STATE LƯU THỐNG KÊ DASHBOARD ---
  const [dashboardStats, setDashboardStats] = useState({
    total_job: 0,
    total_application: 0,
    total_interview: 0
  });

  // --- 2. HÀM GỌI API THỐNG KÊ ---
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const url = `${API_BASE.replace(/\/$/, '')}/api/recruiter/dashboard`; // Gọi đúng endpoint bạn yêu cầu

      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thống kê dashboard:", error);
    }
  };

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
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      setNotifications([]);
    }
  };

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const url = `${API_BASE.replace(/\/$/, '')}/api/recruiter/jobs/`;

      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách job:", error);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchDashboardStats(); // Gọi hàm lấy thống kê khi component load
  }, []);

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
            className={`menu-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <FileText size={22} />
            <span className="menu-text">Applications</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'interviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('interviews')}
          >
            <Calendar size={22} />
            <span className="menu-text">Interviews</span>
          </div>

          <div
            className={`menu-item ${activeTab === 'organization' ? 'active' : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            <Building2 size={22} />
            <span className="menu-text">Organization Profile</span>
          </div>
        </nav>

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
                    activeTab === 'applications' ? 'Application Management' :
                      activeTab === 'interviews' ? 'Interview Management' :
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
              setShowModal(true);
            }}>
              <Plus size={20} />
              <span>Create Job</span>
            </button>

            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <Bell
                size={20}
                color="#A3AED0"
                style={{ cursor: 'pointer' }}
                onClick={() => {
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

          {activeTab === 'dashboard' && (
            <>
              {/* STATS GRID - CẬP NHẬT DỮ LIỆU TỪ API */}
              <div className="stats-grid">

                {/* 1. Total Jobs */}
                <div className="stat-card">
                  <div className="stat-icon-box"><Briefcase size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Total Jobs</p>
                    {/* Hiển thị dữ liệu từ state dashboardStats */}
                    <h3 className="stat-value">{dashboardStats.total_job}</h3>
                  </div>
                </div>

                {/* 2. Applicants */}
                <div className="stat-card">
                  <div className="stat-icon-box" style={{ color: '#05cd99' }}><Users size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Applicants</p>
                    {/* Hiển thị dữ liệu từ state dashboardStats */}
                    <h3 className="stat-value">{dashboardStats.total_application}</h3>
                  </div>
                </div>

                {/* 3. Interviews */}
                <div className="stat-card">
                  <div className="stat-icon-box" style={{ color: '#ffb547' }}><Clock size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Interviews</p>
                    {/* Hiển thị dữ liệu từ state dashboardStats */}
                    <h3 className="stat-value">{dashboardStats.total_interview}</h3>
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

          {activeTab === 'applications' && (
            <div className="dashboard-view">
              <RecruiterApplicationManagement />
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="dashboard-view">
              <RecruiterInterviews />
            </div>
          )}

          {activeTab === 'organization' && (
            <div className="dashboard-view">
              <OrganizationProfile />
            </div>
          )}

        </main>
      </div>

      {showModal && (
        <>
          {ReactDOM.createPortal(
            <CreateJobPost
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false);
                fetchJobs();
                fetchDashboardStats(); // Refresh lại số liệu khi tạo job thành công
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