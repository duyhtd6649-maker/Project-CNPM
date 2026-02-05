import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, MessageSquare, BookOpen,
    ArrowLeft, Bell, ChevronDown, Plus, Edit, Trash2, HelpCircle,
    UserCog, Activity, ShieldCheck, ClipboardList, Gift, Menu, X, LogOut
} from 'lucide-react';
import '../components/Cabinets.css';

const InterviewQuestions = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [questions] = useState([
        { id: 1, question: 'What is the difference between let and var?', category: 'JavaScript', difficulty: 'Easy' },
        { id: 2, question: 'Explain the concept of closure in JS.', category: 'JavaScript', difficulty: 'Medium' },
        { id: 3, question: 'How would you optimize a React application?', category: 'React', difficulty: 'Hard' },
        { id: 4, question: 'What are SOLID principles?', category: 'Architecture', difficulty: 'Medium' },
        { id: 5, question: 'Explain Event Loop in Node.js.', category: 'Node.js', difficulty: 'Hard' },
    ]);

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

                    <div className="sub-nav-item active">
                        <MessageSquare size={18} /> Interview Questions
                    </div>

                    <div className="sub-nav-item" onClick={() => navigate('/resources')}>
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
                            <div style={{ width: '35px', height: '35px', background: '#e2e8f0', borderRadius: '50%' }}></div>
                            <ChevronDown size={16} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                <main className="cabinets-view-area">
                    <div className="cabinets-header-group">
                        <div>
                            <h2>Interview Questions</h2>
                            <p style={{ color: '#64748B', marginTop: '5px' }}>Curated list of interview questions for various roles</p>
                        </div>
                        <button className="btn-add-new">
                            <Plus size={18} /> Add Question
                        </button>
                    </div>

                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '13px', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Question</th>
                                    <th style={{ padding: '15px' }}>Category</th>
                                    <th style={{ padding: '15px' }}>Difficulty</th>
                                    <th style={{ padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map(q => (
                                    <tr key={q.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '15px', fontWeight: '600', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <HelpCircle size={16} color="#4880FF" /> {q.question}
                                        </td>
                                        <td style={{ padding: '15px', color: '#64748B' }}>
                                            <span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                                {q.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                color: q.difficulty === 'Hard' ? '#EF4444' : q.difficulty === 'Medium' ? '#F59E0B' : '#10B981',
                                                fontWeight: '700', fontSize: '12px'
                                            }}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <button style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px', color: '#64748B' }}><Edit size={16} /></button>
                                            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InterviewQuestions;
