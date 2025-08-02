import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import loginBg from "../assets/login.jpg";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with credentials:", credentials);
    try {
      const response = await login(credentials.email, credentials.password);
      console.log("Login successful, response data:", response);

      const { user } = response;
      if (!user) {
        throw new Error("Invalid login response: missing user data");
      }

      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "tutor") {
        navigate("/tutor-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        throw new Error("Invalid role");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(t("invalid_credentials_or_role"));
    }
  };

  const handleGoogleSignin = () => {
    // Google OAuth client ID from Google Cloud Console
    const GOOGLE_CLIENT_ID = "465566550110-dcteoks3mttkthsqp6nsjsrbs50toa4b.apps.googleusercontent.com";
    const REDIRECT_URI = "http://localhost:5173/auth/google/callback";
    
    // Google OAuth URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    // Redirect to Google OAuth
    window.location.href = googleAuthUrl;
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
      
      {/* CD-ROM Style Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Row 1 - Top */}
        <div className="absolute top-1/6 left-0 w-2 h-2 bg-blue-400/40 rounded-full animate-slide-right-slow"></div>
        <div className="absolute top-1/6 left-1/4 w-1 h-1 bg-purple-400/50 rounded-full animate-slide-right-medium"></div>
        <div className="absolute top-1/6 left-1/2 w-3 h-3 bg-indigo-400/30 rounded-full animate-slide-right-fast"></div>
        <div className="absolute top-1/6 left-3/4 w-1.5 h-1.5 bg-pink-400/45 rounded-full animate-slide-right-slow"></div>
        
        {/* Row 2 */}
        <div className="absolute top-1/3 left-0 w-1.5 h-1.5 bg-green-400/35 rounded-full animate-slide-right-medium"></div>
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-yellow-400/40 rounded-full animate-slide-right-fast"></div>
        <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-orange-400/50 rounded-full animate-slide-right-slow"></div>
        <div className="absolute top-1/3 left-5/6 w-2.5 h-2.5 bg-teal-400/30 rounded-full animate-slide-right-medium"></div>
        
        {/* Row 3 - Middle */}
        <div className="absolute top-1/2 left-0 w-1 h-1 bg-red-400/45 rounded-full animate-slide-right-fast"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-slide-right-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-slide-right-medium"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-indigo-400/50 rounded-full animate-slide-right-fast"></div>
        
        {/* Row 4 */}
        <div className="absolute top-2/3 left-0 w-2.5 h-2.5 bg-pink-400/30 rounded-full animate-slide-right-medium"></div>
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-green-400/45 rounded-full animate-slide-right-slow"></div>
        <div className="absolute top-2/3 left-2/3 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-slide-right-fast"></div>
        <div className="absolute top-2/3 left-5/6 w-2 h-2 bg-orange-400/35 rounded-full animate-slide-right-medium"></div>
        
        {/* Row 5 - Bottom */}
        <div className="absolute top-5/6 left-0 w-1 h-1 bg-teal-400/50 rounded-full animate-slide-right-fast"></div>
        <div className="absolute top-5/6 left-1/4 w-2 h-2 bg-red-400/40 rounded-full animate-slide-right-slow"></div>
        <div className="absolute top-5/6 left-1/2 w-1.5 h-1.5 bg-blue-400/35 rounded-full animate-slide-right-medium"></div>
        <div className="absolute top-5/6 left-3/4 w-1 h-1 bg-purple-400/45 rounded-full animate-slide-right-fast"></div>
        
        {/* Additional scattered particles */}
        <div className="absolute top-1/8 left-1/8 w-1 h-1 bg-white/30 rounded-full animate-slide-right-medium"></div>
        <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 bg-white/25 rounded-full animate-slide-right-slow"></div>
        <div className="absolute top-3/8 left-1/5 w-1 h-1 bg-white/35 rounded-full animate-slide-right-fast"></div>
        <div className="absolute top-5/8 left-1/7 w-1.5 h-1.5 bg-white/20 rounded-full animate-slide-right-medium"></div>
        <div className="absolute top-7/8 left-1/9 w-1 h-1 bg-white/30 rounded-full animate-slide-right-slow"></div>
        
        {/* Reverse direction particles */}
        <div className="absolute top-1/5 right-0 w-1 h-1 bg-blue-400/40 rounded-full animate-slide-left-medium"></div>
        <div className="absolute top-2/5 right-1/4 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-slide-left-slow"></div>
        <div className="absolute top-3/5 right-1/2 w-1 h-1 bg-indigo-400/45 rounded-full animate-slide-left-fast"></div>
        <div className="absolute top-4/5 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-slide-left-medium"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo/Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Math Edu
            </h2>
            <p className="text-gray-600 mt-2">Welcome back! Please sign in to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                {t("email")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder={t("enter_email")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                {t("password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder={t("enter_password")}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t("login")}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full bg-white border-2 border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/95 text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create New Account
          </button>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignin}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-300 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          

          
          

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Secure login powered by advanced authentication
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
