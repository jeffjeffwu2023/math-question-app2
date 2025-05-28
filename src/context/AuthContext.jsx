// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, login } from "../services/api.js";
import { showToast } from "../utils/toast.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally verify token with backend
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    }
    setLoading(false);
  }, []);

  const loginUser = async (id, password, role) => {
    try {
      const response = await API.post("/api/auth/login/", { id, password });
      const { access_token, user } = response.data;

      console.log("Login response:", response.data);
      console.log("role---", role);

      if (user.role !== role) {
        throw new Error("Invalid role");
      }
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      showToast("Login successful!", "success");
      return true;
    } catch (error) {
      showToast("Login failed. Check credentials.", "error");
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
    showToast("Logged out successfully.", "success");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
