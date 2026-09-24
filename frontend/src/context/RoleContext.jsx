import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('mealbridge_role') || 'donor';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mealbridge_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync role on initial mount only if no authenticated session exists
  useEffect(() => {
    if (!currentUser) {
      switchRole(currentRole, false);
    }
  }, []);

  const loginUserSession = (user, token) => {
    setCurrentRole(user.role || 'donor');
    setCurrentUser(user);
    if (token) {
      localStorage.setItem('mealbridge_token', token);
    }
    localStorage.setItem('mealbridge_role', user.role || 'donor');
    localStorage.setItem('mealbridge_user', JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem('mealbridge_token');
    localStorage.removeItem('mealbridge_user');
    setCurrentUser(null);
    switchRole('donor', true);
  };

  const switchRole = async (newRole, shouldPersist = true) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/users/switch-role', { role: newRole });
      if (res.data.success) {
        setCurrentRole(res.data.role);
        setCurrentUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('mealbridge_token', res.data.token);
        }
        if (shouldPersist) {
          localStorage.setItem('mealbridge_role', res.data.role);
          localStorage.setItem('mealbridge_user', JSON.stringify(res.data.user));
        }
      }
    } catch (err) {
      console.warn('Fallback: Setting role locally', err.message);
      setCurrentRole(newRole);
      if (shouldPersist) {
        localStorage.setItem('mealbridge_role', newRole);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        loginUserSession,
        logout,
        isLoading,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
