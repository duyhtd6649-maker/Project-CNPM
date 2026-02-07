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
    const [viewingCv, setViewingCv] = useState(null); // URL string

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
                coverLetter: 'Details not available.',
                // Ideally backend sends CV URL or ID to construct URL. For now using placeholder or if cvsid exists maybe construct URL? 
                // But for now, we rely on mock data button for testing the view.
                cvUrl: app.cv_url || null
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

    // View CV Handler
    const handleViewCV = (e, app) => {
        e.stopPropagation(); // Prevent opening detail modal
        // For testing/mock, use a default CV image if no URL is present
        const cvUrlToUse = app.cvUrl || "https://marketplace.canva.com/EAFRuCp3DcY/1/0/1131w/canva-black-white-minimalist-cv-resume-f5JNR-K5jjw.jpg";
        setViewingCv(cvUrlToUse);
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
                                <button className="btn-view-cv" onClick={(e) => handleViewCV(e, app)} style={{ marginRight: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', cursor: 'pointer', color: '#475569', fontSize: '13px', fontWeight: '500' }}>
                                    <FileText size={16} /> View CV
                                </button>
                                <button className="btn-view-details" onClick={() => setSelectedApp(app)} style={{ flex: 1 }}>
                                    <Eye size={16} /> View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No applications found.</p>
                    </div>
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

                            {/* CV Button in Modal too */}
                            <div className="ra-info-group">
                                <label className="ra-label">Resume / CV</label>
                                <div style={{ marginTop: '8px' }}>
                                    <button
                                        className="btn-view-cv"
                                        onClick={(e) => handleViewCV(e, selectedApp)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', cursor: 'pointer', color: '#475569', fontSize: '14px', fontWeight: '500' }}
                                    >
                                        <FileText size={16} /> Preview CV
                                    </button>
                                </div>
                            </div>

                            {/* Experience and Cover Letter removed as they aren't in the API, but exist in mock data */}
                            {selectedApp.experience !== 'N/A' && (
                                <div className="ra-info-group">
                                    <label className="ra-label">Experience</label>
                                    <div className="ra-value">{selectedApp.experience}</div>
                                </div>
                            )}

                            {selectedApp.coverLetter && selectedApp.coverLetter !== 'Details not available.' && (
                                <div className="ra-info-group">
                                    <label className="ra-label">Cover Letter / Note</label>
                                    <div className="ra-value" style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                                        {selectedApp.coverLetter}
                                    </div>
                                </div>
                            )}

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

            {/* VIEW CV MODAL */}
            {viewingCv && (
                <div className="ra-modal-overlay" style={{ zIndex: 10001 }} onClick={() => setViewingCv(null)}>
                    <div className="ra-modal-content" style={{ width: '600px', maxWidth: '90vw', height: '85vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div className="ra-modal-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                            <div className="ra-modal-title">
                                <h2>Candidate CV</h2>
                            </div>
                            <button className="ra-modal-close" onClick={() => setViewingCv(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="ra-modal-body" style={{ flex: 1, overflow: 'hidden', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            {/* Displaying Image for now as requested */}
                            <img
                                src={viewingCv}
                                alt="CV Preview"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                        </div>
                        <div className="ra-modal-actions" style={{ justifyContent: 'flex-end', marginTop: '15px' }}>
                            <button
                                className="btn-view-details"
                                onClick={() => setViewingCv(null)}
                            >
                                Close
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
