import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('mealbridge_role') || 'donor';
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync role on initial mount
  useEffect(() => {
    switchRole(currentRole, false);
  }, []);

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
    <RoleContext.Provider value={{ currentRole, currentUser, switchRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
