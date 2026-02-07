import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, FileText, Eye, Briefcase } from 'lucide-react';
import CandidateNavbar from '../components/CandidateNavbar';
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
            case 'hired': return 'status-hired';
            case 'rejected': return 'status-rejected';
            case 'interviewing': return 'status-interviewing';
            case 'reviewed': return 'status-reviewed';
            default: return 'status-pending';
        }
    };

    return (
        <div className="hp-container">
            {/* Added CandidateNavbar for consistent navigation */}
            <CandidateNavbar />

            <div className="my-applications-body">
                <div className="applications-page-header">
                    <div className="page-title">
                        <h2>My Applications</h2>
                        <p className="page-subtitle">Track and manage your job applications.</p>
                    </div>
                    {/* navigate back to Homepage or Job List */}
                    <button className="btn-back-home" onClick={() => navigate('/homepage')}>
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <p>Loading your applications...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={64} color="#CBD5E1" strokeWidth={1.5} />
                        <p>You haven't applied to any jobs yet.</p>
                        <button className="btn-browse" onClick={() => navigate('/job-list')}>
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className="applications-grid">
                        {applications.map((app) => (
                            <div key={app.id} className="app-card">
                                <div>
                                    <div className="app-header">
                                        <div className="company-logo-placeholder">
                                            {/* Use first letter of company or 'C' */}
                                            {(app.company || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`status-badge ${getStatusClass(app.system_status)}`}>
                                            {app.system_status || 'Pending'}
                                        </span>
                                    </div>

                                    <div className="app-main-info">
                                        <div className="app-job-title">{app.job_title || 'Unknown Role'}</div>
                                        <div className="app-company-name">
                                            <Building size={16} /> {app.company || 'Unknown Company'}
                                        </div>
                                    </div>

                                    <div className="app-meta-info">
                                        <Calendar size={14} />
                                        <span>Applied: {new Date(app.created_date || app.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="app-card-footer">
                                    <button className="btn-view-job" onClick={() => navigate(`/view-job/${app.job_id}`)}>
                                        <Eye size={16} /> View Job
                                    </button>
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
