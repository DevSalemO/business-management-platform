import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    // In a real app, you would make an API call here
    // For now, we'll just simulate it with localStorage
    const newUser = {
      ...userData,
      id: Date.now(), // Generate a simple unique ID
    };
    
    // Store in localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Log the user in
    login(newUser);
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
