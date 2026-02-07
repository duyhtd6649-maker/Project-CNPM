import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, X, MapPin, Globe, Mail, Phone, Building2 } from 'lucide-react';
import axios from 'axios';
import '../components/OrganizationProfile.css'; 

const OrganizationProfile = () => {
  // --- CẤU HÌNH API (QUAN TRỌNG: Bạn hãy hỏi Backend endpoint chính xác để điền vào đây) ---
  const API_URL_GET_PROFILE = 'http://127.0.0.1:8000/api/user/profile/myprofile';
  const API_URL_GET_COMPANY_PROFILE = 'http://127.0.0.1:8000/api/user/company/profile'
  
  // Giả sử API update company nằm ở đây (thường Backend sẽ cấp ID hoặc update theo user đang login)
  // Nếu Backend chưa có API này, code sẽ báo lỗi 404 khi bấm Save.
  const API_URL_UPDATE_COMPANY = 'http://127.0.0.1:8000/api/company/update/info/'; 

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Trạng thái đang tải

  // Ref để kích hoạt input file ẩn
  const coverInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // State lưu file ảnh gốc để upload
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);

  // State dữ liệu hiển thị
  const [data, setData] = useState({
    name: "",
    description: "",
    sector: "",
    employees: "",
    location: "",
    website: "",
    email: "",
    phone: "",
    cover: "", // URL ảnh bìa để hiển thị (preview)
    logo: ""   // URL logo để hiển thị (preview)
  });

  // --- 1. LOAD DỮ LIỆU TỪ BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Hoặc lấy từ nơi bạn lưu token
        if (!token) return;

        const response = await axios.get(API_URL_GET_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const response_2 = await axios.get(API_URL_GET_COMPANY_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Mapping dữ liệu từ Backend về Frontend
        // Cấu trúc response phụ thuộc vào Serializer của Backend.
        // Dưới đây là ví dụ mapping thường gặp, hãy console.log(response.data) để kiểm tra.
        const userData = response.data; 
        const companyData = response_2.data || {}; // Giả sử recruiter có field 'company' chứa object

        setData({
          name: companyData.name || "Tên công ty chưa cập nhật",
          description: companyData.description || "Chưa có mô tả",
          sector: companyData.industry || "Chưa cập nhật",
          employees: companyData.employee_count_range || "Chưa cập nhật",
          location: companyData.address || "Chưa cập nhật",
          website: companyData.website || "",
          email: companyData.email || userData.email || "", // Lấy email công ty hoặc email recruiter
          phone: companyData.phone || userData.phone || "",
          cover: companyData.cover_image || "", // URL ảnh từ server
          logo: companyData.logo_url || ""          // URL ảnh từ server
        });

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu profile:", error);
      }
    };

    fetchData();
  }, []);

  // Resolve media URL (backend may return relative paths)
  const resolveMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
    return `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  };

  // --- 2. XỬ LÝ NHẬP LIỆU TEXT ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. XỬ LÝ CHỌN ẢNH (PREVIEW NGAY LẬP TỨC) ---
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL ảo để xem trước ảnh ngay lập tức mà chưa cần upload
      const previewUrl = URL.createObjectURL(file);
      
      if (type === 'cover') {
        setSelectedCoverFile(file); // Lưu file vào state để tí nữa gửi
        setData(prev => ({ ...prev, cover: previewUrl })); // Hiện preview
      } else if (type === 'logo') {
        setSelectedLogoFile(file);
        setData(prev => ({ ...prev, logo: previewUrl }));
      }
    }
  };

  // --- 4. GỬI DỮ LIỆU LÊN SERVER (UPDATE) ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();

      // Đóng gói dữ liệu Text
      // CHÚ Ý: Các key ('name', 'description'...) phải khớp với key mà Backend mong đợi
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('address', data.location);
      formData.append('website', data.website);

      // Đóng gói File (Chỉ gửi nếu có file mới được chọn)
      if (selectedLogoFile) {
        formData.append('logo_url', selectedLogoFile);
      }

      // Gọi API Update (PATCH hoặc PUT)
      await axios.put(API_URL_UPDATE_COMPANY, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Bắt buộc để gửi file
        }
      });

      alert("Cập nhật thành công!");
      setIsEditing(false);
      // Reset file tạm
      setSelectedCoverFile(null);
      setSelectedLogoFile(null);

    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Lỗi: Không thể lưu. Hãy kiểm tra lại Backend xem đã có API update chưa.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER GIAO DIỆN ---
  return (
    <div className="main-layout">
      
      {/* INPUT FILE ẨN (Dùng ref để kích hoạt) */}
      <input 
        type="file" 
        ref={coverInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={(e) => handleImageChange(e, 'cover')}
      />
      <input 
        type="file" 
        ref={logoInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={(e) => handleImageChange(e, 'logo')}
      />

      {/* CỘT TRÁI (LỚN) */}
      <div className="left-column">
        
        <div className="card company-card">
          {/* Ảnh bìa */}
          <div className="cover-image">
            <img 
              src={resolveMediaUrl(data.cover) || '/assets/default-cover.png'} 
              alt="Cover" 
              onError={(e) => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = 'true'; e.target.src = '/assets/default-cover.png'; e.target.onerror = null; } }}
            />
            {isEditing && (
              <button className="btn-cover-edit" onClick={() => coverInputRef.current.click()}>
                <Camera size={14} /> Change Cover
              </button>
            )}
          </div>

          <div className="company-info-container">
            {/* Nút Action (Góc phải) */}
            <div className="action-buttons">
              {!isEditing ? (
                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={loading}>
                    <X size={16} /> Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : <><Save size={16} /> Save Changes</>}
                  </button>
                </>
              )}
            </div>

            {/* Avatar (Logo) */}
            <div className="company-avatar">
               <div className="avatar-placeholder">
                   {data.logo ? (
                        <img 
                          src={resolveMediaUrl(data.logo) || '/assets/default-logo.svg'} 
                          alt="Logo" 
                          onError={(e) => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = 'true'; e.target.src = '/assets/default-logo.svg'; e.target.onerror = null; } }} 
                        />
                      ) : (
                        data.name.charAt(0).toUpperCase()
                      )}
               </div>
               {isEditing && (
                 <div 
                    onClick={() => logoInputRef.current.click()}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}
                 >
                   <Camera color="white" size={24} />
                 </div>
               )}
            </div>

            {/* Nội dung Text */}
            <div className="company-text-content">
              {!isEditing ? (
                <>
                  <h1 className="company-name">{data.name}</h1>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                     <p className="company-meta"><Building2 size={16} /> {data.sector}</p>
                     <p className="company-meta"><UsersIcon /> {data.employees}</p>
                  </div>
                  <p className="company-meta" style={{ marginTop: '5px' }}>
                    <MapPin size={16} /> {data.location}
                  </p>
                </>
              ) : (
                <div className="edit-stack">
                  <input name="name" value={data.name} onChange={handleChange} className="input-lg" placeholder="Company Name" />
                  
                  <div className="input-row">
                    <input name="sector" value={data.sector} onChange={handleChange} className="input-md" placeholder="Sector / Industry" />
                    <input name="employees" value={data.employees} onChange={handleChange} className="input-md" placeholder="Employees Count" />
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <input name="location" value={data.location} onChange={handleChange} className="input-md" style={{ width: '100%', paddingLeft: '35px' }} placeholder="Address" />
                    <MapPin size={16} style={{ position: 'absolute', left: 10, top: 12, color: '#666' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: DESCRIPTION */}
        <div className="card overview-card">
          <h3 className="card-title">About Company</h3>
          {!isEditing ? (
            <p className="content-text">{data.description}</p>
          ) : (
            <textarea 
              name="description" 
              value={data.description} 
              onChange={handleChange} 
              className="input-area" 
              rows={6}
              placeholder="Describe your company..."
            />
          )}
        </div>
      </div>

      {/* CỘT PHẢI (NHỎ) */}
      <div className="right-column">
        {/* Contact Info */}
        <div className="card">
           <h3 className="card-title">Contact Info</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             
             {/* Website */}
             <div>
               <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', display: 'block' }}>Website</label>
               {!isEditing ? (
                 <div className="company-meta" style={{ margin: 0 }}><Globe size={16} color="#4318FF"/> <a href={data.website} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration:'none'}}>{data.website}</a></div>
               ) : (
                 <input name="website" value={data.website} onChange={handleChange} className="input-md" style={{ width: '100%' }} />
               )}
             </div>

             {/* Email */}
             <div>
               <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', display: 'block' }}>Email</label>
               {!isEditing ? (
                 <div className="company-meta" style={{ margin: 0 }}><Mail size={16} color="#4318FF"/> {data.email}</div>
               ) : (
                 <input name="email" value={data.email} onChange={handleChange} className="input-md" style={{ width: '100%' }} />
               )}
             </div>

             {/* Phone */}
             <div>
               <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', display: 'block' }}>Phone</label>
               {!isEditing ? (
                 <div className="company-meta" style={{ margin: 0 }}><Phone size={16} color="#4318FF"/> {data.phone}</div>
               ) : (
                 <input name="phone" value={data.phone} onChange={handleChange} className="input-md" style={{ width: '100%' }} />
               )}
             </div>
           </div>
        </div>

        {/* Gallery Placeholder */}
        <div className="card thumbnail-card">
           <h3 className="card-title">Gallery</h3>
           <div className="gray-placeholder" style={{ height: '150px' }}>
              Images will appear here
           </div>
        </div>
      </div>

    </div>
  );
};

// Icon nhỏ
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default OrganizationProfile;