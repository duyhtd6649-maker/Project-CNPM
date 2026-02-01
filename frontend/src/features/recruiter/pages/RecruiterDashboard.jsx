import React, { useState } from 'react';
import { 
  Menu, Search, Bell, User, ChevronDown, 
  LayoutDashboard, Briefcase, Users, Building2,
  TrendingUp, TrendingDown, ShieldCheck, Target, PieChart,
  LogOut, Settings
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

 
  const lineData = [
    { name: 'Seg', actual: 4000, previous: 2400 },
    { name: 'Ter', actual: 3000, previous: 1398 },
    { name: 'Qua', actual: 2000, previous: 9800 },
    { name: 'Qui', actual: 2780, previous: 3908 },
    { name: 'Sex', actual: 1890, previous: 4800 },
    { name: 'Sab', actual: 2390, previous: 3800 },
    { name: 'Dom', actual: 3490, previous: 4300 },
  ];

  return (
    <div className="dashboard-wrapper">
      
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <span className="logo-uth">UTH</span>
          <span className="logo-workplace">WORKPLACE</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group-label">Main Menu</div>
          <div className="nav-link active"><LayoutDashboard size={18} /> Dashboard</div>
          <div className="nav-link"><Briefcase size={18} /> Manage Jobs</div>
          <div className="nav-link"><Users size={18} /> Candidate Pipeline</div>
          <div className="nav-link"><Building2 size={18} /> Organization</div>
          <div className="nav-separator"></div>
          <div className="nav-link"><Settings size={18} /> Settings</div>
          <div className="nav-link text-red"><LogOut size={18} /> Logout</div>
        </nav>
      </aside>

      
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="dashboard-content">
        
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="header-search">
              <Search size={18} />
              <input type="text" placeholder="Search analytics, candidates..." />
            </div>
          </div>
          
          <div className="header-right">
            <div className="notif-badge">
              <Bell size={22} />
              <span className="count">6</span>
            </div>
            <div className="profile-pill">
              <div className="avatar-sm">JS</div>
              <div className="profile-text">
                <span className="name">Manager</span>
                <span className="role">Recruiter</span>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

       
        <main className="dashboard-main">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <p>Total Employee</p>
                <h3>40,689</h3>
                <span className="trend-up"><TrendingUp size={14}/> 8.5% Up</span>
              </div>
              <div className="stat-icon bg-blue"><Users /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p>Total KPIs</p>
                <h3>$89,000</h3>
                <span className="trend-down"><TrendingDown size={14}/> 4.3% Down</span>
              </div>
              <div className="stat-icon bg-green"><Target /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p>Total CVs</p>
                <h3>10,293</h3>
                <span className="trend-up"><TrendingUp size={14}/> 1.3% Up</span>
              </div>
              <div className="stat-icon bg-orange"><Briefcase /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <p>Sales</p>
                <h3>$89.5m</h3>
                <span className="trend-up"><TrendingUp size={14}/> 1.8% Up</span>
              </div>
              <div className="stat-icon bg-red"><PieChart /></div>
            </div>
          </div>

          <div className="mid-section">
            <div className="score-card">
              <h4>System Security Score</h4>
              <div className="gauge-container">
                <div className="gauge-value">80%</div>
              </div>
              <p>Some areas need improvement</p>
            </div>
            <div className="chart-main-wrapper">
              <h4>Total De Vendas Hoje</h4>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={lineData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    <Area type="monotone" dataKey="previous" stroke="#f43f5e" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;