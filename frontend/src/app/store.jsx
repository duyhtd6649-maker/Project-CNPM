import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const savedUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    const userFound = savedUsers.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );

    if (userFound) {
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      setUser(userFound);
      return { success: true, user: userFound };
    }
    return { success: false, message: "Invalid Username/Email or Password!" };
  };

  const register = (userData) => {
    const existingUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    if (existingUsers.some(u => u.email === userData.email)) {
      return { success: false, message: "Email này đã được đăng ký!" };
    }

    const newUser = { ...userData, username: userData.name };
    existingUsers.push(newUser);
    localStorage.setItem('usersList', JSON.stringify(existingUsers));
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);