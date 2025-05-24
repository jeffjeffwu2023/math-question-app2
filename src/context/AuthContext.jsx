// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { API } from "../services/api"; // Import the API instance

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id: string, role: "student" | "admin", name: string, token: string }

  const login = async (id, password, role) => {
    try {
      console.log("Attempting login with:", { id, password, role });
      const response = await API.post("/api/auth/login/", {
        id,
        password,
      });
      console.log("Login response:", response.data);
      const { access_token, user } = response.data;
      if (user.role !== role) {
        console.error(`Role mismatch: expected ${role}, got ${user.role}`);
        throw new Error(`Invalid role. Expected ${role}, got ${user.role}`);
      }
      setUser({ ...user, token: access_token });
      API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`; // Set token on API instance
      console.log("Login successful, user set:", {
        ...user,
        token: access_token,
      });
      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    delete API.defaults.headers.common["Authorization"]; // Remove token on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
