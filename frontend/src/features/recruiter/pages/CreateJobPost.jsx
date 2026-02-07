import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/CreateJobPost.css'; // Giữ lại CSS cũ của bạn
// Import icon để hiển thị trạng thái đẹp hơn (cần cài lucide-react hoặc dùng text thường)
import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react'; 

const CreateJobPost = ({ onClose, onSuccess }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State cho Form tạo job
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    skill: '',
    salary_min: '',
    salary_max: ''
  });

  // State cho Danh sách Job (Để xem trạng thái)
  const [myJobs, setMyJobs] = useState([]);

  // --- 1. LOGIC LẤY DANH SÁCH & ĐỒNG BỘ STATUS ---
  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const url = `${API_BASE.replace(/\/$/, '')}/api/search/job/`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Sắp xếp: Mới nhất lên đầu (bảo vệ nếu không có created_date)
      const sortedJobs = Array.isArray(response.data)
        ? response.data.sort((a, b) => new Date(b.created_date || Date.now()) - new Date(a.created_date || Date.now()))
        : [];
      setMyJobs(sortedJobs);
    } catch (error) {
      console.error("Không thể tải danh sách job:", error);
      setMyJobs([]);
    }
  };

  // Gọi API khi mới vào trang
  useEffect(() => {
    fetchMyJobs();

    // Xử lý Darkmode
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. LOGIC ĐĂNG BÀI (Giữ nguyên nhưng thêm reset form & reload list) ---
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Vui lòng nhập tiêu đề và mô tả!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const url = `${API_BASE.replace(/\/$/, '')}/api/job/create`;
      
      // Convert salary fields to numbers (or null if empty)
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        skill: formData.skill ? (typeof formData.skill === 'string' ? formData.skill.split(',').map(s => s.trim()) : formData.skill) : [],
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null
      };
      
      console.log('📤 Sending job data:', payload);
      const resp = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert("🎉 Đăng bài thành công! Đang chờ Admin duyệt.");

      // Reset form
      setFormData({
        title: '', description: '', location: '',
        skill: '', salary_min: '', salary_max: ''
      });

      // Reload list and notify parent
      fetchMyJobs();
      if (typeof onSuccess === 'function') onSuccess(resp.data);
      // Auto-close modal if parent provided onClose
      if (typeof onClose === 'function') onClose();

    } catch (error) {
      console.error("Lỗi đăng bài:", error?.response?.data || error.message);
      alert("Có lỗi xảy ra. Chi tiết: " + (error?.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HÀM HIỂN THỊ STATUS (Mấu chốt của việc đồng bộ) ---
  const renderStatus = (backendStatus) => {
    // Backend trả về 'Open' -> Giao diện hiện 'Approved'
    if (backendStatus === 'Open') {
        return (
            <span className="status-tag approved" style={{color: '#059669', background: '#D1FAE5', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
                <CheckCircle size={14}/> Approved
            </span>
        );
    }
    if (backendStatus === 'Rejected') {
        return (
            <span className="status-tag rejected" style={{color: '#DC2626', background: '#FEE2E2', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
                <XCircle size={14}/> Rejected
            </span>
        );
    }
    // Mặc định là Pending
    return (
        <span className="status-tag pending" style={{color: '#D97706', background: '#FEF3C7', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <Clock size={14}/> Pending Review
        </span>
    );
  };

  return (
    // Modal overlay so component is visible when rendered via portal
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {console.log('🎬 CreateJobPost rendering')}
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose && onClose()} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
      <div style={{ position: 'relative', width: '95%', maxWidth: '1000px', backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}> 
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* === CỘT TRÁI: FORM ĐĂNG BÀI (Create Job) === */}
        <div className="create-section bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                ✍️ Create New Job
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} 
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Senior React Developer" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} 
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Salary</label>
                        <input type="number" name="salary_min" value={formData.salary_min} onChange={handleInputChange} 
                            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Salary</label>
                        <input type="number" name="salary_max" value={formData.salary_max} onChange={handleInputChange} 
                            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                
                <button 
                    onClick={handlePublish}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4"
                >
                    {loading ? 'Publishing...' : 'Publish Job Now'}
                </button>
            </div>
        </div>

        {/* === CỘT PHẢI: DANH SÁCH & TRẠNG THÁI (My Posted Jobs) === */}
        <div className="history-section">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📋 My Posted Jobs</h2>
                <button onClick={fetchMyJobs} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200" title="Refresh Status">
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''}/>
                </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {myJobs.length === 0 ? (
                    <div className="text-center p-10 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
                        <p className="text-gray-500">You haven't posted any jobs yet.</p>
                    </div>
                ) : (
                    myJobs.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{job.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.location}</p>
                                    <p className="text-xs text-gray-400 mt-2">Posted: {job.created_date ? new Date(job.created_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                
                                {/* Đây là chỗ hiển thị trạng thái đồng bộ */}
                                <div className="flex flex-col items-end gap-2">
                                    {renderStatus(job.status)}
                                    <span className="text-xs font-medium text-gray-400">ID: {job.id.toString().slice(0,6)}...</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Status Legend */}
            <div className="mt-6 bg-blue-50 dark:bg-gray-700 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-100 flex gap-4 flex-wrap">
                <div className="flex items-center gap-1"><Clock size={14}/> <b>Pending:</b> Waiting for Admin</div>
                <div className="flex items-center gap-1"><CheckCircle size={14}/> <b>Approved:</b> Live for Candidates</div>
            </div>
        </div>

      </div>

      {/* Close button + Dark Mode Toggle */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 9999 }}>
        <button onClick={() => onClose && onClose()} title="Close" style={{ padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>✕</button>
        <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer' }}>{darkMode ? '🌞' : '🌙'}</button>
      </div>
      </div>
    </div>
  );
};

export default CreateJobPost;