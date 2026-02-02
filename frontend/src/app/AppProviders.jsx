import React, { createContext, useContext, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // Import cái router có RootLayout của bạn

// 1. Tạo Context để quản lý thông tin đăng nhập
const AuthContext = createContext();

// 2. PHẢI CÓ DÒNG NÀY: Export useAuth để router.jsx không bị lỗi import
export const useAuth = () => useContext(AuthContext);

const AppProviders = () => {
  // Giả lập state user để ProtectedRoute trong router.jsx không bị lỗi
  const [user, setUser] = useState(null); 

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 3. Gọi RouterProvider để chạy toàn bộ cấu trúc trong router.jsx */}
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};

export default AppProviders;