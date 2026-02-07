import React, { useState, useEffect } from 'react';
import { 
    Search, CheckCircle, XCircle, FileText, User, 
    Briefcase, Calendar, RefreshCw, Filter 
} from 'lucide-react';
import adminApi from '../services/adminApi';
import '../components/JobPosts.css'; // Tận dụng CSS table của bạn

const ApplicationReview = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('Pending'); // Mặc định chỉ hiện Pending

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const data = await adminApi.getJobApplications();
        setApplications(data);
        setLoading(false);
    };

    const handleReview = async (id, status) => {
        const actionText = status === 'Approved' ? 'DUYỆT' : 'TỪ CHỐI';
        if (!window.confirm(`Xác nhận ${actionText} hồ sơ này?`)) return;

        try {
            await adminApi.reviewApplication(id, status);
            // Cập nhật UI ngay lập tức
            setApplications(prev => prev.map(app => 
                app.id === id ? { ...app, status: status } : app
            ));
            alert(`Đã ${actionText} thành công!`);
        } catch (error) {
            alert("Lỗi khi xử lý hồ sơ.");
        }
    };

    // Lọc danh sách
    const filteredApps = applications.filter(app => {
        if (filterStatus === 'All') return true;
        return app.status === filterStatus;
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Application Review</h2>
                    <p className="text-gray-500 text-sm">Duyệt hồ sơ ứng viên trước khi chuyển cho Recruiter.</p>
                </div>
                <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-gray-500'}/>
                </button>
            </div>

            {/* Toolbar Filter */}
            <div className="flex gap-3 mb-6">
                <button 
                    onClick={() => setFilterStatus('Pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border ${filterStatus === 'Pending' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                    <ClockIcon size={16}/> Chờ duyệt (Pending)
                </button>
                <button 
                    onClick={() => setFilterStatus('Approved')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border ${filterStatus === 'Approved' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                    <CheckCircle size={16}/> Đã duyệt (Approved)
                </button>
                <button 
                    onClick={() => setFilterStatus('All')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border ${filterStatus === 'All' ? 'bg-gray-700 text-white border-gray-700' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                    <Filter size={16}/> Tất cả
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold sticky top-0">
                        <tr>
                            <th className="p-4 border-b">Candidate</th>
                            <th className="p-4 border-b">Job & Company</th>
                            <th className="p-4 border-b">Date</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading data...</td></tr>
                        ) : filteredApps.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Không có hồ sơ nào.</td></tr>
                        ) : (
                            filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <User size={20}/>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{app.candidate_name}</div>
                                                <a href={app.cv_link} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                    <FileText size={12}/> Xem CV
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{app.job_title}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Briefcase size={12}/> {app.company_name}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14}/> {new Date(app.applied_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="p-4 text-center">
                                        {app.status === 'Pending' && (
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleReview(app.id, 'Approved')}
                                                    className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 border border-green-200" 
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18}/>
                                                </button>
                                                <button 
                                                    onClick={() => handleReview(app.id, 'Rejected')}
                                                    className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 border border-red-200" 
                                                    title="Reject"
                                                >
                                                    <XCircle size={18}/>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Sub-component nhỏ để render badge màu sắc
const StatusBadge = ({ status }) => {
    let styles = "bg-gray-100 text-gray-600 border-gray-200";
    if (status === 'Approved') styles = "bg-green-100 text-green-700 border-green-200";
    if (status === 'Rejected') styles = "bg-red-100 text-red-700 border-red-200";
    if (status === 'Pending') styles = "bg-yellow-100 text-yellow-700 border-yellow-200";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
            {status}
        </span>
    );
};

// Icon Clock bị thiếu import nên define tạm hoặc import từ lucide-react
const ClockIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default ApplicationReview;