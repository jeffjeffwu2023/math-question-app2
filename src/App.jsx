// src/App.jsx
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (user) {
    // Redirect logged-in users to their respective dashboards
    return user.role === "student" ? (
      <Navigate to="/student-dashboard" />
    ) : (
      <Navigate to="/admin-dashboard" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Welcome to Math Question App
        </h1>

        {/* Navigation Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/student-login"
            className="block p-4 bg-teal-50 rounded-lg shadow-sm hover:bg-teal-100 transition-colors duration-200 text-center"
            aria-label="Student Login"
          >
            <h2 className="text-subheading font-semibold text-teal-700">
              Student Login
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Login to answer questions
            </p>
          </Link>
          <Link
            to="/admin-login"
            className="block p-4 bg-orange-50 rounded-lg shadow-sm hover:bg-orange-100 transition-colors duration-200 text-center"
            aria-label="Admin Login"
          >
            <h2 className="text-subheading font-semibold text-orange-700">
              Admin Login
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Login to manage the app
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
