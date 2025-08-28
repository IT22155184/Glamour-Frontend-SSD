import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

const HomeRedirect = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        // Redirect based on user role
        if (userRole === 'customer') {
          navigate('/HomeCus');
        } else if (userRole === 'employee') {
          navigate('/Store_Manager');
        } else {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }
  }, [isLoggedIn, userRole, loading, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return null;
};

export default HomeRedirect;
