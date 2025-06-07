import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { showToast } from "../utils/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      console.log("Verifying token on mount:", storedToken);
      console.log("AuthContext: Initial loading state:", loading);
      if (storedToken) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/auth/current-user`,
            { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          console.log("Token verified, user:", response.data);
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error("Token verification failed:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            setToken(null);
            showToast(t("Session expired, please log in again"), "error");
          }
        }
      } else {
        console.log("No token found in localStorage, skipping verification");
      }
      setLoading(false);
      console.log("AuthContext: Loading state after verification:", loading);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth/login`,
        { email, password }
      );
      console.log("Login response:", response.data);
      setUser(response.data.user);
      setToken(response.data.access_token);
      localStorage.setItem("token", response.data.access_token);
      showToast(t("Login successful"), "success");
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      showToast(t("Login failed"), "error");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    showToast(t("Logged out"), "success");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
