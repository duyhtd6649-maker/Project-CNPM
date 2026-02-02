import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Search, Bell, User, LayoutDashboard, 
  LogOut, TrendingUp, TrendingDown, Users, 
  Briefcase, ListTodo, Building2, Target, Plus, Eye, Edit, Trash2, Moon, Info, CheckCircle
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, 
  PieChart, Pie, Cell 
} from 'recharts';

import '../components/RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const lineData = [
    { name: 'Seg', val1: 400, val2: 240 }, { name: 'Ter', val1: 300, val2: 139 },
    { name: 'Qua', val1: 600, val2: 980 }, { name: 'Qui', val1: 278, val2: 390 },
    { name: 'Sex', val1: 189, val2: 480 }, { name: 'Sab', val1: 239, val2: 380 },
  ];

  const pieData = [
    { name: 'Tech', value: 400, color: '#4318FF' },
    { name: 'Design', value: 300, color: '#6AD2FF' },
    { name: 'Marketing', value: 300, color: '#EFF4FB' },
  ];

  return (
    <div className={`dashboard-wrapper ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* SIDEBAR CHI TIẾT */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header-custom">
          <span className="logo-uth">UTH</span>
          <span className="logo-workplace"> WORKPLACE</span>
        </div>
        <div className="sidebar-divider"></div>
        
        <nav className="sidebar-menu">
          <div className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} />
            <span className="menu-text">Main Dashboard</span>
          </div>
          
          <div className={`menu-item ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
            <Briefcase size={20} />
            <span className="menu-text">Manage Jobs</span>
          </div>

          <div className="menu-item">
            <Users size={20} />
            <span className="menu-text">Candidates</span>
          </div>

          <div className="menu-item">
            <ListTodo size={20} />
            <span className="menu-text">Interviews</span>
          </div>

          <div className="menu-item">
            <Building2 size={20} />
            <span className="menu-text">Company Profile</span>
          </div>

          <div className="menu-item">
            <Target size={20} />
            <span className="menu-text">Analytics</span>
          </div>
        </nav>

        <div className="sidebar-footer" onClick={handleLogout}>
          <LogOut size={20} />
          <span className="menu-text">Log Out</span>
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH */}
      <div className="main-container-right">
        <header className="dashboard-header">
          <div className="header-left">
            <Menu className="toggle-btn" size={24} onClick={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="header-titles">
              <p className="breadcrumb">Pages / {activeTab === 'dashboard' ? 'Dashboard' : 'Manage Jobs'}</p>
              <h1 className="page-title">{activeTab === 'dashboard' ? 'Main Dashboard' : 'Job Listings'}</h1>
            </div>
          </div>

          <div className="header-right-tools">
            <div className="header-search">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
            <Bell size={20} className="icon-btn" />
            <Moon size={20} className="icon-btn" />
            <Info size={20} className="icon-btn" />
            <div className="avatar-circle">
              <User size={20} />
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {activeTab === 'dashboard' ? (
            /* TAB 1: DASHBOARD MẶC ĐỊNH */
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Earnings</span>
                  <div className="stat-value">$350.4</div>
                  <span className="trend-up"><TrendingUp size={12}/> +12%</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Spend this month</span>
                  <div className="stat-value">$642.39</div>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Sales</span>
                  <div className="stat-value">$574.34</div>
                  <span className="trend-up"><TrendingUp size={12}/> +23%</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Your Balance</span>
                  <div className="stat-value">$1,000</div>
                </div>
              </div>

              <div className="bottom-grid">
                <div className="chart-container">
                  <div className="chart-header">
                    <h4>Check Table</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="val1" stroke="#4318FF" fill="#4318FF" fillOpacity={0.1} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-container">
                  <h4>Daily Traffic</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            /* TAB 2: QUẢN LÝ CÔNG VIỆC */
            <div className="manage-jobs-container">
              <div className="section-header">
                <h3>Complex Table</h3>
                <button className="btn-create">
                  <Plus size={18} /> Add New Job
                </button>
              </div>
              <div className="table-responsive">
                <table className="jobs-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                      <th>PROGRESS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="job-name-text">Senior React Developer</span></td>
                      <td>
                        <div className="status-badge active"><CheckCircle size={14} /> Active</div>
                      </td>
                      <td>12.Jan.2024</td>
                      <td><div className="progress-container"><div className="progress-bar" style={{width: '75.5%'}}></div></div></td>
                      <td className="actions-cell">
                        <button className="icon-btn-action"><Edit size={16}/></button>
                        <button className="icon-btn-action delete"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                    <tr>
                      <td><span className="job-name-text">UI/UX Designer</span></td>
                      <td>
                        <div className="status-badge pending"><Info size={14} /> Pending</div>
                      </td>
                      <td>15.Feb.2024</td>
                      <td><div className="progress-container"><div className="progress-bar" style={{width: '25.5%'}}></div></div></td>
                      <td className="actions-cell">
                        <button className="icon-btn-action"><Edit size={16}/></button>
                        <button className="icon-btn-action delete"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;