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
      if (storedToken) {
        try {
          const response = await axios.get(
            `/api/auth/current-user`,
            { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `/api/auth/login`,
        { email, password }
      );
      console.log("Login response:", response.data);
      setUser(response.data.user);
      setToken(response.data.access_token);
      localStorage.setItem("token", response.data.access_token);
      showToast(t("Login successful"), "success");
      return response.data;
    } catch (error) {
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
