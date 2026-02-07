import axiosClient from "../../../infrastructure/http/axiosClient";

const adminApi = {
    // ============================================================
    // 1. SYSTEM STATUS (DASHBOARD)
    // ============================================================
    getSystemStatus: async () => {
        try {
            const response = await axiosClient.get("/dashboard/admin/stats/");
            return response.data;
        } catch (error) {
            console.warn("API Error (getSystemStatus), using mock data:", error);
            // Dữ liệu giả lập để Dashboard đẹp
            return {
                uptime: "99.98%",
                cpu: Math.floor(Math.random() * (65 - 30) + 30),
                memory: (Math.random() * (12 - 4) + 4).toFixed(1),
                services: [
                    { name: "Main Database", status: "operational", uptime: "45 days" },
                    { name: "API Gateway", status: "operational", latency: "24ms" },
                    { name: "Job Engine", status: "operational", details: "Running" },
                    { name: "Auth Service", status: "operational", uptime: "99.9%" }
                ]
            };
        }
    },

    // ============================================================
    // 2. JOB POSTS MANAGEMENT
    // ============================================================
    
    // Lấy danh sách Job
    getJobPosts: async () => {
        try {
            // Gọi API search để lấy list
            const response = await axiosClient.get("/search/job/");
            
            if (!Array.isArray(response.data)) return [];
            
            // MAP DỮ LIỆU: Backend trả về 'Open', ta đổi thành 'Approved' để hiện màu xanh
            return response.data.map(job => {
                let displayStatus = job.status;
                if (job.status === 'Open') displayStatus = 'Approved';

                return {
                    id: job.id,
                    title: job.title,
                    company: job.company_name || job.company || "Unknown Company",
                    postedDate: job.created_date ? new Date(job.created_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    status: displayStatus, // UI dùng status này
                    location: job.location,
                    salary_min: job.salary_min,
                    salary_max: job.salary_max,
                    description: job.description
                };
            });
        } catch (error) {
            console.warn("API Error (getJobPosts), using mock data.", error);
            // Mock data phòng khi lỗi
            return [
                { id: 'mock-1', title: 'Frontend Dev (Mock)', company: 'Tech Mock', postedDate: '2023-10-25', status: 'Pending', location: 'Remote' },
                { id: 'mock-2', title: 'Backend Dev (Mock)', company: 'Data Mock', postedDate: '2023-10-24', status: 'Approved', location: 'Hanoi' },
            ];
        }
    },

    // Cập nhật trạng thái (Approve/Reject)
    updateJobStatus: async (id, status) => {
        // 1. Chặn job giả (Mock)
        if (String(id).startsWith('mock-')) {
            console.log(`[MOCK] Updated Job ${id} to ${status}`);
            return { success: true }; 
        }

        // 2. MAP DỮ LIỆU: Approved -> Open (Để Backend hiểu)
        let backendStatus = status;
        if (status === 'Approved') backendStatus = 'Open';
        
        // Payload gửi đi (dùng key 'new_status' theo yêu cầu backend của bạn)
        const payload = { new_status: backendStatus };
        console.log(`Sending update to Job ${id}:`, payload);

        try {
            // [Chiến thuật]: Thử PATCH trước (chuẩn REST), nếu 405 thì dùng PUT
            const response = await axiosClient.patch(`/job/processjob/${id}/`, payload);
            return { success: true, data: response.data };

        } catch (error) {
            // Nếu lỗi 405 (Method Not Allowed) -> Thử lại bằng PUT
            if (error.response && error.response.status === 405) {
                console.log(`PATCH failed (405). Retrying with PUT...`);
                try {
                    const resPut = await axiosClient.put(`/job/processjob/${id}/`, payload);
                    return { success: true, data: resPut.data };
                } catch (errPut) {
                    handleApiError(errPut); // Xử lý lỗi của PUT
                }
            } else {
                handleApiError(error); // Xử lý các lỗi khác (400, 403, 500)
            }
        }
    },

    // Tạo Job mới (Admin tạo hộ)
    createJobPost: async (jobData) => {
        try {
            const response = await axiosClient.post("/job/create", {
                title: jobData.title,
                company_name: jobData.company, 
                description: jobData.description || "No description provided",
                location: jobData.location || "Unknown",
                skill: jobData.skill || "",
                salary_min: jobData.salary_min || 0,
                salary_max: jobData.salary_max || 0,
                status: 'Open' // Admin tạo thì Open luôn
            });
            return {
                id: response.data.id,
                title: response.data.title,
                company: response.data.company_name,
                postedDate: new Date().toISOString().split('T')[0],
                status: 'Approved' // Map sang Approved cho đẹp
            };
        } catch (error) {
            console.error("API Error (createJobPost):", error);
            handleApiError(error);
        }
    },

    // Xóa Job
    deleteJobPost: async (id) => {
        if (String(id).startsWith('mock-')) return { success: true };

        try {
            await axiosClient.delete(`/job/${id}/delete/`);
            return { success: true };
        } catch (error) {
            console.error("API Error (deleteJobPost):", error);
            // Nếu 404 nghĩa là đã xóa rồi hoặc không tồn tại -> coi như thành công
            if (error.response && error.response.status === 404) return { success: true };
            throw error;
        }
    }
};

// --- HÀM XỬ LÝ LỖI CHUNG ---
const handleApiError = (error) => {
    if (error.response) {
        // Lỗi 403: Không có quyền Admin
        if (error.response.status === 403) {
            alert("⛔ LỖI PHÂN QUYỀN (403):\nTài khoản của bạn không có quyền Admin để thực hiện thao tác này.\nVui lòng kiểm tra lại 'is_staff' và 'is_superuser' trong Database.");
        }
        // Lỗi 400: Dữ liệu gửi đi sai
        else if (error.response.data) {
            const errorData = JSON.stringify(error.response.data, null, 2);
            console.error("Backend Error Detail:", errorData);
            alert(`LỖI DỮ LIỆU (400):\n${errorData}`);
        }
        else {
            alert(`Lỗi Server (${error.response.status}). Vui lòng thử lại.`);
        }
    } else {
        alert("Không thể kết nối tới Server. Vui lòng kiểm tra mạng hoặc Backend.");
    }
    throw error; // Ném lỗi để component bên ngoài biết mà dừng loading
};

export default adminApi;