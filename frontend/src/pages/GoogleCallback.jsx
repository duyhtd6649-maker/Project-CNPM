import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // File cấu hình axios của bạn

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Lấy mã code từ URL
        const code = searchParams.get('code');
        
        if (code) {
            // 2. Gửi code xuống Backend ngay lập tức
            // Backend sẽ dùng code này để đổi lấy thông tin user
            axiosClient.post('/api/auth/google/', { code: code })
                .then(response => {
                    // 3. Login thành công -> Lưu Token của hệ thống mình
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                    
                    // 4. Chuyển hướng vào trang chính
                    navigate('/dashboard');
                })
                .catch(error => {
                    console.error("Login Failed:", error);
                    navigate('/login');
                });
        }
    }, []);

    return <div>Đang xử lý đăng nhập Google... vui lòng chờ...</div>;
};

export default GoogleCallback;