import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import Spinner from '../../components/Spinner';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuth Callback Debug Info:');
        console.log('Full URL:', window.location.href);
        console.log('Attempting to fetch user profile from backend...');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Profile response:', data);
          
          if (data.success && data.user) {
            const user = data.user;
            
            const authData = {
              user,
              userType: user.role
            };

            // Store only user data (tokens are in HTTP-only cookies)
            localStorage.setItem('userData', JSON.stringify(user));

            // Update auth context
            login(authData);

            enqueueSnackbar(`Welcome, ${user.firstName || user.name}!`, {
              variant: 'success',
            });

            // Redirect based on user role
            if (user.role === 'customer') {
              navigate('/HomeCus');
            } else if (user.role === 'employee') {
              navigate('/Store_Manager');
            }
          } else {
            console.error('Invalid profile response:', data);
            enqueueSnackbar('Authentication failed - Invalid profile data', { variant: 'error' });
            navigate('/login');
          }
        } else {
          console.error('Profile fetch failed:', response.status, response.statusText);
          enqueueSnackbar('Authentication failed - Could not fetch profile', { variant: 'error' });
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        enqueueSnackbar('Authentication failed - Network error', { variant: 'error' });
        navigate('/login');
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
