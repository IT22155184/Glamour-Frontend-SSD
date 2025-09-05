// Authentication utility functions
import axios from 'axios';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

// Store authentication data
export const storeAuthData = (authResponse) => {
  const { accessToken, refreshToken, user } = authResponse;
  
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

// Get stored tokens
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Get stored user data
export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  // Also clear old token keys for backward compatibility
  localStorage.removeItem('token');
  localStorage.removeItem('emptoken');
};

// Logout user and clear data
export const logout = async () => {
  const accessToken = getAccessToken();
  
  // Call logout endpoint if token exists
  if (accessToken) {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout endpoint failed:', error);
      // Continue with local logout even if endpoint fails
    }
  }
  
  clearAuthData();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const userData = getUserData();
  return !!(accessToken && userData);
};

// Get user role
export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

// Verify token with backend
export const verifyToken = async () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return { valid: false, user: null };
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, {
      token: accessToken
    });
    
    if (response.data.success) {
      return { valid: true, user: response.data.user };
    } else {
      // Try to refresh token
      return await refreshAccessToken();
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    // Try to refresh token
    return await refreshAccessToken();
  }
};

// Refresh access token using refresh token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthData();
    return { valid: false, user: null };
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });

    if (response.data.success) {
      storeAuthData(response.data);
      return { valid: true, user: response.data.user };
    } else {
      clearAuthData();
      return { valid: false, user: null };
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthData();
    return { valid: false, user: null };
  }
};

// Setup axios interceptor for automatic token attachment
export const setupAxiosInterceptors = () => {
  // Request interceptor to add token to headers
  axios.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshResult = await refreshAccessToken();
        if (refreshResult.valid) {
          const newAccessToken = getAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Initialize auth system
export const initializeAuth = () => {
  setupAxiosInterceptors();
};
