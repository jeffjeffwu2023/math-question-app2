// src/components/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../services/api"; // Direct API call
import { useClassrooms } from "../context/ClassroomContext";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";

function StudentDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { classrooms } = useClassrooms();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await getUsers({ role: "tutor", studentIds: user.id });
        setTutor(response.data[0] || null);
      } catch (error) {
        console.error("Error fetching tutor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login")}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <ClipLoader color="#2563eb" size={50} />
      </div>
    );
  }

  const classroom = classrooms?.find((c) => user.classroomIds?.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="mb-6 text-right">
          <button
            onClick={logout}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
          >
            {t("logout")}
          </button>
        </div>
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("welcome", { name: user.name })}
        </h1>
        <div className="mb-6">
          <p className="text-body-md text-gray-800">
            <span className="font-medium">{t("classroom")}:</span>{" "}
            {classroom?.name || "None"}
          </p>
          <p className="text-body-md text-gray-800">
            <span className="font-medium">{t("tutor")}:</span>{" "}
            {tutor?.name || "None"}
          </p>
        </div>
        <div>
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            {t("assignments")}
          </h2>
          <p className="text-gray-600 text-body-md">{t("no_assignments")}</p>
          <div className="mt-6 text-center">
            <Link
              to="/performance-analysis"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-body-md"
            >
              {t("view_performance")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
