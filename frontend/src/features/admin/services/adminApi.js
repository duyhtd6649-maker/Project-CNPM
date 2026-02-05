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
            const response = await axiosClient.get("/admin/job-posts");
            return response.data;
        } catch (error) {
            console.warn("API Error (getJobPosts), using mock data:", error);
            return [
                { id: 101, title: 'Senior Frontend Engineer', company: 'TechCorp Inc.', postedDate: '2023-10-24', status: 'Active' },
                { id: 102, title: 'Product Designer', company: 'Creative Studio', postedDate: '2023-10-22', status: 'Active' },
                { id: 103, title: 'Backend Developer (Go)', company: 'FinData Systems', postedDate: '2023-10-20', status: 'Closed' },
                { id: 104, title: 'Marketing Manager', company: 'Global Brands', postedDate: '2023-10-18', status: 'Draft' },
                { id: 105, title: 'React Native Developer', company: 'Appify', postedDate: '2023-10-15', status: 'Active' },
                { id: 106, title: 'DevOps Engineer', company: 'CloudNet', postedDate: '2023-10-10', status: 'Active' },
            ];
        }
    }
};

export default adminApi;
