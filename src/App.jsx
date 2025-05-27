// math-question-app2/src/App.jsx
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  const navigate = useNavigate();
  console.log("User is logged in:", user);

  useEffect(() => {
    if (user && user.role){
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        case "tutor":
          navigate("/tutor-dashboard");
          break;
        case "parent":
          navigate("/parent-dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          Math Question App
        </h1>
        <div className="space-y-4">
          <Link
            to="/student-login"
            className="block w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-center font-semibold text-body-md"
          >
            Student Login
          </Link>
          <Link
            to="/tutor-login"
            className="block w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-center font-semibold text-body-md"
          >
            Tutor Login
          </Link>
          <Link
            to="/parent-login"
            className="block w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center font-semibold text-body-md"
          >
            Parent Login
          </Link>
          <Link
            to="/admin-login"
            className="block w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center font-semibold text-body-md"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
