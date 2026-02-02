import React, { createContext, useContext, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AppProviders = () => {
  // Lấy dữ liệu user ngay từ localStorage để tránh bị lỗi ProtectedRoute sau khi login
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');
    return role ? { role, username } : null;
  });

  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};

export default AppProviders;