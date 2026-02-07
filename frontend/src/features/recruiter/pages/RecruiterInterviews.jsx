import React, { useState, useEffect } from 'react';
import axiosClient from '../../../infrastructure/http/axiosClient';
import { Search, Filter, Eye, X, Check, Calendar, Briefcase, Mail, Phone, Clock, MapPin, Video, Plus } from 'lucide-react';
import '../components/RecruiterApplicationManagement.css'; // Reusing the same CSS for consistency

const RecruiterInterviews = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Modal states
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [editingInterview, setEditingInterview] = useState(null);
    const [scheduleForm, setScheduleForm] = useState({
        interview_date: '',
        time: '',
        location: '',
        notes: '',
        type: 'Online', // Online or In-person
        interviewer: 'Recruiter', // Default value
        link: ''
    });

    const [submitting, setSubmitting] = useState(false);

    // Fetch Approved Candidates (Ready for Interview)
    const fetchApprovedCandidates = async () => {
        // Real API code
        setLoading(true);
        try {
            const response = await axiosClient.get('/recruiter/approved_candidates/');

            if (Array.isArray(response.data)) {
                // Map API data to UI structure
                const mappedCandidates = response.data.map(item => ({
                    id: item.id, // Application ID
                    candidateName: item.user_name || 'Unknown Candidate',
                    jobTitle: item.job_title || 'Unknown Role',
                    status: item.job_status || 'Interview Scheduling',
                    appliedAt: item.created_date,
                    email: item.user_email,
                    phone: item.user_phone,
                    // If backend doesn't provide interview_id, we can't edit. 
                    // But we will show 'Schedule' if status is Scheduling and 'Edit' if status is Scheduled.
                    interviewId: item.interview_id || null
                }));
                setCandidates(mappedCandidates);
            }
        } catch (error) {
            console.error("Error fetching approved candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedCandidates();
    }, []);

    const filteredCandidates = candidates.filter(cand => {
        const matchesSearch = cand.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cand.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

        // Normalize status for consistent comparison
        const statusNormalized = cand.status.toLowerCase();

        // Show only candidates in Interview stages
        const isInterviewStage = statusNormalized.includes('interview');

        const filterNormalized = filterStatus.toLowerCase();
        const matchesStatus = filterStatus === 'All' || statusNormalized === filterNormalized;

        return matchesSearch && matchesStatus && isInterviewStage;
    });

    const openScheduleModal = (candidate) => {
        setSelectedCandidate(candidate);
        setScheduleForm({
            interview_date: '',
            time: '',
            location: '',
            notes: '',
            type: 'Online',
            interviewer: 'Recruiter',
            link: ''
        });
        setShowScheduleModal(true);
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

            // Combine date and time for ISO format
            const dateTimeString = `${scheduleForm.interview_date}T${scheduleForm.time}:00`;
            const isoDateTime = new Date(dateTimeString).toISOString();

            const locationValue = scheduleForm.type === 'Online' ? scheduleForm.link : scheduleForm.location;

            // REAL API CALL
            const payload = {
                application_id: selectedCandidate.id,
                interview_date: isoDateTime,
                location: locationValue || 'Online', // Default to 'Online' if empty link
                notes: scheduleForm.notes,
                interviewer: scheduleForm.interviewer,
                application: selectedCandidate.id
            };

            await axiosClient.post('/recruiter/create_interview/', payload);

            alert("Interview scheduled successfully!");
            fetchApprovedCandidates(); // Refresh list

            setShowScheduleModal(false);

        } catch (error) {
            console.error("Error scheduling interview:", error);
            alert("Failed to schedule interview. Please check the details and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Open Edit Modal
    const openEditModal = (candidate) => {
        setEditingInterview(candidate);
        // Pre-fill form with existing data
        // Assuming candidate has interview data
        setScheduleForm({
            interview_date: '', // We'll need to parse from existing data
            time: '',
            location: candidate.location || '',
            notes: candidate.notes || '',
            type: 'Online',
            interviewer: candidate.interviewer || 'Recruiter',
            link: ''
        });
        setShowEditModal(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

            // Combine date and time for ISO format
            const dateTimeString = `${scheduleForm.interview_date}T${scheduleForm.time}:00`;
            const isoDateTime = new Date(dateTimeString).toISOString();

            const locationValue = scheduleForm.type === 'Online' ? scheduleForm.link : scheduleForm.location;

            const payload = {
                interview_date: isoDateTime,
                location: locationValue || 'Online',
                notes: scheduleForm.notes
            };

            await axiosClient.put(
                `/api/recruiter/interviews/update/${editingInterview.interviewId}/`,
                payload
            );

            alert("Interview updated successfully!");
            fetchApprovedCandidates(); // Refresh list
            setShowEditModal(false);

        } catch (error) {
            console.error("Error updating interview:", error);
            alert("Failed to update interview. Please check the details and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="recruiter-apps-container">
            <div className="apps-page-header">
                <div>
                    <h2>Interview Management</h2>
                    <p>Manage and schedule interviews for approved candidates</p>
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
                    <option value="Approved">Ready to Schedule</option>
                    <option value="interviewing">Interviewing</option>
                </select>
            </div>

            <div className="recruiter-apps-grid">
                {loading ? (
                    <div className="empty-state">Loading ...</div>
                ) : filteredCandidates.length > 0 ? (
                    filteredCandidates.map(cand => (
                        <div key={cand.id} className="ra-card">
                            <div className="ra-header">
                                <span className={`status-tag ${cand.status === 'Approved' ? 'status-pending' : 'status-interviewing'}`}>
                                    {cand.status === 'Approved' ? 'Ready to Schedule' : 'Interview Scheduled'}
                                </span>
                            </div>

                            <div className="ra-body">
                                <h3 className="ra-name">{cand.candidateName}</h3>
                                <div className="ra-role">
                                    <Briefcase size={14} /> {cand.jobTitle}
                                </div>
                                <div className="ra-details-row">
                                    <Clock size={14} /> Applied: {new Date(cand.appliedAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="ra-footer">
                                {cand.status === 'Approved' || cand.status === 'Interview Scheduling' ? (
                                    <button className="btn-approve" onClick={() => openScheduleModal(cand)} style={{ width: '100%', justifyContent: 'center' }}>
                                        <Calendar size={16} /> Schedule Interview
                                    </button>
                                ) : (cand.status === 'Interview Scheduled' && cand.interviewId) ? (
                                    <button className="btn-view-details" onClick={() => openEditModal(cand)} style={{ width: '100%', justifyContent: 'center' }}>
                                        <Calendar size={16} /> Edit Interview
                                    </button>
                                ) : (
                                    <button className="btn-view-details" disabled style={{ width: '100%', opacity: 0.7, cursor: 'default' }}>
                                        <Check size={16} /> Scheduled
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No candidates found ready for interview.</div>
                )}
            </div>

            {/* SCHEDULE MODAL */}
            {showScheduleModal && selectedCandidate && (
                <div className="ra-modal-overlay" onClick={() => setShowScheduleModal(false)}>
                    <div className="ra-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="ra-modal-header">
                            <div className="ra-modal-title">
                                <h2>Schedule Interview</h2>
                                <p>For {selectedCandidate.candidateName} - {selectedCandidate.jobTitle}</p>
                            </div>
                            <button className="ra-modal-close" onClick={() => setShowScheduleModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleScheduleSubmit} className="ra-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Date <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={scheduleForm.interview_date}
                                        onChange={e => setScheduleForm({ ...scheduleForm, interview_date: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Time <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="time"
                                        required
                                        value={scheduleForm.time}
                                        onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Interview Type</label>
                                <select
                                    value={scheduleForm.type}
                                    onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                >
                                    <option value="Online">Online (Google Meet / Zoom)</option>
                                    <option value="In-person">In-person</option>
                                </select>
                            </div>

                            {scheduleForm.type === 'Online' ? (
                                <div className="form-group">
                                    <label>Meeting Link <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://meet.google.com/..."
                                        value={scheduleForm.link}
                                        onChange={e => setScheduleForm({ ...scheduleForm, link: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Location Address <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Office Address, Room Number..."
                                        value={scheduleForm.location}
                                        onChange={e => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Interviewer Name <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={scheduleForm.interviewer}
                                    onChange={e => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea
                                    rows="3"
                                    value={scheduleForm.notes}
                                    onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                />
                            </div>

                            <div className="ra-modal-actions" style={{ marginTop: '10px' }}>
                                <button
                                    type="button"
                                    className="btn-reject"
                                    onClick={() => setShowScheduleModal(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-approve"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Scheduling...' : 'Confirm Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT INTERVIEW MODAL */}
            {showEditModal && editingInterview && (
                <div className="ra-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="ra-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="ra-modal-header">
                            <div className="ra-modal-title">
                                <h2>Edit Interview</h2>
                                <p>For {editingInterview.candidateName} - {editingInterview.jobTitle}</p>
                            </div>
                            <button className="ra-modal-close" onClick={() => setShowEditModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="ra-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Date <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={scheduleForm.interview_date}
                                        onChange={e => setScheduleForm({ ...scheduleForm, interview_date: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Time <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="time"
                                        required
                                        value={scheduleForm.time}
                                        onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Interview Type</label>
                                <select
                                    value={scheduleForm.type}
                                    onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                >
                                    <option value="Online">Online (Google Meet / Zoom)</option>
                                    <option value="In-person">In-person</option>
                                </select>
                            </div>

                            {scheduleForm.type === 'Online' ? (
                                <div className="form-group">
                                    <label>Meeting Link <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://meet.google.com/..."
                                        value={scheduleForm.link}
                                        onChange={e => setScheduleForm({ ...scheduleForm, link: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Location Address <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Office Address, Room Number..."
                                        value={scheduleForm.location}
                                        onChange={e => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea
                                    rows="3"
                                    value={scheduleForm.notes}
                                    onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                />
                            </div>

                            <div className="ra-modal-actions" style={{ marginTop: '10px' }}>
                                <button
                                    type="button"
                                    className="btn-reject"
                                    onClick={() => setShowEditModal(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-approve"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating...' : 'Update Interview'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterInterviews;
