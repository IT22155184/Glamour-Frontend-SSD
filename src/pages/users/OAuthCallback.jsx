import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storeAuthData } from '../../utils/auth';
import { enqueueSnackbar } from 'notistack';
import Spinner from '../../components/Spinner';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      const userParam = urlParams.get('user');

      if (accessToken && refreshToken && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          
          const authData = {
            accessToken,
            refreshToken,
            user,
            userType: user.role
          };

          // Store authentication data
          storeAuthData(authData);

          // Update auth context
          login(authData);

          enqueueSnackbar(`Welcome, ${user.firstName}!`, {
            variant: 'success',
          });

          // Redirect based on user role
          if (user.role === 'customer') {
            navigate('/HomeCus');
          } else if (user.role === 'employee') {
            navigate('/Store_Manager');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          enqueueSnackbar('Authentication failed', { variant: 'error' });
          navigate('/LoginUser');
        }
      } else {
        enqueueSnackbar('Authentication failed', { variant: 'error' });
        navigate('/LoginUser');
      }
    };

    handleOAuthCallback();
  }, [navigate, login]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
