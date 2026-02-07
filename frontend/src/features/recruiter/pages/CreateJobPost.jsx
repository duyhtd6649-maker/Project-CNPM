import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/CreateJobPost.css'; // File CSS ở bước 2
import { CheckCircle, Clock, XCircle, RefreshCw, Briefcase, MapPin, PlusCircle, List } from 'lucide-react';

const CreateJobPost = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', description: '', location: '',
    skill: '', salary_min: '', salary_max: ''
  });

  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // --- 1. LẤY DANH SÁCH JOB ---
  const fetchMyJobs = async () => {
    setLoadingJobs(true);
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const url = `${API_BASE.replace(/\/$/, '')}/api/recruiter/jobs/`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sortedJobs = Array.isArray(response.data)
        ? response.data.sort((a, b) => new Date(b.created_date || Date.now()) - new Date(a.created_date || Date.now()))
        : [];
      setMyJobs(sortedJobs);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. RENDER TRẠNG THÁI ---
  const renderStatus = (backendStatus) => {
    const status = backendStatus ? backendStatus.toString().trim() : '';
    if (status === 'Open' || status === 'Approved') {
        return <span className="status-tag status-approved"><CheckCircle size={12}/> Approved</span>;
    }
    if (status === 'Closed' || status === 'R') {
        return <span className="status-tag status-closed"><XCircle size={12}/> Closed</span>;
    }
    return <span className="status-tag status-pending"><Clock size={12}/> Pending</span>;
  };

  // --- 3. GỬI FORM ---
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      alert("Please fill in Title, Description and Location.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const url = `${API_BASE.replace(/\/$/, '')}/api/job/create`;
      
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        skill: formData.skill ? (typeof formData.skill === 'string' ? formData.skill.split(',').map(s => s.trim()) : formData.skill) : [],
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null
      };
      
      const resp = await axios.post(url, payload, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      alert("🎉 Job post successfully, wait for admin approve!");
      setFormData({ title: '', description: '', location: '', skill: '', salary_min: '', salary_max: '' });
      fetchMyJobs();
      if (typeof onSuccess === 'function') onSuccess(resp.data);

    } catch (error) {
      alert("Có lỗi xảy ra: " + (error?.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={() => onClose && onClose()}></div>
      
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
             <h2 className="modal-title"><Briefcase className="icon-blue"/> Recruitment Manager</h2>
             <button onClick={() => onClose && onClose()} className="btn-close">✕</button>
        </div>

        <div className="modal-body-layout">
            
            {/* CỘT TRÁI: DANH SÁCH JOB */}
            <div className="column-left">
                <div className="section-header">
                    <h3><List size={18}/> My Posted Jobs</h3>
                    <button onClick={fetchMyJobs} className="btn-icon">
                        <RefreshCw size={16} className={loadingJobs ? 'spin' : ''}/>
                    </button>
                </div>

                <div className="job-list-container custom-scrollbar">
                    {loadingJobs && myJobs.length === 0 ? (
                        <div className="empty-state">Loading jobs...</div>
                    ) : myJobs.length === 0 ? (
                        <div className="empty-state">No jobs posted yet.</div>
                    ) : (
                        myJobs.map((job) => (
                            <div key={job.id} className="job-card-item">
                                <div className="job-card-top">
                                    <h4 title={job.title}>{job.title}</h4>
                                    {renderStatus(job.status)}
                                </div>
                                <div className="job-card-info">
                                    <span><MapPin size={12}/> {job.location || 'No location'}</span>
                                    <span>• ${job.salary_min || 0} - ${job.salary_max || 'Wait'}</span>
                                </div>
                                <div className="job-card-meta">
                                    ID: {job.id} • {new Date(job.created_date || Date.now()).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* CỘT PHẢI: FORM NHẬP LIỆU */}
            <div className="column-right custom-scrollbar">
                <div className="form-wrapper">
                    <h2 className="form-title"><PlusCircle className="icon-blue"/> Post a New Opportunity</h2>
                    
                    <div className="form-content">
                        <div className="form-group">
                            <label>Job Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} 
                                className="input-field" placeholder="e.g. Senior Frontend Developer" />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Location *</label>
                                <div className="input-with-icon">
                                    <MapPin size={16} className="input-icon"/>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} 
                                        className="input-field pl-icon" placeholder="Ho Chi Minh City" />
                                </div>
                            </div>
                            <div className="form-group half">
                                <label>Salary Range ($)</label>
                                <div className="salary-inputs">
                                    <input type="number" name="salary_min" value={formData.salary_min} onChange={handleInputChange} 
                                        className="input-field" placeholder="Min" />
                                    <input type="number" name="salary_max" value={formData.salary_max} onChange={handleInputChange} 
                                        className="input-field" placeholder="Max" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Required Skills</label>
                            <input type="text" name="skill" value={formData.skill} onChange={handleInputChange} 
                                className="input-field" placeholder="ReactJS, Python, Django..." />
                        </div>

                        <div className="form-group">
                            <label>Job Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" 
                                className="input-field" placeholder="Describe the role..."></textarea>
                        </div>
                        
                        <div className="form-actions">
                            <button onClick={onClose} className="btn-cancel">Cancel</button>
                            <button onClick={handlePublish} disabled={loading} className="btn-submit">
                                {loading ? <RefreshCw className="spin" size={20}/> : <CheckCircle size={20}/>}
                                {loading ? 'Publishing...' : 'Publish Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;