import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '/src/features/candidate/pages/Login';
import Register from '/src/features/candidate/pages/Register';
import HomepageCandidates from '/src/features/candidate/pages/HomepageCandidates'; 
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AppProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setUser({ loggedIn: true });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setUser({ loggedIn: true, ...data });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AppProviders;