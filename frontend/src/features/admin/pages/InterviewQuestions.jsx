import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/AppProviders';
import {
    LayoutDashboard, FileText, MessageSquare, BookOpen,
    ArrowLeft, Bell, ChevronDown, Plus, Edit, Trash2, HelpCircle,
    UserCog, Activity, ShieldCheck, ClipboardList, Gift, Menu, X, LogOut
} from 'lucide-react';
import '../components/Cabinets.css';

const InterviewQuestions = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        category: 'JavaScript',
        difficulty: 'Easy'
    });

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            const res = await axios.get('http://127.0.0.1:8000/api/cabinets/interview-questions/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://127.0.0.1:8000/api/cabinets/interview-questions/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Question added successfully!');
            fetchQuestions();
            setIsModalOpen(false);
            setFormData({ question: '', category: 'JavaScript', difficulty: 'Easy' });
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data || 'Failed to add question';
            alert(`Error: ${JSON.stringify(errorMsg, null, 2)}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://127.0.0.1:8000/api/cabinets/interview-questions/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQuestions();
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

                    <div className="nav-item-custom" onClick={() => navigate('/system-status')}><ShieldCheck size={20} /> <span>System Status Monitor</span></div>
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
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Admin')}&background=4880FF&color=fff&bold=true`} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
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
                        <button className="btn-add-new" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} /> Add Question
                        </button>
                    </div>

                    {loading ? <p>Loading questions...</p> : (
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
                                                {/* <button style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px', color: '#64748B' }}><Edit size={16} /></button> */}
                                                <button onClick={() => handleDelete(q.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                <h3>Add Question</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddSubmit}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Question</label>
                                    <textarea
                                        className="modern-input"
                                        required
                                        value={formData.question}
                                        onChange={e => setFormData({ ...formData, question: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', height: '80px' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Category</label>
                                    <input
                                        type="text"
                                        className="modern-input"
                                        required
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Difficulty</label>
                                    <select
                                        className="modern-select"
                                        value={formData.difficulty}
                                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifySelf: 'end' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#F1F5F9', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#4880FF', color: 'white', cursor: 'pointer' }}>Add Question</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewQuestions;
