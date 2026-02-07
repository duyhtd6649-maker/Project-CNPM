import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/CreateJobPost.css'; // Đảm bảo bạn có file CSS này
import { CheckCircle, Clock, XCircle, RefreshCw, Briefcase, MapPin, DollarSign, List } from 'lucide-react';

const CreateJobPost = ({ onClose, onSuccess }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // 'create' hoặc 'list'
  
  // State form dữ liệu
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    skill: '',
    salary_min: '',
    salary_max: ''
  });

  // State danh sách job để theo dõi trạng thái
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // --- 1. HÀM LẤY DANH SÁCH JOB (Để xem trạng thái) ---
  const fetchMyJobs = async () => {
    setLoadingJobs(true);
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

  // Gọi API lấy list job khi mở component
  useEffect(() => {
    fetchMyJobs();
  }, []);

  // --- 2. LOGIC INPUT FORM ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. HÀM XỬ LÝ TRẠNG THÁI (CORE FIX) ---
  const renderStatus = (backendStatus) => {
    // Chuẩn hóa chuỗi (nếu null thì thành '')
    const status = backendStatus ? backendStatus.toString().trim() : '';

    // LOGIC FIX: Backend trả về 'Open' -> Hiển thị là 'Approved'
    if (status === 'Open' || status === 'Approved') {
        return (
            <span className="status-badge approved" style={{
                color: '#059669', background: '#D1FAE5', 
                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', 
                display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}>
                <CheckCircle size={14}/> Approved
            </span>
        );
    }

    if (status === 'Closed' || status === 'R') {
        return (
            <span className="status-badge rejected" style={{
                color: '#DC2626', background: '#FEE2E2', 
                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', 
                display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}>
                <XCircle size={14}/> {status === 'Closed' ? 'Closed' : 'Rejected'}
            </span>
        );
    }

    // Mặc định là Pending
    return (
        <span className="status-badge pending" style={{
            color: '#D97706', background: '#FEF3C7', 
            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', 
            display: 'inline-flex', alignItems: 'center', gap: '4px'
        }}>
            <Clock size={14}/> Pending Review
        </span>
    );
  };

  // --- 4. GỬI DATA LÊN SERVER ---
  const handlePublish = async (e) => {
    e.preventDefault();
    
    // Validate cơ bản
    if (!formData.title || !formData.description || !formData.location) {
      alert("Please fill in Title, Description and Location.");
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

      // Nếu có prop onSuccess từ cha thì gọi (ví dụ đóng modal)
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Lỗi đăng bài:", error?.response?.data || error.message);
      alert("Có lỗi xảy ra. Chi tiết: " + (error?.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
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

      {/* Dark Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setDarkMode(!darkMode)} className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border hover:scale-110 transition-transform">
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>

      {/* --- FORM CREATE JOB --- */}
      {activeTab === 'create' && (
          <div className="job-form-wrapper bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600"/> Post a New Opportunity
            </h2>
            
            <form onSubmit={handlePublish} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input 
                type="text" 
                name="title" 
                            value={formData.title}
                onChange={handleInputChange} 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Senior Frontend Developer"
                        />
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input 
                  type="text" 
                  name="location" 
                                value={formData.location}
                  onChange={handleInputChange} 
                                className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Ho Chi Minh City"
                />
              </div>
                    </div>
                </div>

                {/* Salary Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min ($)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input 
                  type="number" 
                  name="salary_min" 
                                value={formData.salary_min}
                  onChange={handleInputChange} 
                                className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="1000"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max ($)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input 
                  type="number" 
                  name="salary_max" 
                                value={formData.salary_max}
                  onChange={handleInputChange} 
                                className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="3000"
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

                {/* Skills */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                    <input
                        type="text"
                        name="skill"
                        value={formData.skill}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="ReactJS, Python, Django (comma separated)"
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                    <textarea
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Describe the role, responsibilities, and requirements..."
                    />
              </div>
              
                {/* Actions */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                    {onClose && (
              <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        type="submit" 
                disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18}/> : <CheckCircle size={18}/>}
                        {loading ? 'Publishing...' : 'Publish Job'}
              </button>
            </div>
            </form>
          </div>
      )}

      {/* --- LIST JOBS & STATUS --- */}
      {activeTab === 'list' && (
          <div className="job-list-wrapper bg-white p-6 rounded-xl shadow-sm border">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Your Posted Jobs</h3>
                <button onClick={fetchMyJobs} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                    <RefreshCw size={18} className={loadingJobs ? 'animate-spin' : ''}/>
                </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                            <th className="p-3">Job Title</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Salary</th>
                            <th className="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingJobs ? (
                            <tr><td colSpan="4" className="text-center p-4">Loading jobs...</td></tr>
                        ) : myJobs.length === 0 ? (
                            <tr><td colSpan="4" className="text-center p-4 text-gray-500">No jobs posted yet.</td></tr>
                        ) : (
                            myJobs.map((job) => (
                                <tr key={job.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium text-blue-900">{job.title}</td>
                                    <td className="p-3 text-gray-600">{job.location}</td>
                                    <td className="p-3 text-green-600 font-semibold">
                                        ${job.salary_min} - ${job.salary_max}
                                    </td>
                                    <td className="p-3 text-center">
                                        {/* GỌI HÀM RENDER STATUS ĐÃ FIX Ở ĐÂY */}
                                        {renderStatus(job.status)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default CreateJobPost;