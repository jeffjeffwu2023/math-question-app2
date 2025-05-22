// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    // Redirect to the appropriate login page based on the role
    return (
      <Navigate
        to={allowedRole === "student" ? "/student-login" : "/admin-login"}
      />
    );
  }

  if (user.role !== allowedRole) {
    // Redirect to the appropriate dashboard if the role doesn't match
    return (
      <Navigate
        to={user.role === "student" ? "/student-dashboard" : "/admin-dashboard"}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
