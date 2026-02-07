import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AppProviders';
import ApplicationReview from './ApplicationReview';
import {
    LayoutDashboard, UserCog, Activity, Library,
    ShieldCheck, ClipboardList, MessageSquare, Gift,
    Menu, X, Bell, ChevronDown, ArrowLeft,
    Server, Database, Globe, Cpu, HardDrive, Users
} from 'lucide-react';
import '../components/SystemStatus.css';
import adminApi from '../services/adminApi';

const SystemStatus = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Data State
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        uptime: '0%',
        cpu: 0,
        memory: 0,
        services: []
    });

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const fetchData = async () => {
        setLoading(true);
        const result = await adminApi.getSystemStatus();
        setData(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // Optional: Auto-refresh every 30 seconds for "real-time" feel
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Helper to determine status color
    const getStatusType = (status) => {
        if (status === 'operational') return 'status-operational';
        if (status === 'degraded') return 'status-degraded';
        return 'status-operational'; // default
    };

    return (
        <div className="system-status-container">


            {/* --- Secondary Sidebar (Sub-navigation for System Status) --- */}
            <aside className="manage-left-sidebar">
                <div className="sidebar-blue-header">
                    <button className="header-menu-btn-white" onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: 'white' }}><Menu size={20} /></button>
                    <div className="uth-branding" style={{ color: 'white' }}>
                        <span>SYSTEM</span><span> MONITOR</span>
                    </div>
                </div>

                <nav className="sub-nav-list">
                    <div className="sub-nav-item" onClick={() => navigate('/admin')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </div>
                    <div className="sub-nav-item active">
                        <Activity size={18} /> Monitor System Status
                    </div>
                    <div className="sub-nav-item" onClick={() => navigate('/job-posts')}>
                        <ClipboardList size={18} /> Monitor Job Post
                    </div>
                </nav>

                <div className="sub-sidebar-footer">
                    <div className="sub-nav-item" onClick={() => navigate('/admin')}>
                        <ArrowLeft size={18} style={{ marginRight: '10px' }} /> Back to menu
                    </div>
                    <div className="divider-sub"></div>
                    <div className="sub-nav-item-small">Admin Profile</div>
                    <div className="sub-nav-item logout-sub">Logout</div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <div className="status-right-content">
                <header className="status-top-header">
                    <div className="header-right-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="notification" style={{ position: 'relative' }}>
                            <Bell size={22} color="#64748b" />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>3</span>
                        </div>
                        <div className="user-account-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Admin')}&background=4880FF&color=fff&bold=true`} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
                            <ChevronDown size={16} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                <main className="status-view-area">
                    <h2 className="page-title">System Status Monitor</h2> {/* Correct Title */}

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading system status...</div>
                    ) : (
                        <>
                            {/* Metrics Grid */}
                            <div className="status-dashboard-grid">
                                <div className="status-card">
                                    <div className="status-card-header">
                                        <span className="status-card-title">Server Uptime</span>
                                        <Activity size={20} color="#10B981" />
                                    </div>
                                    <div className="status-metric-value">{data.uptime}</div>
                                    <div className="status-indicator good">
                                        Running smoothly
                                    </div>
                                </div>

                                <div className="status-card">
                                    <div className="status-card-header">
                                        <span className="status-card-title">CPU Usage</span>
                                        <Cpu size={20} color="#4880FF" />
                                    </div>
                                    <div className="status-metric-value">{data.cpu}%</div>
                                    <div className={`status-indicator ${data.cpu > 80 ? 'error' : data.cpu > 60 ? 'warning' : 'good'}`}>
                                        {data.cpu > 80 ? 'Heavy Load' : data.cpu > 60 ? 'Moderate Load' : 'Optimal Load'}
                                    </div>
                                </div>

                                <div className="status-card">
                                    <div className="status-card-header">
                                        <span className="status-card-title">Memory</span>
                                        <HardDrive size={20} color="#F59E0B" />
                                    </div>
                                    <div className="status-metric-value">{data.memory} GB</div>
                                    <div className={`status-indicator ${parseFloat(data.memory) > 10 ? 'warning' : 'good'}`}>
                                        {parseFloat(data.memory) > 10 ? 'High Usage' : 'Normal Usage'}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Service Status */}
                            <div className="services-health-section">
                                <div className="section-header">
                                    <h3 className="section-title">Service Health Check</h3>
                                    <button
                                        onClick={fetchData}
                                        style={{ background: 'none', border: 'none', color: '#4880FF', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Refresh Status
                                    </button>
                                </div>

                                <div className="services-list">
                                    {data.services.map((service, index) => (
                                        <div className="service-item" key={index}>
                                            <div className="service-info">
                                                <div className="service-icon"><Database size={20} /></div>
                                                <div>
                                                    <div className="service-name">{service.name}</div>
                                                    <div className="service-uptime">
                                                        {service.uptime || service.latency || service.details || 'Active'}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`service-status-badge ${getStatusType(service.status)}`}>
                                                {service.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SystemStatus;
