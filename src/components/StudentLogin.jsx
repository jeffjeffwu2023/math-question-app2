// src/components/StudentLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";

function StudentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(studentId, password, "student");
    if (success) {
      showToast(`Welcome, ${studentId}!`, "success");
      navigate("/student-dashboard");
    } else {
      setError("Invalid student ID or password. Please try again.");
      showToast("Invalid student ID or password. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          Student Login
        </h1>
        {error && (
          <p className="text-red-600 text-body-md text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-body-md font-semibold text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
              placeholder="Enter your student ID"
              aria-label="Student ID"
            />
          </div>
          <div className="mb-6">
            <label className="block text-body-md font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-subheading"
              aria-label="Login"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-body-md text-gray-600">
            Are you an admin?{" "}
            <Link
              to="/admin-login"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
