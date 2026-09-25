import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // 1. Check if user configured a custom backend URL in localStorage
    const savedUrl = localStorage.getItem('mealbridge_api_url');
    if (savedUrl) {
      return savedUrl.endsWith('/api') ? savedUrl : `${savedUrl.replace(/\/+$/, '')}/api`;
    }
    // 2. Check local dev environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }

  // 3. Environment variable from Vite build
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }

  // 4. Default to live Render backend
  return 'https://mealbridge-backend.onrender.com/api';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds to accommodate Render free-tier cold starts
});

// Attach token if present in localStorage
apiClient.interceptors.request.use((config) => {
  // Always ensure baseURL reflects any dynamic override
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('mealbridge_api_url');
    if (customUrl) {
      config.baseURL = customUrl.endsWith('/api') ? customUrl : `${customUrl.replace(/\/+$/, '')}/api`;
    }
  }

  const token = localStorage.getItem('mealbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses for clear 404 / connection error diagnostics
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      const targetUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
      console.warn(`[API 404 Not Found]: Endpoint unreachable at ${targetUrl}`);
      error.message = `Backend endpoint unreachable (404) at ${targetUrl}. Please verify your Render Backend URL.`;
    } else if (error.code === 'ERR_NETWORK') {
      const targetUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
      console.warn(`[API Network Error]: Could not connect to ${targetUrl}`);
      error.message = `Cannot connect to server at ${targetUrl}. Server may be waking up from sleep or offline.`;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
