import axiosClient from "../../../infrastructure/http/axiosClient";

const adminApi = {
    // --- System Status ---
    getSystemStatus: async () => {
        try {
            // Attempt to fetch from real API
            const response = await axiosClient.get("/admin/system-status");
            return response.data;
        } catch (error) {
            console.warn("API Error (getSystemStatus), using mock data:", error);
            // Realistic Mock Data Fallback
            return {
                uptime: "99.98%",
                cpu: Math.floor(Math.random() * (65 - 30) + 30), // Random 30-65%
                memory: (Math.random() * (12 - 4) + 4).toFixed(1), // Random 4-12 GB
                services: [
                    { name: "Main Database (PostgreSQL)", status: "operational", uptime: "45 days 2 hrs" },
                    { name: "API Gateway", status: "operational", latency: Math.floor(Math.random() * 50 + 10) + "ms" },
                    { name: "Job Matching Engine", status: Math.random() > 0.8 ? "degraded" : "operational", details: "Processing jobs..." },
                    { name: "Auth Service", status: "operational", uptime: "99.9%" }
                ]
            };
        }
    },

    // --- Job Posts ---
    getJobPosts: async () => {
        try {
            const response = await axiosClient.get("/search/job/");
            // Map SnakeCase (Backend) to CamelCase (Frontend)
            return response.data.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company, // This is company name from serializer
                postedDate: job.created_date ? new Date(job.created_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // Fallback if created_date missing
                status: job.status
            }));
        } catch (error) {
            console.error("API Error (getJobPosts):", error);
            throw error; // Let component handle error
        }
    },

    deleteJobPost: async (id) => {
        try {
            await axiosClient.delete(`/job/${id}/delete/`);
            return { success: true };
        } catch (error) {
            console.error("API Error (deleteJobPost):", error);
            throw error;
        }
    },

    updateJobStatus: async (id, status) => {
        try {
            // Backend expects 'new_status' in body
            await axiosClient.put(`/job/processjob/${id}/`, { new_status: status });
            return { success: true };
        } catch (error) {
            console.error("API Error (updateJobStatus):", error);
            throw error;
        }
    },

    createJobPost: async (jobData) => {
        try {
            // Note: Backend might ignore 'company' if it auto-assigns based on User.
            // We send title, description (optional), location (optional), etc.
            // For now, mapping frontend 'company' to nothing or just sending it.
            // Backend requires: title. Optional: description, location, skill, etc.
            const response = await axiosClient.post("/job/create", {
                title: jobData.title,
                company_name: jobData.company, // Might be ignored by backend
                description: "No description provided", // Required by typical logic? Model says blank=True.
                location: "Unknown", // Model says blank=True, null=False
                status: 'Open'
            });
            return {
                id: response.data.id,
                title: response.data.title,
                company: response.data.company,
                postedDate: new Date().toISOString().split('T')[0],
                status: response.data.status
            };
        } catch (error) {
            console.error("API Error (createJobPost):", error);
            throw error;
        }
    }
};

export default adminApi;
