import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '/src/features/candidate/pages/Login';
import Register from '/src/features/candidate/pages/Register';
import HomepageCandidates from '/src/features/candidate/pages/HomepageCandidates'; 

const AppProviders = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập là mặc định */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ĐỊNH NGHĨA TRANG CHỦ TẠI ĐÂY */}
        <Route path="/homepage" element={<HomepageCandidates />} />
        
        {/* Các trang khác nếu có */}
        {/* <Route path="/admin-login" element={<AdminLogin />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppProviders;