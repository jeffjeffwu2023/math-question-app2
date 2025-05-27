// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to={allowedRole.includes("student") ? "/student-login" : "/admin-login"}
      />
    );
  }

  if (Array.isArray(allowedRole)) {
    if (!allowedRole.includes(user.role)) {
      return (
        <Navigate
          to={
            user.role === "student"
              ? "/student-dashboard"
              : user.role === "tutor"
              ? "/tutor-dashboard"
              : user.role === "parent"
              ? "/parent-dashboard"
              : "/admin-dashboard"
          }
        />
      );
    }
  } else if (user.role !== allowedRole) {
    return (
      <Navigate
        to={
          user.role === "student"
            ? "/student-dashboard"
            : user.role === "tutor"
            ? "/tutor-dashboard"
            : user.role === "parent"
            ? "/parent-dashboard"
            : "/admin-dashboard"
        }
      />
    );
  }

  return children;
}

export default ProtectedRoute;
