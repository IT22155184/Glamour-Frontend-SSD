// Migration utility to handle existing users with old token format
import { clearAuthData } from './auth';

export const migrateOldTokens = () => {
  const oldToken = localStorage.getItem('token');
  const oldEmpToken = localStorage.getItem('emptoken');
  
  if (oldToken || oldEmpToken) {
    console.log('Found old tokens, clearing for migration...');
    
    // Clear old tokens
    localStorage.removeItem('token');
    localStorage.removeItem('emptoken');
    
    // Clear any existing new format data to ensure clean state
    clearAuthData();
    
    // User will need to login again
    return true;
  }
  
  return false;
};

// Check if user needs to migrate
export const needsMigration = () => {
  const oldToken = localStorage.getItem('token');
  const oldEmpToken = localStorage.getItem('emptoken');
  const newAccessToken = localStorage.getItem('accessToken');
  
  return (oldToken || oldEmpToken) && !newAccessToken;
};
