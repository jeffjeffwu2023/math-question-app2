// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import { showToast } from "../utils/toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await API.post("/api/auth/login/", { email, password });
      const { access_token, user } = response.data;

      console.log("Login response:", response.data);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      showToast("Login successful!", "success");

      // Redirect based on role
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "tutor") {
        navigate("/tutor-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        throw new Error("Invalid role");
      }
      return user; // Return user for frontend use
    } catch (error) {
      showToast("Login failed. Check credentials or role.", "error");
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
    navigate("/login");
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
