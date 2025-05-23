// src/components/StudentLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useStudents } from "../context/StudentContext.jsx";
import { showToast } from "../utils/toast.js"; // Import toast utility

function StudentLogin() {
  const { login } = useAuth();
  const { students } = useStudents();
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const student = students.find((s) => s.id === studentId.trim());
    if (student) {
      login({ id: student.id, role: "student", name: student.name });
      showToast(`Welcome, ${student.name}!`, "success");
      navigate("/student-dashboard");
    } else {
      setError("Student ID not found. Please try again.");
      showToast("Student ID not found. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          Student Login
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-body-md text-center mb-4">{error}</p>
        )}

        {/* Login Form */}
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

        {/* Link to Admin Login */}
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
