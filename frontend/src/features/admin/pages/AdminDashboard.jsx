import React, { useState } from 'react';
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

const cvData = [
  { name: '5k', value: 25 }, { name: '10k', value: 35 }, { name: '15k', value: 55 },
  { name: '20k', value: 45 }, { name: '25k', value: 90 }, { name: '30k', value: 40 },
  { name: '35k', value: 55 }, { name: '40k', value: 65 }, { name: '45k', value: 45 },
  { name: '50k', value: 75 }, { name: '55k', value: 50 }, { name: '60k', value: 60 },
];

const spendingData = [
  { year: '2015', user: 30, repeated: 10 },
  { year: '2016', user: 50, repeated: 25 },
  { year: '2017', user: 45, repeated: 20 },
  { year: '2018', user: 80, repeated: 40 },
  { year: '2019', user: 60, repeated: 35 },
  { year: '2020', user: 90, repeated: 55 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

          <div className="nav-item-custom">
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
                <h2 className="stat-value">40,689</h2>
                <p className="stat-change up"><TrendingUp size={14} /> 8.5% Up</p>
              </div>
              <div className="stat-icon blue"><Users size={28} /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Active Jobs</p>
                <h2 className="stat-value">10,293</h2>
                <p className="stat-change up"><TrendingUp size={14} /> 1.3% Up</p>
              </div>
              <div className="stat-icon green"><FileText size={28} /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p className="stat-label">Pending Approval</p>
                <h2 className="stat-value">2,040</h2>
                <p className="stat-change up"><TrendingUp size={14} /> 4.3% Up</p>
              </div>
              <div className="stat-icon red"><Activity size={28} /></div>
            </div>
          </div>

          {/* Registration Analytics Chart */}
          <div className="chart-main-card">
            <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Registration Analytics</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={cvData}>
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
                    <h4>34,249</h4>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="donut-legend">
                  <div className="legend-item"><span className="dot blue"></span> <span>Recruiters</span></div>
                  <div className="legend-item"><span className="dot gray"></span> <span>Candidates</span></div>
                </div>
              </div>
            </div>

            <div className="bottom-card">
              <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Platform Growth</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="user" stroke="#4880FF" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="repeated" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
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