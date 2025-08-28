import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const { isLoggedIn, loading, hasRole, userRole } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    if (userRole === 'customer') {
      return <Navigate to="/HomeCus" replace />;
    } else if (userRole === 'employee') {
      return <Navigate to="/Store_Manager" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
