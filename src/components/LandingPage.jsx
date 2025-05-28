// src/components/LandingPage.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("welcome_to_math_platform")}
        </h1>
        <p className="text-body-md text-gray-600 text-center mb-8">
          {t("choose_your_role_to_login")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/student-login"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("student_login")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("access_student_dashboard")}
            </p>
          </Link>
          <Link
            to="/admin-login"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("admin_login")}
            </h2>
            <p className="text-body-md text-gray-600">{t("manage_platform")}</p>
          </Link>
          <Link
            to="/parent-login"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("parent_login")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("monitor_student_progress")}
            </p>
          </Link>
          <Link
            to="/tutor-login"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("tutor_login")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("support_students")}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
