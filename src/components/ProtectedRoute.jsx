import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading: authLoading } = useAuth();

  console.log("ProtectedRoute: authLoading:", authLoading, "user:", !!user);

  if (authLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user) {
    console.log("ProtectedRoute: Redirecting to /login due to no user");
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRole)) {
    if (!allowedRole.includes(user.role)) {
      console.log("ProtectedRoute: Redirecting due to role mismatch", user.role, allowedRole);
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
          replace
        />
      );
    }
  } else if (user.role !== allowedRole) {
    console.log("ProtectedRoute: Redirecting due to role mismatch", user.role, allowedRole);
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
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
