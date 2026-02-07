import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, FileText, MapPin, Clock } from 'lucide-react';
import '../components/MyApplications.css';

const MyApplications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

                const response = await fetch(`${API_BASE.replace(/\/$/, '')}/api/user/applications/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                } else {
                    const errData = await response.json();
                    setError(errData.error || 'Failed to fetch applications');
                }
            } catch (err) {
                console.error("Error fetching applications:", err);
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            case 'interviewing': return 'status-interviewing';
            default: return 'status-pending';
        }
    };

    return (
        <div className="my-applications-container">
            <div className="applications-frame">
                <div className="page-header">
                    <div className="page-title">
                        <h2>My Applications</h2>
                    </div>
                    <button className="btn-back" onClick={() => navigate('/homepage')}>
                        <ArrowLeft size={18} /> Back to Homepage
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">Loading your applications...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : applications.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>You haven't applied to any jobs yet.</p>
                        <button className="btn-primary" onClick={() => navigate('/job-list')} style={{ marginTop: '1rem' }}>
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className="applications-grid">
                        {applications.map((app) => (
                            <div key={app.id} className={`app-card ${getStatusClass(app.system_status).replace('status-', '')}`}>
                                <div className="app-header">
                                    <div className="company-logo-placeholder">
                                        <Building size={20} />
                                    </div>
                                    <span className={`app-status ${getStatusClass(app.system_status)}`}>
                                        {app.system_status || 'Pending'}
                                    </span>
                                </div>

                                <div className="app-body">
                                    <h3>{app.job_title || 'Unknown Job Title'}</h3>
                                    <div className="company-name">
                                        <Building size={14} /> {app.company_name || 'Unknown Company'}
                                    </div>
                                </div>

                                <div className="app-footer">
                                    <div className="applied-date">
                                        <Calendar size={14} style={{ marginRight: '4px' }} />
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </div>
                                    {/* Additional info can go here */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
