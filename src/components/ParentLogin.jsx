// src/components/ParentLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";

function ParentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [parentId, setParentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(parentId, password, "parent");
    if (success) {
      showToast(`Welcome, ${parentId}!`, "success");
      navigate("/parent-dashboard");
    } else {
      setError("Invalid parent ID or password.");
      showToast("Invalid parent ID or password.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          Parent Login
        </h1>
        {error && (
          <p className="text-red-600 text-body-md text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-body-md font-semibold text-gray-700 mb-2">
              Parent ID
            </label>
            <input
              type="text"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              placeholder="Enter your parent ID"
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
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              placeholder="Enter your password"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-subheading"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-body-md text-gray-600">
            Are you a student?{" "}
            <Link
              to="/student-login"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Login here
            </Link>
          </p>
          <p className="text-body-md text-gray-600">
            Are you an admin?{" "}
            <Link
              to="/admin-login"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ParentLogin;
