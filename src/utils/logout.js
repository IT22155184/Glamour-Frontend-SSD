// Logout utility that can be used throughout the app
import { logout as authLogout } from './auth';

export const handleLogout = async (navigate, redirectPath = '/login') => {
  try {
    await authLogout();
    navigate(redirectPath);
  } catch (error) {
    console.error('Logout failed:', error);
    navigate(redirectPath);
  }
};
