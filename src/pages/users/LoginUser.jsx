import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Logo from "../../components/navbar/NavbarLogo";
import Input from "../../components/form/Input"; // Ensure you have this component
import Spinner from "../../components/Spinner";
import Footer from "../../components/footer/Footer";
import { storeAuthData } from "../../utils/auth";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const methods = useForm();
  const { handleSubmit } = methods;
  const { login } = useAuth();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
          userType: 'customer' // Default to customer, can be extended for employee login
        }
      );

      if (response.data.success) {
        // Store auth data in localStorage
        storeAuthData({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user
        });

        // Update auth context
        login({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });

        enqueueSnackbar('Login successful!', { variant: 'success' });
        // Role-based navigation for consistency with OAuth flow
        const userRole = response.data.user?.role || response.data.user?.userType || 'customer';
        let redirectPath = '/';
        if (userRole === 'admin') {
          redirectPath = '/admin';
        } else if (userRole === 'employee') {
          redirectPath = '/employee';
        } else if (userRole === 'customer') {
          redirectPath = '/dashboard';
        }
        navigate(redirectPath);
      } else {
        enqueueSnackbar(response.data.message || 'Login failed', { variant: 'error' });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div>
      <div className="flex h-fit flex-row justify-center bg-white mt-3 pb-3 ">
        <Logo />
      </div>
      <div className="w-full h-full bg-fixed pt-9 bg-ternary bg-no-repeat">
        {loading && <Spinner />}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="bg-secondary shadow-2xl   rounded-xl w-[600px] p-8 mt-20 mx-auto font-BreeSerif"
          >
            <h1 className="text-4xl font-Aboreto text-primary font-semibold my-8 text-center">
              Login to Your Account
            </h1>
            <Input
              formtype="input"
              label="Email"
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              autoComplete="email"
              required
            />
            <Input
              formtype="input"
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              autoComplete="current-password"
              required
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-4 p-2 bg-primary text-white rounded w-1/3"
              >
                Login
              </button>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-2 p-2 bg-white border border-gray-300 text-gray-700 rounded w-1/3 flex items-center justify-center hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Login with Google
              </button>
            </div>
          </form>
        </FormProvider>
        <div className="text-center text-xl mt-4">
          <span className="text-black font-BreeSerif">New Here? </span>
          <Link to="/Register">
            <button
              type="button"
              className="text-blue-500 font-BreeSerif underline"
            >
              Sign Up
            </button>
          </Link>
        </div>
        <div className="h-40"></div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
