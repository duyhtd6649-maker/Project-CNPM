import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, X, MapPin, Globe, Mail, Phone, Building2, PlusCircle } from 'lucide-react';
import axios from 'axios';
import '../components/OrganizationProfile.css';

const OrganizationProfile = () => {
  // --- CẤU HÌNH API ---
  const API_BASE = 'http://127.0.0.1:8000/api';
  const API_URL_GET_PROFILE = `${API_BASE}/user/profile/myprofile`;
  const API_URL_GET_COMPANY_PROFILE = `${API_BASE}/user/company/profile`;
  const API_URL_UPDATE_COMPANY = `${API_BASE}/company/update/info/`;
  const API_URL_CREATE_COMPANY = `${API_BASE}/company/create/`;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasCompany, setHasCompany] = useState(false); // Quan trọng: default false

  const coverInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);

  const [data, setData] = useState({
    name: "", description: "", sector: "", employees: "",
    location: "", website: "", email: "", phone: "",
    cover: "", logo: ""
  });

  // --- 1. LOAD DỮ LIỆU ---
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const userRes = await axios.get(API_URL_GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = userRes.data;

      try {
        const companyRes = await axios.get(API_URL_GET_COMPANY_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const companyData = companyRes.data;
        
        // Logic xác định đã có công ty
        if (companyData && (companyData.id || companyData.name)) {
           setHasCompany(true);
           setData({
              name: companyData.name || "",
              description: companyData.description || "",
              sector: companyData.industry || "",
              employees: companyData.employee_count_range || "",
              location: companyData.address || "",
              website: companyData.website || "",
              email: companyData.email || userData.email || "",
              phone: companyData.phone || userData.phone || "",
              cover: companyData.cover_image || "",
              logo: companyData.logo_url || ""
            });
        } else {
           setHasCompany(false);
           setIsEditing(true); 
        }
      } catch (err) {
        setHasCompany(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resolveMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
    return `${BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'cover') {
        setSelectedCoverFile(file);
        setData(prev => ({ ...prev, cover: previewUrl }));
      } else if (type === 'logo') {
        setSelectedLogoFile(file);
        setData(prev => ({ ...prev, logo: previewUrl }));
      }
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async () => {
    if (!data.name) return alert("Vui lòng nhập tên công ty!");
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('address', data.location);
      formData.append('website', data.website);
      if (selectedLogoFile) formData.append('logo_url', selectedLogoFile);

      if (hasCompany) {
        await axios.put(API_URL_UPDATE_COMPANY, formData, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert("Cập nhật thành công!");
      } else {
        await axios.post(API_URL_CREATE_COMPANY, formData, {
           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert("Tạo công ty thành công!");
        setHasCompany(true);
      }
      setIsEditing(false);
      fetchData(); // Load lại để đảm bảo dữ liệu mới nhất
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.error || "Không thể lưu dữ liệu."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
      <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} />

      {/* CỘT TRÁI */}
      <div className="left-column">
        <div className="card company-card">
          {/* HEADER ẢNH BÌA */}
          <div className="cover-image">
            <img 
              src={resolveMediaUrl(data.cover) || '/assets/default-cover.png'} 
              alt="Cover" 
              onError={(e) => { e.target.src = '/assets/default-cover.png'; }}
            />
            {isEditing && (
              <button className="btn-cover-edit" onClick={() => coverInputRef.current.click()}>
                <Camera size={14} /> Change Cover
              </button>
            )}
          </div>

          <div className="company-info-container">
            {/* HÀNG TRÊN: LOGO + INFO + ACTION BUTTONS */}
            <div className="header-row">
                
                {/* LOGO */}
                <div className="company-avatar">
                   <div className="avatar-placeholder">
                       {data.logo ? (
                            <img src={resolveMediaUrl(data.logo)} alt="Logo" onError={(e) => { e.target.style.display='none'; }} />
                       ) : (
                            <span>{data.name ? data.name.charAt(0).toUpperCase() : "N"}</span>
                       )}
                   </div>
                   {isEditing && (
                     <div onClick={() => logoInputRef.current.click()} className="avatar-overlay">
                       <Camera color="white" size={24} />
                     </div>
                   )}
                </div>

                {/* INFO & BUTTONS */}
                <div className="info-action-wrapper">
                    {/* INFO BLOCK */}
                    <div className="company-text-content">
                      {!isEditing ? (
                        <>
                          <h1 className="company-name">{data.name}</h1>
                          <div className="meta-row">
                             <p className="company-meta"><Building2 size={16} /> {data.sector || "N/A"}</p>
                             <p className="company-meta"><UsersIcon /> {data.employees || "N/A"}</p>
                          </div>
                          <p className="company-meta">
                            <MapPin size={16} /> {data.location || "No location"}
                          </p>
                        </>
                      ) : (
                        <div className="edit-stack">
                          {!hasCompany && <h3 style={{color: '#4318FF'}}>Create Company</h3>}
                          <input name="name" value={data.name} onChange={handleChange} className="input-lg" placeholder="Company Name *" />
                          <div className="input-row">
                            <input name="sector" value={data.sector} onChange={handleChange} className="input-md" placeholder="Sector" />
                            <input name="employees" value={data.employees} onChange={handleChange} className="input-md" placeholder="Employees" />
                          </div>
                          <input name="location" value={data.location} onChange={handleChange} className="input-md" placeholder="Address" />
                        </div>
                      )}
                    </div>

                    {/* ACTION BUTTONS - Đặt ở đây để luôn nằm bên phải Info */}
                    <div className="action-buttons">
                      {!isEditing ? (
                         <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                            <Edit2 size={16} /> Edit Profile
                         </button>
                      ) : (
                        <div className="edit-actions">
                          {hasCompany && (
                              <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={loading}>
                                <X size={16} /> Cancel
                              </button>
                          )}
                          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Saving..." : (
                                hasCompany ? <><Save size={16} /> Save</> : <><PlusCircle size={16} /> Create</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION CARD */}
        {(hasCompany || isEditing) && (
            <div className="card overview-card">
            <h3 className="card-title">About Company</h3>
            {!isEditing ? (
                <p className="content-text">{data.description || "No description yet."}</p>
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
        )}
      </div>

      {/* CỘT PHẢI */}
      {(hasCompany || isEditing) && (
        <div className="right-column">
            <div className="card" style={{padding: '24px'}}>
            <h3 className="card-title">Contact Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ fontSize: '12px', color: '#9ca3af' }}>Website</label>
                    {!isEditing ? (
                        <div className="company-meta"><Globe size={16} color="#4318FF"/> <a href={data.website} target="_blank" rel="noreferrer">{data.website || "N/A"}</a></div>
                    ) : (
                        <input name="website" value={data.website} onChange={handleChange} className="input-md" style={{ width: '100%' }} />
                    )}
                </div>
                <div>
                    <label style={{ fontSize: '12px', color: '#9ca3af' }}>Email</label>
                    <div className="company-meta"><Mail size={16} color="#4318FF"/> {data.email}</div>
                </div>
                <div>
                    <label style={{ fontSize: '12px', color: '#9ca3af' }}>Phone</label>
                    <div className="company-meta"><Phone size={16} color="#4318FF"/> {data.phone}</div>
                </div>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default OrganizationProfile;