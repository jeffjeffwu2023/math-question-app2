import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers, getAssignments } from "../services/api";
import { useClassrooms } from "../context/ClassroomContext";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";
import { showToast } from "../utils/toast";
import Navigation from "./Navigation"; // Adjusted path

function StudentDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth(); // Remove logout since it's in Navigation
  const { classrooms } = useClassrooms();
  const [tutor, setTutor] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "student") return;
      setLoading(true);
      try {
        const [tutorRes, assignmentRes] = await Promise.all([
          getUsers({ role: "tutor", id: user.tutorId }).catch((err) => {
            console.error("Failed to fetch tutor:", err);
            return { data: [] };
          }),
          getAssignments(user.id).catch((err) => {
            console.error("Failed to fetch assignments:", err);
            throw new Error(t("failed_to_fetch_assignments"));
          }),
        ]);
        setTutor(tutorRes.data[0] || null);
        setAssignments(assignmentRes.data.filter((a) => !a.submitted)); // Show only pending
        console.log("Assignments for studentId:", user.id, assignmentRes.data);
      } catch (error) {
        const errorMsg = error.message || t("failed_to_fetch_data");
        showToast(errorMsg, "error");
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, t]);

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login_student")}
          </p>
        </div>
      </div>
    );
  }

  const classroom = classrooms?.find((c) => user.classroomIds?.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-4">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("welcome", { name: user.name })}
        </h1>
        <div className="mb-6">
          <p className="text-body-md text-gray-800">
            <span className="font-medium">{t("classroom")}:</span>{" "}
            {classroom?.name || t("none")}
          </p>
          <p className="text-body-md text-gray-800">
            <span className="font-medium">{t("tutor")}:</span>{" "}
            {tutor?.name || t("none")}
          </p>
        </div>
        <div>
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            {t("assignments")}
          </h2>
          {error && (
            <p className="text-red-600 text-body-md text-center mb-4">
              {error}
            </p>
          )}
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader color="#2563eb" size={50} />
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-gray-600 text-body-md">{t("no_assignments")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                      {t("assignment_id")}
                    </th>
                    <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                      {t("questions")}
                    </th>
                    <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                      {t("created_at")}
                    </th>
                    <th className="p-2 text-left text-body-md font-semibold text-gray-800">
                      {t("action")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-t">
                      <td className="p-2 text-body-md text-gray-800">
                        {assignment.id}
                      </td>
                      <td className="p-2 text-body-md text-gray-800">
                        {assignment.questionIds.length}
                      </td>
                      <td className="p-2 text-body-md text-gray-800">
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-body-md text-gray-800">
                        <Link
                          to={`/answer-homework/${assignment.id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("start_assignment")}
                        </Link>
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
            to="/performance-analysis"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-body-md"
          >
            {t("view_performance")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
