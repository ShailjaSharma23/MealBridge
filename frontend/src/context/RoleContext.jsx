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

  // On initial mount: restore real user session if token exists, do NOT force demo user!
  useEffect(() => {
    const token = localStorage.getItem('mealbridge_token');
    if (token) {
      apiClient
        .get('/users/profile')
        .then((res) => {
          if (res.data.success && res.data.user) {
            setCurrentUser(res.data.user);
            setCurrentRole(res.data.user.role || 'donor');
            localStorage.setItem('mealbridge_user', JSON.stringify(res.data.user));
            localStorage.setItem('mealbridge_role', res.data.user.role || 'donor');
          }
        })
        .catch(() => {
          console.warn('Session expired or offline. Ready as guest.');
        });
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
    localStorage.removeItem('mealbridge_role');
    setCurrentUser(null);
    setCurrentRole('guest');
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
