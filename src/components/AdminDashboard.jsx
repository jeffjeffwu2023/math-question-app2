// src/components/AdminDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function AdminDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login_admin")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-8">
          {t("welcome_admin", { name: user.name })}
        </h1>
        <div className="mb-6 text-center">
          <button
            onClick={handleLogout}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
          >
            {t("logout")}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/add-question"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("add_question")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("create_new_questions")}
            </p>
          </Link>
          <Link
            to="/user-management"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("user_management")}
            </h2>
            <p className="text-body-md text-gray-600">{t("manage_users")}</p>
          </Link>
          <Link
            to="/knowledge-points"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("knowledge_point_management")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("manage_knowledge_points")}
            </p>
          </Link>
          <Link
            to="/classroom-management"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("classroom_management")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("manage_classrooms")}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
