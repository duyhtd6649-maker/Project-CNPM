import React, { useState } from 'react';
import axios from 'axios';
import '../components/CreateJobPost.css';

const CreateJobPost = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    skill: '',
    salary_min: '',
    salary_max: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Logic Publish Job gửi dữ liệu lên Database
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Vui lòng điền đủ Tiêu đề và Mô tả");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      // Endpoint: job/create/ từ job_views.py
      const response = await axios.post(
        'http://127.0.0.1:8000/api/job/create', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        alert('Đăng bài thành công! Trạng thái: Pending.');
        onSuccess(); // Đóng modal và refresh bảng ở dashboard
      }
    } catch (error) {
      console.error("Lỗi:", error.response?.data);
      alert('Đăng bài thất bại. Vui lòng kiểm tra quyền Recruiter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-large">
        <button className="btn-close-modal" onClick={onClose}>
          ← <span>Back to Dashboard</span>
        </button>

        <div className="modal-body-grid">
          <div className="form-column">
            <h2 className="modal-title">Create a New Job Listing</h2>
            <p className="modal-subtitle">Fill in the details for your next hire.</p>
            
            <div className="form-group-custom">
              <input 
                type="text" 
                name="title" 
                placeholder="Job Position Title" 
                className="input-field" 
                onChange={handleInputChange} 
              />
              <div style={{display: 'flex', gap: '15px'}}>
                <input 
                  type="text" 
                  name="location" 
                  placeholder="Location (HCM, HN...)" 
                  className="input-field" 
                  style={{flex: 1}} 
                  onChange={handleInputChange} 
                />
                <input 
                  type="text" 
                  name="skill" 
                  placeholder="Skills (React, Python...)" 
                  className="input-field" 
                  style={{flex: 1}} 
                  onChange={handleInputChange} 
                />
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <input 
                  type="number" 
                  name="salary_min" 
                  placeholder="Min Salary" 
                  className="input-field" 
                  style={{flex: 1}} 
                  onChange={handleInputChange} 
                />
                <input 
                  type="number" 
                  name="salary_max" 
                  placeholder="Max Salary" 
                  className="input-field" 
                  style={{flex: 1}} 
                  onChange={handleInputChange} 
                />
              </div>
              <textarea 
                name="description" 
                placeholder="Job Description" 
                className="input-field" 
                rows="6" 
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          <div className="preview-column">
            <div className="preview-panel">
              <h3 className="preview-label">PREVIEW</h3>
              <div className="preview-card" style={{background: 'white', padding: '20px', borderRadius: '15px'}}>
                <h4 style={{margin: 0, color: '#2b3674'}}>{formData.title || 'Job Title'}</h4>
                <p style={{fontSize: '14px', color: '#707EAE'}}>{formData.location || 'Location'}</p>
                <p style={{fontSize: '16px', color: '#05cd99', fontWeight: 'bold'}}>
                  ${formData.salary_min || '0'} - ${formData.salary_max || '0'}
                </p>
              </div>
              
              <button 
                onClick={handlePublish} 
                className="publish-btn-main" 
                disabled={loading}
                style={{
                  width: '100%', 
                  marginTop: '30px', 
                  opacity: loading ? 0.6 : 1,
                  background: '#4318FF',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Publishing...' : 'Publish Job Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;