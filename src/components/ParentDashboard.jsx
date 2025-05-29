// src/components/ParentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { getChildren, getAssignments, analyzeStudent } from "../services/api";
import { showToast } from "../utils/toast";

const ParentDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ParentDashboard mounted with user:", user);

    const fetchData = async () => {

      console.log("Fetching data for parent:", user);
      setIsLoading(true);
      try {
        // Fetch all users to find students
        const response = await getChildren(user.id);
        const children = response.data;

        console.log("All children fetched:", children);

        setStudents(children);

        // Fetch assignments and progress for each student
        const assignmentsData = {};
        const progressData = {};
        for (const student of children) {
          // Fetch recent assignments
          const assignmentsResponse = await getAssignments(student.id);
          assignmentsData[student.id] = assignmentsResponse.data.slice(0, 5); // Limit to 5 recent assignments

          // Fetch progress
          const progressResponse = await analyzeStudent(student.id);
          progressData[student.id] = progressResponse.data;
        }
        setAssignments(assignmentsData);
        setProgress(progressData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(t("failed_to_load_data"));
        showToast(t("failed_to_load_data"), "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.studentIds) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user, t]);

  const handleViewDetails = (studentId) => {
    // Placeholder for viewing detailed student performance
    showToast(t("view_details_under_construction"), "info");
  };

  const handleContactTutor = (tutorId) => {
    // Placeholder for contacting tutor
    showToast(t("contact_tutor_under_construction"), "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("parent_dashboard")}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-center text-gray-500">{t("loading")}</p>
        ) : students.length === 0 ? (
          <p className="text-center text-gray-500">{t("no_students_found")}</p>
        ) : (
          <div className="space-y-8">
            {students.map((student) => (
              <div
                key={student.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("student")}: {student.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress Overview */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {t("progress_overview")}
                    </h3>
                    {progress[student.id] ? (
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          {t("total_correct")}:{" "}
                          {progress[student.id].totalCorrect || 0}
                        </p>
                        <p className="text-gray-600">
                          {t("total_attempts")}:{" "}
                          {progress[student.id].totalAttempts || 0}
                        </p>
                        <p className="text-gray-600">
                          {t("avg_time_taken")}:{" "}
                          {(progress[student.id].avgTimeTaken || 0).toFixed(2)}s
                        </p>
                        <button
                          onClick={() => handleViewDetails(student.id)}
                          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {t("view_details")}
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("no_progress_data")}</p>
                    )}
                  </div>

                  {/* Recent Assignments */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {t("recent_assignments")}
                    </h3>
                    {assignments[student.id] &&
                    assignments[student.id].length > 0 ? (
                      <ul className="space-y-2">
                        {assignments[student.id].map((assignment) => (
                          <li
                            key={assignment.id}
                            className="border-b py-2 flex justify-between items-center"
                          >
                            <span className="text-gray-600">
                              {assignment.title || t("assignment")} -{" "}
                              {new Date(
                                assignment.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <span
                              className={`text-sm ${
                                assignment.status === "completed"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {assignment.status || "Pending"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        {t("no_assignments_found")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Tutor (if applicable) */}
                {student.tutorId && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleContactTutor(student.tutorId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {t("contact_tutor")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
