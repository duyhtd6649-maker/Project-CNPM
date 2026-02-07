import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Check, Calendar, Briefcase, Mail, Phone, FileText, AlertTriangle } from 'lucide-react';
import axiosClient from '../../../infrastructure/http/axiosClient';
import '../components/RecruiterApplicationManagement.css';

const RecruiterApplicationManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    // Confirmation Modal State
    const [confirmationModal, setConfirmationModal] = useState(null); // { id, status, name }

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/recruiter/applications/');

            // Map API data to component state structure
            const mappedData = response.data.map(app => ({
                id: app.id,
                candidateName: app.user_name || 'Unknown Candidate',
                jobTitle: app.job_title || 'Unknown Role',
                appliedDate: new Date(app.created_date).toLocaleDateString(),
                status: app.job_status || 'Waiting', // Use job_status from backend
                email: app.user_email || 'N/A',
                phone: app.user_phone || 'N/A',
                // Experience and cover letter are not currently returned by this endpoint
                experience: 'N/A',
                coverLetter: 'Details not available.'
            }));

            setApplications(mappedData);
        } catch (err) {
            console.error("Error fetching applications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Step 1: Request Update - Opens Confirmation Modal
    const requestUpdateStatus = (id, newStatus, candidateName) => {
        setConfirmationModal({
            id,
            status: newStatus,
            name: candidateName
        });
    };

    // Step 2: Execute Update - Called when user confirms
    const executeUpdateStatus = async () => {
        if (!confirmationModal) return;

        const { id, status } = confirmationModal;
        setProcessingId(id);

        try {
            // Map frontend status to backend status if needed
            // Backend choices: Waiting, Hired, Rejected, Scheduling
            let backendStatus = status;
            if (status === 'Approved') backendStatus = 'Hired'; // Default 'Approved' to 'Hired'

            await axiosClient.put(`/recruiter/applications/${id}/UpdateStatus/`, {
                new_status: backendStatus
            });

            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: backendStatus } : app
            ));

            if (selectedApp && selectedApp.id === id) {
                setSelectedApp(prev => ({ ...prev, status: backendStatus }));
            }
        } catch (err) {
            console.error(`Error updating status to ${status}:`, err);
            // alert(`Failed to update status. ${err.response?.data?.error || ''}`);
        } finally {
            setProcessingId(null);
            setConfirmationModal(null);
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'hired': return 'status-approved';
            case 'rejected': return 'status-rejected';
            case 'interviewing':
            case 'scheduling': return 'status-interviewing';
            case 'reviewed': return 'status-reviewed';
            case 'waiting':
            case 'pending': return 'status-pending';
            default: return 'status-pending';
        }
    };

    return (
        <div className="recruiter-apps-container">
            <div className="apps-page-header">
                <div>
                    <h2>Applications</h2>
                    <p>Manage and review candidate applications</p>
                </div>
            </div>

            <div className="apps-toolbar">
                <div className="search-box-custom">
                    <Search size={18} color="#A3AED0" />
                    <input
                        placeholder="Search candidates or jobs..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Scheduling">Scheduling</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="recruiter-apps-grid">
                {loading ? (
                    <div className="empty-state">Loading applications...</div>
                ) : filteredApps.length > 0 ? (
                    filteredApps.map(app => (
                        <div key={app.id} className="ra-card">
                            <div className="ra-header">
                                <span className={`status-tag ${getStatusClass(app.status)}`}>
                                    {app.status}
                                </span>
                            </div>

                            <div className="ra-body">
                                <h3 className="ra-name">{app.candidateName}</h3>
                                <div className="ra-role">
                                    <Briefcase size={14} /> {app.jobTitle}
                                </div>
                                <div className="ra-details-row">
                                    <Calendar size={14} /> Applied: {app.appliedDate}
                                </div>
                            </div>

                            <div className="ra-footer">
                                <button className="btn-view-details" onClick={() => setSelectedApp(app)}>
                                    <Eye size={16} /> View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No applications found.</div>
                )}
            </div>

            {/* DETAIL MODAL */}
            {selectedApp && (
                <div className="ra-modal-overlay" onClick={() => setSelectedApp(null)}>
                    <div className="ra-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="ra-modal-header">
                            <div className="ra-modal-title">
                                <h2>{selectedApp.candidateName}</h2>
                                <span className={`status-tag ${getStatusClass(selectedApp.status)}`} style={{ marginTop: '8px', display: 'inline-block' }}>
                                    {selectedApp.status}
                                </span>
                            </div>
                            <button className="ra-modal-close" onClick={() => setSelectedApp(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="ra-modal-body">
                            <div className="ra-info-group">
                                <label className="ra-label">Applying For</label>
                                <div className="ra-value">{selectedApp.jobTitle}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className="ra-info-group" style={{ flex: 1 }}>
                                    <label className="ra-label">Email</label>
                                    <div className="ra-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Mail size={14} /> {selectedApp.email}
                                    </div>
                                </div>
                                <div className="ra-info-group" style={{ flex: 1 }}>
                                    <label className="ra-label">Phone</label>
                                    <div className="ra-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Phone size={14} /> {selectedApp.phone}
                                    </div>
                                </div>
                            </div>

                            {/* Experience and Cover Letter removed as they aren't in the API */}

                        </div>

                        <div className="ra-modal-actions">
                            <button
                                className="btn-reject"
                                onClick={() => requestUpdateStatus(selectedApp.id, 'Rejected', selectedApp.candidateName)}
                                disabled={processingId === selectedApp.id}
                            >
                                <X size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} /> Reject
                            </button>

                            <button
                                className="btn-approve"
                                onClick={() => requestUpdateStatus(selectedApp.id, 'Hired', selectedApp.candidateName)}
                                disabled={processingId === selectedApp.id}
                            >
                                <Check size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} /> Approve (Hire)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRMATION MODAL - High Z-Index ensuring visibility */}
            {confirmationModal && (
                <div className="ra-modal-overlay" style={{ zIndex: 10000 }}>
                    <div className="ra-modal-content" style={{ width: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            marginBottom: '20px',
                            color: confirmationModal.status === 'Hired' ? '#10B981' : '#EF4444',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <AlertTriangle size={48} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2B3674', marginBottom: '10px' }}>
                            Confirm {confirmationModal.status}?
                        </h3>
                        <p style={{ color: '#A3AED0', marginBottom: '24px' }}>
                            Are you sure you want to <strong>{confirmationModal.status.toLowerCase()}</strong> the application for <strong>{confirmationModal.name}</strong>?
                        </p>

                        <div className="ra-modal-actions" style={{ justifyContent: 'center', gap: '12px' }}>
                            <button
                                className="btn-view-details"
                                style={{ flex: 1, justifyContent: 'center' }}
                                onClick={() => setConfirmationModal(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={confirmationModal.status === 'Hired' ? 'btn-approve' : 'btn-reject'}
                                style={{ flex: 1, justifyContent: 'center' }}
                                onClick={executeUpdateStatus}
                            >
                                Confirm {confirmationModal.status}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterApplicationManagement;
