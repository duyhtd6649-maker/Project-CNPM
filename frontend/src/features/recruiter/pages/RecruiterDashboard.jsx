import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Search, Bell, User, LayoutDashboard, 
  LogOut, TrendingUp, TrendingDown, Users, 
  FileText, DollarSign, ShieldAlert, CheckCircle,
  Briefcase, ListTodo, Building2, Target // Thêm Target vào đây để hết lỗi
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, 
  PieChart, Pie, Cell 
} from 'recharts';
import '/src/features/recruiter/components/RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const lineData = [
    { name: 'Seg', val1: 400, val2: 240 }, { name: 'Ter', val1: 300, val2: 139 },
    { name: 'Qua', val1: 600, val2: 980 }, { name: 'Qui', val1: 278, val2: 390 },
    { name: 'Sex', val1: 189, val2: 480 }, { name: 'Sab', val1: 239, val2: 380 },
    { name: 'Dom', val1: 349, val2: 430 },
  ];

  const pieData = [
    { name: 'Sales', value: 50, color: '#ff9f43' },
    { name: 'Contract', value: 25, color: '#8357ff' },
    { name: 'Subscriptions', value: 25, color: '#00cfe8' },
  ];

  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-sidebar active">
        <div className="sidebar-header-custom">
          <span className="logo-uth">UTH</span>
          <span className="logo-workplace">WORKPLACE</span>
        </div>
        
        <hr className="sidebar-divider" />

        <nav className="sidebar-nav">
          <div className="nav-link-gradient active">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="nav-link-custom">
            <Briefcase size={20} /> Manage Jobs
          </div>
          <div className="nav-link-custom">
            <ListTodo size={20} /> Candidate Pipeline
          </div>
          <div className="nav-link-custom">
            <Building2 size={20} /> Organization Profile
          </div>
          
          <div className="nav-link-custom logout-item" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </div>
        </nav>
      </aside>

      <main className="dashboard-main-shifted">
        <header className="dashboard-header">
           <div className="header-left">
             <div className="header-search">
               <Search size={18} color="#a3aed0" />
               <input type="text" placeholder="Search" />
             </div>
           </div>
           <div className="header-right">
             <Bell size={20} color="#a3aed0" />
             <div className="user-profile-header" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontWeight: '700', fontSize: '14px', color: '#2b3674'}}>Manager</div>
                  <div style={{fontSize: '12px', color: '#a3aed0'}}>Recruiter</div>
                </div>
                <div className="avatar-circle"><User size={20} /></div>
             </div>
           </div>
        </header>

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header"><span>Total Employee</span> <Users size={18} /></div>
              <div className="stat-value">40,689</div>
              <div className="stat-trend trend-up"><TrendingUp size={14}/> 8.5% Up from yesterday</div>
            </div>
            <div className="stat-card">
              <div className="stat-header"><span>Total KPIs</span> <Target size={18} /></div>
              <div className="stat-value">$89,000</div>
              <div className="stat-trend trend-down"><TrendingDown size={14}/> 4.3% Down from yesterday</div>
            </div>
            <div className="stat-card">
              <div className="stat-header"><span>Total CVs</span> <FileText size={18} /></div>
              <div className="stat-value">10,293</div>
              <div className="stat-trend trend-up"><TrendingUp size={14}/> 1.3% Up from past week</div>
            </div>
            <div className="stat-card">
              <div className="stat-header"><span>Sales</span> <DollarSign size={18} /></div>
              <div className="stat-value">$89.5m</div>
              <div className="stat-trend trend-up"><TrendingUp size={14}/> 1.8% Up from yesterday</div>
            </div>
          </div>

          <div className="main-grid">
            <div className="card-white">
              <h4>Threat Exposure Level</h4>
              <div className="progress-circle-box threat"><span>60%</span></div>
              <p style={{fontSize: '13px', color: '#a3aed0'}}>Your system is moderately exposed.</p>
            </div>
            <div className="card-white">
              <h4>System Security Score</h4>
              <div className="progress-circle-box security"><span>80%</span></div>
              <p style={{fontSize: '13px', color: '#a3aed0'}}>Security is strong.</p>
            </div>
            <div className="card-white">
              <h4>Revenue Target</h4>
              <div className="target-info">
                <h2 style={{color: '#00cfe8', fontSize: '36px', marginTop: '15px'}}>46%</h2>
                <p style={{fontWeight: '700'}}>2,300 / 5,000</p>
                <small style={{color: '#a3aed0'}}>Target achievement status.</small>
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            <div className="chart-container">
              <h4 style={{marginBottom: '20px'}}>Total De Vendas Hoje</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="val1" stroke="#ee5d50" fill="transparent" strokeWidth={3} />
                  <Area type="monotone" dataKey="val2" stroke="#2b3674" fill="transparent" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h4 style={{marginBottom: '20px'}}>Distribution by Business</h4>
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
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;