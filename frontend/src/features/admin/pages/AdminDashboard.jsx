import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AppProviders';
import {
  Search, Bell, ChevronDown, Users, FileText,
  TrendingUp, LayoutDashboard, UserCog, Activity,
  ShieldCheck, Menu, X, LogOut
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import "../components/AdminDashboard.css";



const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    overview: { total_users: 0, total_questions: 0, total_files: 0, total_jobs: 0 },
    registration_analytics: [],
    user_segments: { recruiters: 0, candidates: 0, total: 0 },
    job_growth: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://127.0.0.1:8000/api/admin/dashboard-stats/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setUser(null);
      navigate('/admin-login');
    }
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header-uth">
          <div className="uth-branding">
            <span className="uth-blue-text">UTH</span>
            {isSidebarOpen && <span className="workplace-green-text"> WORKPLACE</span>}
          </div>
        </div>

        <nav className="sidebar-nav-custom">
          {/* 1. DASHBOARD */}
          <div className="nav-item-custom active" onClick={() => navigate('/admin')}>
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </div>

          {/* 2. ACCOUNT MANAGEMENT */}
          {isSidebarOpen && <div className="sidebar-divider-text">ACCOUNT MANAGEMENT</div>}

          <div className="nav-item-custom" onClick={() => navigate('/manage-internal')}>
            <UserCog size={20} />
            {isSidebarOpen && <span>Manage Account</span>}
          </div>

          {/* 3. FEATURES */}
          {isSidebarOpen && <div className="sidebar-divider-text">FEATURES</div>}

          <div className="nav-item-custom">
            <Activity size={20} />
            {isSidebarOpen && <span>Monitor Logs & Analytics</span>}
          </div>

          <div className="nav-item-custom" onClick={() => navigate('/cv-templates')}>
            <FileText size={20} />
            {isSidebarOpen && <span>Cabinets of Knowledge</span>}
          </div>

          <div className="nav-item-custom" onClick={() => navigate('/system-status')}>
            <ShieldCheck size={20} />
            {isSidebarOpen && <span>System Status Monitor</span>}
          </div>

          <div className="nav-item-custom">
            <TrendingUp size={20} />
            {isSidebarOpen && <span>System Reports</span>}
          </div>

          <div className="nav-item-custom">
            <FileText size={20} />
            {isSidebarOpen && <span>Articles Management</span>}
          </div>

          <div className="nav-item-custom">
            <Users size={20} />
            {isSidebarOpen && <span>User Package Management</span>}
          </div>
        </nav>

        <div className="sub-sidebar-footer">
          <div className="nav-item-custom logout-sub" onClick={handleLogout}>
            <LogOut size={18} />
            {isSidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main">
        <header className="admin-navbar">
          <button className="toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search analytics..." />
          </div>

          <div className="nav-actions">
            <div className="nav-icon">
              <Bell size={20} />
              <span className="badge">3</span>
            </div>
            <div className="admin-profile-trigger">
              <img src={`https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=4880FF&color=fff`} alt="Avatar" />
              <div className="admin-info">
                <p className="admin-name">{user?.username || 'Super Admin'}</p>
                <p className="admin-role">Administrator</p>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <h1 className="page-title">Dashboard Overview</h1>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Total Users</p>
                <h2 className="stat-value">{dashboardData.overview.total_users.toLocaleString()}</h2>
                <p className="stat-change up"><TrendingUp size={14} /> --</p>
              </div>
              <div className="stat-icon blue"><Users size={28} /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Total Questions</p>
                <h2 className="stat-value">{dashboardData.overview.total_questions.toLocaleString()}</h2>
                <p className="stat-change up"><TrendingUp size={14} /> --</p>
              </div>
              <div className="stat-icon green"><Activity size={28} /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Total Files</p>
                <h2 className="stat-value">{dashboardData.overview.total_files.toLocaleString()}</h2>
                <p className="stat-change up"><TrendingUp size={14} /> --</p>
              </div>
              <div className="stat-icon red"><FileText size={28} /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Jobs Quantity</p>
                <h2 className="stat-value">{dashboardData.overview.total_jobs.toLocaleString()}</h2>
                <p className="stat-change up"><TrendingUp size={14} /> --</p>
              </div>
              <div className="stat-icon purple" style={{ background: '#F3E8FF', color: '#9333EA' }}><LayoutDashboard size={28} /></div>
            </div>
          </div>

          {/* Registration Analytics Chart */}
          <div className="chart-main-card">
            <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Registration Analytics</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={dashboardData.registration_analytics}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4880FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4880FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#4880FF" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bottom-grid">
            <div className="bottom-card">
              <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>User Segments</h3>
              <div className="donut-container">
                <div className="donut-visual">
                  <div className="donut-info">
                    <h4>{dashboardData.user_segments.total.toLocaleString()}</h4>
                    <p>Total Users</p>
                  </div>
                  {/* Simple CSS Pie Chart representation could be added here if needed, keeping it simple for now */}
                </div>
                <div className="donut-legend">
                  <div className="legend-item"><span className="dot blue"></span> <span>Recruiters ({dashboardData.user_segments.recruiters})</span></div>
                  <div className="legend-item"><span className="dot gray"></span> <span>Candidates ({dashboardData.user_segments.candidates})</span></div>
                </div>
              </div>
            </div>

            <div className="bottom-card">
              <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Job Post Quantity</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dashboardData.job_growth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="jobs" stroke="#4880FF" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;