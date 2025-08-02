import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { googleAuth } from "../services/api";
import { showToast } from "../utils/toast";

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          throw new Error(`Google OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received from Google");
        }

        // Exchange code for token and user info
        const response = await googleAuth(code);
        
        // Store the token
        localStorage.setItem("token", response.data.access_token);
        
        // Show success message
        showToast("Successfully signed in with Google!", "success");
        
        // Redirect to appropriate dashboard based on user role
        const userRole = response.data.user?.role || "student";
        switch (userRole) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "tutor":
            navigate("/tutor-dashboard");
            break;
          case "parent":
            navigate("/parent-dashboard");
            break;
          case "student":
          default:
            navigate("/student-dashboard");
            break;
        }
      } catch (error) {
        console.error("Google auth error:", error);
        setError(error.message || "Failed to authenticate with Google");
        showToast("Google authentication failed", "error");
        
        // Redirect to login after error
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Processing Google Sign-In...
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your authentication
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Authentication Failed
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthCallback; 