import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook để chuyển trang
import { 
  Search, Bell, ChevronDown, Users, FileText, 
  DollarSign, TrendingUp, LayoutDashboard, 
  UserCog, Activity, Library, ShieldCheck, 
  ClipboardList, MessageSquare, Gift, Menu, X
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
  { year: '2016', user: 70, repeated: 40 },
  { year: '2017', user: 45, repeated: 30 },
  { year: '2018', user: 60, repeated: 55 },
  { year: '2019', user: 95, repeated: 85 },
  { year: '2020', user: 80, repeated: 70 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Hàm điều hướng
  const goToManageAccount = () => {
    navigate('/manage-internal-account'); // Chỉnh đường dẫn cho khớp với App.js của bạn
  };

  return (
    <div className="admin-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header-uth">
          <div className="uth-branding" onClick={() => navigate('/admin')} style={{cursor:'pointer'}}>
            <span className="uth-blue-text">UTH</span>
            <span className="workplace-green-text"> WORKPLACE</span>
          </div>
          <button className="close-sidebar-btn" onClick={toggleSidebar}><X size={24} /></button>
        </div>
        
        <nav className="sidebar-nav-custom">
          <div className="nav-item-custom active" onClick={() => navigate('/admin')}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </div>
          
          {/* SỰ KIỆN CLICK CHUYỂN TRANG TẠI ĐÂY */}
          <div className="nav-item-custom" onClick={goToManageAccount}>
            <UserCog size={20} /> <span>Manage Account</span>
          </div>

          <div className="nav-item-custom"><Activity size={20} /> <span>Monitor Logs & Analytics</span></div>
          <div className="nav-item-custom"><Library size={20} /> <span>Cabinets of Knowledge</span></div>
          <div className="nav-item-custom"><ShieldCheck size={20} /> <span>System Status Monitor</span></div>
          <div className="nav-item-custom"><ClipboardList size={20} /> <span>System Reports</span></div>
          <div className="nav-item-custom"><MessageSquare size={20} /> <span>Articles Management</span></div>
          <div className="nav-item-custom"><Gift size={20} /> <span>User Package Management</span></div>
        </nav>
      </aside>

      <div className="admin-content-wrapper">
        <header className="admin-header">
          <div className="header-left">
            <button className="header-menu-btn" onClick={toggleSidebar}><Menu size={20} /></button>
            <div className="search-box">
              <Search size={18} color="#94a3b8" />
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <div className="header-right">
            <div className="notification"><Bell size={22} /><span className="badge">6</span></div>
            
            {/* CLICK AVATAR CŨNG CÓ THỂ CHUYỂN TRANG */}
            <div className="user-account-box" onClick={goToManageAccount} style={{cursor:'pointer'}}>
              <div className="avatar-placeholder"></div>
              <ChevronDown size={16} color="#94a3b8" />
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-main">
              <div><p style={{color:'#606060', fontSize:'14px'}}>Total User</p><h2 className="stat-value">40,689</h2></div>
              <div className="stat-icon purple"><Users size={22} /></div>
            </div>
            <p className="stat-change up"><TrendingUp size={14}/> 8.5% <span style={{fontWeight:400, color:'#606060'}}>Up from yesterday</span></p>
          </div>
          <div className="stat-card">
            <div className="stat-main">
              <div><p style={{color:'#606060', fontSize:'14px'}}>Total CVs</p><h2 className="stat-value">10,293</h2></div>
              <div className="stat-icon orange"><FileText size={22} /></div>
            </div>
            <p className="stat-change up"><TrendingUp size={14}/> 1.3% <span style={{fontWeight:400, color:'#606060'}}>Up from week</span></p>
          </div>
          <div className="stat-card">
            <div className="stat-main">
              <div><p style={{color:'#606060', fontSize:'14px'}}>Total Spending</p><h2 className="stat-value">$89,000</h2></div>
              <div className="stat-icon green"><DollarSign size={22} /></div>
            </div>
            <p className="stat-change down" style={{color:'#F93C65'}}><TrendingUp size={14} style={{transform:'rotate(180deg)'}}/> 4.3% <span style={{fontWeight:400, color:'#606060'}}>Down</span></p>
          </div>
          <div className="stat-card">
            <div className="stat-main">
              <div><p style={{color:'#606060', fontSize:'14px'}}>Total Report</p><h2 className="stat-value">2,040</h2></div>
              <div className="stat-icon red"><ClipboardList size={22} /></div>
            </div>
            <p className="stat-change up"><TrendingUp size={14}/> 1.8% <span style={{fontWeight:400, color:'#606060'}}>Up</span></p>
          </div>
        </div>

        {/* CV DETAILS */}
        <div className="chart-main-card">
          <h3 style={{marginBottom:'20px', fontWeight:800}}>CVs Details</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cvData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4880FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#4880FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#4880FF" strokeWidth={3} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM CHARTS */}
        <div className="bottom-grid">
          <div className="bottom-card">
            <h3 style={{fontWeight:800, marginBottom:'20px'}}>Users</h3>
            <div className="donut-container">
              <div className="donut-visual">
                <div className="donut-info">
                  <h4>34,249</h4>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="donut-legend">
                <div className="legend-item">
                  <span className="dot blue"></span> <span>New Users</span>
                </div>
                <div className="legend-item">
                  <span className="dot gray"></span> <span>Repeated</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-card">
            <h3 style={{fontWeight:800, marginBottom:'20px'}}>Total Spending Analytic</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="user" stroke="#4880FF" strokeWidth={3} dot={{r: 6, fill:'#4880FF'}} />
                <Line type="monotone" dataKey="repeated" stroke="#10B981" strokeWidth={3} dot={{r: 6, fill:'#10B981'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;