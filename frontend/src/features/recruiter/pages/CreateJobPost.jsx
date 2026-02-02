import React, { useState, useEffect } from 'react';
import './CreateJobPost.css';

const CreateJobPost = ({ onCancel, onSuccess }) => {
  const [darkMode, setDarkMode] = useState(false);
  // State khởi tạo theo đúng Backend
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    skill: '',
    salary_min: 0,
    salary_max: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm xử lý gửi dữ liệu về Backend
  const handlePublish = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/jobs/create/', { // URL post trong job_views.py
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          skill: formData.skill,
          salary_min: parseInt(formData.salary_min),
          salary_max: parseInt(formData.salary_max)
        })
      });

      if (response.ok) {
        alert("Published Successfully!");
        onSuccess(); // Gọi hàm này để đóng form và load lại bảng
      } else {
        const errorData = await response.json();
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      {/* ... Phần Background blur giữ nguyên ... */}
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Post a New Role</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to find your next talent.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              Cancel
            </button>
            <button 
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
            >
              Publish Job
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass dark:glass-dark rounded-3xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Job Title</label>
                  <input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-semibold mb-2">Location</label>
                      <input name="location" value={formData.location} onChange={handleInputChange} className="..." placeholder="Hồ Chí Minh, VN" />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold mb-2">Skills (Comma separated)</label>
                      <input name="skill" value={formData.skill} onChange={handleInputChange} className="..." placeholder="React, Python, Django" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-semibold mb-2">Min Salary</label>
                      <input type="number" name="salary_min" value={formData.salary_min} onChange={handleInputChange} className="..." />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold mb-2">Max Salary</label>
                      <input type="number" name="salary_max" value={formData.salary_max} onChange={handleInputChange} className="..." />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Job Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6" 
                    className="w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-900/50 outline-none focus:ring-2 focus:ring-purple-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          {/* ... Phần Sidebar (Pro Tip) giữ nguyên ... */}
        </div>
      </main>
    </div>
  );
};

export default CreateJobPost;