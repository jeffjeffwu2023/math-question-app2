// frontend/src/components/AssignHomework.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext"; // Corrected import
import { useStudentAnswers } from "../context/StudentAnswerContext";
import { useClassrooms } from "../context/ClassroomContext";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../services/api";
import { showToast } from "../utils/toast";
import QuestionPreview from "./QuestionPreview";
import { useTranslation } from "react-i18next";

function AssignHomework() {
  const { t } = useTranslation();
  const { questions } = useQuestions();
  const { createAssignment } = useStudentAnswers();
  const { classrooms } = useClassrooms();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");

  // Fetch students on-demand
  useEffect(() => {
    const fetchStudents = async () => {
      setStudentsLoading(true);
      try {
        const filters = { role: "student" };
        if (user.role === "tutor") {
          filters.tutorId = user.id;
        }
        if (selectedClassroomId) {
          filters.classroomIds = selectedClassroomId;
        }
        const response = await getUsers(filters);
        setStudents(response.data);
      } catch (error) {
        showToast(t("failed_to_fetch_users"), "error");
        console.error("Error fetching students:", error);
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudents();
  }, [user, selectedClassroomId, t]);

  const handleQuestionToggle = (index) => {
    setSelectedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAssign = async () => {
    if (!selectedStudentId || selectedQuestions.length === 0) {
      showToast(t("select_student_and_questions"), "error");
      return;
    }
    try {
      await createAssignment({
        questionIndices: selectedQuestions,
        studentId: selectedStudentId,
      });
      showToast(t("homework_assigned_successfully"), "success");
      setSelectedQuestions([]);
      setSelectedStudentId("");
      setSelectedClassroomId("");
    } catch (error) {
      showToast(t("failed_to_assign_homework"), "error");
      console.error("Error assigning homework:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          {t("assign_homework")}
        </h1>
        <div className="mb-6">
          <Link
            to={user.role === "tutor" ? "/tutor-dashboard" : "/admin-dashboard"}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label={t("back_to_dashboard")}
          >
            ← {t("back_to_dashboard")}
          </Link>
        </div>
        {studentsLoading ? (
          <div className="flex justify-center p-6">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                {t("select_classroom")}
              </label>
              <select
                value={selectedClassroomId}
                onChange={(e) => {
                  setSelectedClassroomId(e.target.value);
                  setSelectedStudentId("");
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-white transition-all duration-200 text-body-md"
                aria-label={t("select_classroom")}
              >
                <option value="">{t("all_classrooms")}</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                {t("select_student")}
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-white transition-all duration-200 text-body-md"
                aria-label={t("select_student")}
              >
                <option value="">{t("select_a_student")}</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h2 className="text-subheading font-semibold text-gray-800 mb-4">
                {t("select_questions")}
              </h2>
              {questions.length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  {t("no_questions_available")}
                </p>
              ) : (
                <ul className="space-y-4">
                  {questions.map((question, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(index)}
                        onChange={() => handleQuestionToggle(index)}
                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        aria-label={t("select_question", {
                          title: question.title,
                        })}
                      />
                      <div className="flex-1">
                        <h3 className="text-subheading font-semibold text-gray-800 mb-2">
                          {question.title}
                        </h3>
                        <div className="text-body-md text-gray-800">
                          <QuestionPreview content={question.content} />
                        </div>
                        <div className="mt-2 text-body-sm text-gray-600">
                          <span className="font-medium">{t("category")}:</span>{" "}
                          {question.category} |{" "}
                          <span className="font-medium">
                            {t("difficulty")}:
                          </span>{" "}
                          {question.difficulty}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleAssign}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-subheading"
                aria-label={t("assign_homework")}
              >
                {t("assign_homework")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AssignHomework;
