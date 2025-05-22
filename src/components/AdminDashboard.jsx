// src/components/AdminDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Admin Dashboard
        </h1>

        {/* Logout Button */}
        <div className="mb-6 text-center">
          <button
            onClick={handleLogout}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

        {/* Navigation Links */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link
            to="/add-question"
            className="block p-4 bg-indigo-50 rounded-lg shadow-sm hover:bg-indigo-100 transition-colors duration-200 text-center"
            aria-label="Add a New Question"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              Add Question
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Create a new math question
            </p>
          </Link>
          <Link
            to="/list-questions"
            className="block p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 text-center"
            aria-label="List All Questions"
          >
            <h2 className="text-subheading font-semibold text-gray-700">
              List Questions
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              View all saved questions
            </p>
          </Link>
          <Link
            to="/category-management"
            className="block p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 text-center"
            aria-label="Manage Categories"
          >
            <h2 className="text-subheading font-semibold text-gray-700">
              Category Management
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Add or edit question categories
            </p>
          </Link>
          <Link
            to="/assign-homework"
            className="block p-4 bg-purple-50 rounded-lg shadow-sm hover:bg-purple-100 transition-colors duration-200 text-center"
            aria-label="Assign Homework"
          >
            <h2 className="text-subheading font-semibold text-purple-700">
              Assign Homework
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Assign questions to students
            </p>
          </Link>
          <Link
            to="/student-management"
            className="block p-4 bg-orange-50 rounded-lg shadow-sm hover:bg-orange-100 transition-colors duration-200 text-center"
            aria-label="Manage Students"
          >
            <h2 className="text-subheading font-semibold text-orange-700">
              Student Management
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Add or edit students
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
