import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

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

  return (
    <div className="min-h-screen bg-[var(--primary-gradient)] flex items-center justify-center p-4">
      <div className="fancy-card animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="fancy-input w-full"
              placeholder={t("enter_email")}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="fancy-input w-full"
              placeholder={t("enter_password")}
            />
          </div>
          <button
            type="submit"
            className="fancy-button w-full min-h-[40px]" // Added min-height for debug
          >
            {t("login")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
