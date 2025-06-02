import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsersByTutor, getAssignments } from "../services/api";
import { useClassrooms } from "../context/ClassroomContext";
import { ClipLoader } from "react-spinners";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";

function TutorDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { classrooms } = useClassrooms();
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudentsAndAssignments = async () => {
    if (!user || user.role !== "tutor") return;
    setLoading(true);
    setError(null);
    try {
      const [studentRes, assignmentRes] = await Promise.all([
        getUsersByTutor(user.id).catch((err) => {
          console.error("Failed to fetch students:", err);
          throw new Error(t("failed_to_fetch_students"));
        }),
        getAssignments().catch((err) => {
          console.error("Failed to fetch assignments:", err);
          throw new Error(t("failed_to_fetch_assignments"));
        }),
      ]);
      setStudents(studentRes.data);
      setAssignments(assignmentRes.data);

      if (studentRes.data.length > 0) {
        for (const student of studentRes.data) {
          console.log(student);
        }
      }
    } catch (error) {
      const errorMsg = error.message || t("failed_to_fetch_data");
      showToast(errorMsg, "error");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsAndAssignments();
  }, [user, t]);

  const handleRefresh = () => {
    setTimeout(fetchStudentsAndAssignments, 1000); // Delay to avoid rapid retries
  };

  if (!user || user.role !== "tutor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login_tutor")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-8">
          {t("welcome_tutor", { name: user.name })}
        </h1>
        <div className="mb-6 text-center">
          <button
            onClick={logout}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
          >
            {t("logout")}
          </button>
        </div>
        {error && (
          <div className="mb-4 text-center">
            <p className="text-red-600 text-body-md">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
            >
              {t("retry_fetch")}
            </button>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-subheading font-semibold text-gray-800 mb-4">
                {t("your_students")}
              </h2>
              {students.length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  {t("no_students_assigned")}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                          {t("name")}
                        </th>
                        <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                          {t("email")}
                        </th>
                        <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                          {t("classroom")}
                        </th>
                        <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                          {t("assignments")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-t">
                          <td className="p-2 text-body-md text-gray-800">
                            {student.name}
                          </td>
                          <td className="p-2 text-body-md text-gray-800">
                            {student.email}
                          </td>
                          <td className="p-2 text-body-md text-gray-800">
                            {classrooms.find((c) =>
                              student.classroomIds?.includes(c.id)
                            )?.name || t("none")}
                          </td>
                          <td className="p-2 text-body-md text-gray-800">
                            {
                              assignments.filter(
                                (a) => a.studentId === student.id
                              ).length
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/assign-homework"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-body-md"
              >
                {t("assign_homework")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TutorDashboard;
