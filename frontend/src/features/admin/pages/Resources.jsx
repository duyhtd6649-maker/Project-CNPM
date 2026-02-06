import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AppProviders';
import {
    LayoutDashboard, FileText, MessageSquare, BookOpen,
    ArrowLeft, Bell, ChevronDown, Plus, Download, File,
    UserCog, Activity, ShieldCheck, ClipboardList, Gift, Menu, X, LogOut
} from 'lucide-react';
import '../components/Cabinets.css';
import { Trash2 } from 'lucide-react';

const Resources = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            const res = await axios.get('http://127.0.0.1:8000/api/cabinets/resources/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResources(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        // Derive type from extension
        const ext = file.name.split('.').pop().toUpperCase();
        formData.append('type', ext);

        // Size string (e.g. "1.2 MB")
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        formData.append('size', sizeMB + ' MB');

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://127.0.0.1:8000/api/cabinets/resources/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Resource uploaded successfully!');
            fetchResources();
            setIsModalOpen(false);
            setTitle('');
            setFile(null);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to upload resource';
            alert(`Error: ${JSON.stringify(errorMsg)}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://127.0.0.1:8000/api/cabinets/resources/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchResources();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="cabinets-container">
            {/* --- Main Admin Sidebar --- */}
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
                    <div className="nav-item-custom" onClick={() => navigate('/manage-internal')}><UserCog size={20} /> <span>Manage Account</span></div>
                    <div className="sidebar-divider-text">FEATURES</div>
                    <div className="nav-item-custom"><Activity size={20} /> <span>Monitor Logs & Analytics</span></div>

                    {/* Active State for Cabinets */}
                    <div className="nav-item-custom active" onClick={() => navigate('/cv-templates')}>
                        <FileText size={20} /> <span>Cabinets of Knowledge</span>
                    </div>

                    <div className="nav-item-custom" onClick={() => navigate('/system-status')}><ShieldCheck size={20} /> <span>System Status Monitor</span></div>
                    <div className="nav-item-custom"><ClipboardList size={20} /> <span>System Reports</span></div>
                    <div className="nav-item-custom"><MessageSquare size={20} /> <span>Articles Management</span></div>
                    <div className="nav-item-custom"><Gift size={20} /> <span>User Package Management</span></div>
                </nav>
            </aside>

            {/* --- Secondary Sidebar --- */}
            <aside className="cabinets-left-sidebar">
                <div className="sidebar-blue-header">
                    <BookOpen size={24} color="#4880FF" />
                    <div className="uth-branding" style={{ color: 'white' }}>
                        <span>KNOWLEDGE</span><span> CABINET</span>
                    </div>
                </div>

                <nav className="sub-nav-list">
                    <div className="sub-nav-item" onClick={() => navigate('/admin')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </div>

                    <div className="sub-nav-item" onClick={() => navigate('/cv-templates')}>
                        <FileText size={18} /> CV Templates
                    </div>

                    <div className="sub-nav-item" onClick={() => navigate('/interview-questions')}>
                        <MessageSquare size={18} /> Interview Questions
                    </div>

                    <div className="sub-nav-item active">
                        <BookOpen size={18} /> Resources
                    </div>
                </nav>

                <div className="sub-sidebar-footer">
                    <div className="sub-nav-item" onClick={() => navigate('/admin')}>
                        <ArrowLeft size={18} /> Back to Admin
                    </div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <div className="cabinets-right-content">
                <header className="cabinets-top-header">
                    <div className="header-right-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="notification" style={{ position: 'relative' }}>
                            <Bell size={22} color="#64748b" />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>2</span>
                        </div>
                        <div className="user-account-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Admin')}&background=4880FF&color=fff&bold=true`} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
                            <ChevronDown size={16} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                <main className="cabinets-view-area">
                    <div className="cabinets-header-group">
                        <div>
                            <h2>Resources Library</h2>
                            <p style={{ color: '#64748B', marginTop: '5px' }}>Shared documents and guides for users</p>
                        </div>
                        <button className="btn-add-new" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} /> Upload Resource
                        </button>
                    </div>

                    {loading ? <p>Loading resources...</p> : (
                        <div className="resource-list">
                            {resources.map(file => (
                                <div className="resource-item" key={file.id}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className="resource-icon-box">
                                            <File size={24} />
                                        </div>
                                        <div className="resource-details">
                                            <h4>{file.title}</h4>
                                            <div className="resource-meta">{file.type} • {file.size} • {new Date(file.created_date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <a href={file.file} target="_blank" rel="noreferrer" className="resource-download" title="Download">
                                            <Download size={20} />
                                        </a>
                                        <button onClick={() => handleDelete(file.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '450px' }}>
                            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3>Upload Resource</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddSubmit}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Title</label>
                                    <input
                                        type="text"
                                        className="modern-input"
                                        required
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>File</label>
                                    <input
                                        type="file"
                                        required
                                        onChange={e => setFile(e.target.files[0])}
                                        style={{ width: '100%', padding: '10px' }}
                                    />
                                </div>
                                <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifySelf: 'end' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#F1F5F9', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#4880FF', color: 'white', cursor: 'pointer' }}>Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
