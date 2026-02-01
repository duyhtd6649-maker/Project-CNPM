import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '/src/features/candidate/pages/Login';
import Register from '/src/features/candidate/pages/Register';
import HomepageCandidates from '/src/features/candidate/pages/HomepageCandidates'; 
import AdminLogin from '/src/features/admin/pages/AdminLogin';
import AdminDashboard from '/src/features/admin/pages/AdminDashboard';

const AppProviders = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mặc định vào trang Login User */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Route cho User */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomepageCandidates />} />

        {/* Route cho Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Catch all - Quay về login nếu sai đường dẫn */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppProviders;