// src/components/StudentLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(id, password, "student");
    setLoading(false);
    if (success) {
      navigate("/student-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Student Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="id"
              className="block text-body-md font-medium text-gray-700 mb-1"
            >
              Student ID
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter your student ID"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-body-md font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/admin-login"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
          >
            Admin Login
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link
            to="/parent-login"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
          >
            Parent Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
