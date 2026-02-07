import axiosClient from "../../../infrastructure/http/axiosClient";

const adminApi = {
    // ============================================================
    // 1. DASHBOARD & SYSTEM STATUS
    // ============================================================
    getSystemStatus: async () => {
        try {
            const response = await axiosClient.get("/dashboard/admin/stats/");
            return response.data;
        } catch (error) {
            console.warn("API Error (getSystemStatus), using mock data:", error);
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

    getAdminStats: async () => {
        try {
            const response = await axiosClient.get("/admins/dashboard/");
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    // ============================================================
    // 2. QUẢN LÝ BÀI ĐĂNG (JOB POSTS)
    // ============================================================
    getJobPosts: async () => {
        try {
            /** * FIX: Thay đổi endpoint từ "/search/job/" thành "/admin/jobs/"
             * Đây là endpoint khớp với urls.py: path('admin/jobs/', job_views.admin_job_list)
             */
            const response = await axiosClient.get("/admin/jobs/");
            
            // Xử lý các dạng trả về của DRF (array hoặc object results)
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.results)) return response.data.results;
            return [];
        } catch (error) {
            handleApiError(error);
            return [];
        }
    },

    updateJobStatus: async (id, status) => {
        if (String(id).startsWith('mock-')) return { success: true, job: { id, status } };
        
        const url = `/job/processjob/${id}/`;
        
        /**
         * FIX LỖI 400: Mapping chuẩn theo JobStatusUpdateSerializer trong job_serializers.py
         * Backend yêu cầu chính xác: 'Open' hoặc 'Closed' (Case-sensitive)
         */
        const statusMapping = {
            'Approved': 'Open',   // Phải viết hoa chữ O
            'Rejected': 'Closed', // Phải viết hoa chữ C
            'Pending': 'Open'
        };

        const finalStatus = statusMapping[status] || status;
        const data = { new_status: finalStatus }; 

        try {
            console.log(`📡 Admin sending status update:`, data);
            const response = await axiosClient.put(url, data);
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    deleteJobPost: async (id) => {
        if (String(id).startsWith('mock-')) return { success: true };
        try {
            await axiosClient.delete(`/job/${id}/delete/`);
            return { success: true };
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    // ============================================================
    // 3. QUẢN LÝ NGƯỜI DÙNG (USERS)
    // ============================================================
    getCandidates: async () => {
        try {
            const response = await axiosClient.get("/candidates/");
            return response.data;
        } catch (error) {
            handleApiError(error);
            return [];
        }
    },

    getRecruiters: async () => {
        try {
            const response = await axiosClient.get("/recruiters/");
            return response.data;
        } catch (error) {
            handleApiError(error);
            return [];
        }
    },

    getAllUsers: async () => {
        try {
            const response = await axiosClient.get("/users/");
            return response.data;
        } catch (error) {
            handleApiError(error);
            return [];
        }
    },

    banUser: async (userId) => {
        try {
            const response = await axiosClient.post("/banuser/", { user_id: userId });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    unbanUser: async (userId) => {
        try {
            const response = await axiosClient.post("/unbanuser/", { user_id: userId });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    // ============================================================
    // 4. KNOWLEDGE CABINETS
    // ============================================================
    getCVTemplates: async () => {
        try {
            const response = await axiosClient.get("/cabinets/cv-templates/");
            return response.data;
        } catch (error) { return []; }
    },

    createCVTemplate: async (data) => {
        try {
            const response = await axiosClient.post("/cabinets/cv-templates/", data);
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    getInterviewQuestions: async () => {
        try {
            const response = await axiosClient.get("/cabinets/interview-questions/");
            return response.data;
        } catch (error) { return []; }
    },

    createInterviewQuestion: async (data) => {
        try {
            const response = await axiosClient.post("/cabinets/interview-questions/", data);
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    getResources: async () => {
        try {
            const response = await axiosClient.get("/cabinets/resources/");
            return response.data;
        } catch (error) { return []; }
    },

    createResource: async (data) => {
        try {
            const response = await axiosClient.post("/cabinets/resources/", data);
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    deleteResource: async (id) => {
        try {
            await axiosClient.delete(`/cabinets/resources/${id}/`);
            return { success: true };
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }
};

// ============================================================
// HÀM XỬ LÝ LỖI CHI TIẾT
// ============================================================
const handleApiError = (error) => {
    let message = "Đã có lỗi xảy ra.";
    let details = "";

    if (error.response) {
        const data = error.response.data;
        const status = error.response.status;

        switch (status) {
            case 400:
                message = "Dữ liệu không hợp lệ (400).";
                if (typeof data === 'object') {
                    details = Object.entries(data)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
                        .join("\n");
                }
                break;
            case 403:
                message = "⛔ Bạn không có quyền thực hiện (403).";
                break;
            case 404:
                message = "Không tìm thấy đường dẫn (404). Hãy kiểm tra URL Backend.";
                break;
            case 500:
                message = "Lỗi hệ thống Server (500).";
                break;
            default:
                message = data?.detail || data?.message || message;
        }
    } else if (error.request) {
        message = "Không kết nối được server (Hãy kiểm tra Backend).";
    }

    console.error("--- API ERROR LOG ---", error.response?.status, error.response?.data);
    alert(`${message}${details ? "\n\nChi tiết:\n" + details : ""}`);
};

export default adminApi;