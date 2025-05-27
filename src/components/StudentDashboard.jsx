// math-question-app2/src/components/StudentDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStudentAnswers } from "../context/StudentAnswerContext";
import { useUsers } from "../context/UserContext";
import { useClassrooms } from "../context/ClassroomContext";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";
import { API } from "../services/api";

function StudentDashboard() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const {
    assignments,
    loading: answersLoading,
    error: answersError,
  } = useStudentAnswers();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { classrooms, loading: classroomsLoading } = useClassrooms();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login")}
          </p>
        </div>
      </div>
    );
  }

  if (usersLoading || answersLoading || classroomsLoading) {
    return (
      <div className="flex justify-center p-6">
        <ClipLoader color="#2563eb" size={50} />
      </div>
    );
  }

  if (usersError || answersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {usersError || answersError}
          </p>
        </div>
      </div>
    );
  }

  const student = users?.find((u) => u.id === user.id) || {};
  const classroom = classrooms?.find((c) =>
    student.classroomIds?.includes(c.id)
  );
  const tutor = users?.find(
    (u) => u.studentIds?.includes(user.id) && u.role === "tutor"
  );
  const studentAssignments =
    assignments?.filter((a) => a.studentId === user.id) || [];

  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    if (student) {
      try {
        await API.put(`/api/users/${user.id}`, { ...student, language: lng });
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <div className="mb-6 text-right">
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-2 py-1 border border-gray-200 rounded-lg text-body-md"
          >
            <option value="en">English</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          {t("welcome", { name: user.name })}
        </h1>
        <div className="mb-6 text-center">
          <button
            onClick={handleLogout}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Logout"
          >
            {t("logout")}
          </button>
        </div>
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
          {studentAssignments.length === 0 ? (
            <p className="text-gray-600 text-body-md">{t("no_assignments")}</p>
          ) : (
            <ul className="space-y-4">
              {studentAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-subheading font-semibold text-gray-800 mb-2">
                        {t("assignment")} #{assignment.id}
                      </h3>
                      <p className="text-body-md text-gray-600">
                        <span className="font-medium">{t("questions")}:</span>{" "}
                        {assignment.questionIndices.length}
                      </p>
                      <p className="text-body-md text-gray-600">
                        <span className="font-medium">{t("status")}:</span>{" "}
                        {assignment.submitted
                          ? t("submitted")
                          : t("not_submitted")}
                      </p>
                    </div>
                    <Link
                      to={`/answer-homework/${assignment.id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                      aria-label={`Answer Assignment ${assignment.id}`}
                    >
                      {assignment.submitted
                        ? t("view_submission")
                        : t("start_answering")}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/performance-analysis"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
              aria-label="View Performance Analysis"
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
