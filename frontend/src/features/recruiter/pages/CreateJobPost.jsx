import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/CreateJobPost.css'; // Giữ lại CSS cũ của bạn
// Import icon để hiển thị trạng thái đẹp hơn (cần cài lucide-react hoặc dùng text thường)
import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react'; 

const CreateJobPost = () => {
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
      // Gọi API lấy danh sách job (Dùng API search hoặc API riêng của bạn)
      // Lưu ý: Đảm bảo backend trả về list job của user này
      const response = await axios.get('http://127.0.0.1:8000/api/search/job/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Sắp xếp: Mới nhất lên đầu
      const sortedJobs = response.data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setMyJobs(sortedJobs);
    } catch (error) {
      console.error("Không thể tải danh sách job:", error);
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
      await axios.post(
        'http://127.0.0.1:8000/api/job/create', 
        { ...formData, status: 'Pending' }, // Luôn gửi Pending
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert("🎉 Đăng bài thành công! Đang chờ Admin duyệt.");
      
      // Reset form
      setFormData({
        title: '', description: '', location: '',
        skill: '', salary_min: '', salary_max: ''
      });

      // [QUAN TRỌNG] Tải lại danh sách ngay lập tức để thấy bài vừa đăng (Status Pending)
      fetchMyJobs();

    } catch (error) {
      console.error("Lỗi đăng bài:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
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
    <div className={`app-container mesh-bg-light ${darkMode ? 'dark' : ''} min-h-screen p-8 transition-colors duration-300`}>
      
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
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" 
                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
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

      {/* Dark Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setDarkMode(!darkMode)} className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border hover:scale-110 transition-transform">
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>

    </div>
  );
};

export default CreateJobPost;