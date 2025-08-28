import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getUserData,
  isAuthenticated,
  logout as authLogout,
  verifyToken,
  initializeAuth,
} from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initializeAuth();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      if (isAuthenticated()) {
        const userData = getUserData();
        if (userData) {
          // Verify token is still valid
          const verification = await verifyToken();
          if (verification.valid) {
            setUser(verification.user);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (authData) => {
    setUser(authData.user);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    hasRole,
    checkAuthStatus,
    userRole: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
