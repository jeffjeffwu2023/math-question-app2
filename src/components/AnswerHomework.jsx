import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuestions } from "../context/QuestionContext";
import { getAssignments, submitAssignment } from "../services/api";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import QuestionPreview from "./QuestionPreview";

function AnswerHomework() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { questions } = useQuestions();
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const response = await getAssignments(user.id);
        const assignmentData = response.data.find((a) => a.id === assignmentId);
        if (!assignmentData || assignmentData.studentId !== user.id) {
          throw new Error(t("assignment_not_found"));
        }
        setAssignment(assignmentData);
        console.log("Fetched assignment:", assignmentData);
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError(t("failed_to_load_assignment"));
        showToast(t("failed_to_load_assignment"), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId, user.id, t]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!assignment || assignment.submitted) return;
    setSubmitting(true);
    try {
      await submitAssignment(assignmentId);
      setAssignment((prev) => ({ ...prev, submitted: true }));
      showToast(t("assignment_submitted_successfully"), "success");
    } catch (err) {
      console.error("Error submitting assignment:", err);
      showToast(t("failed_to_submit_assignment"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login_student")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="preview max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          {t("answer_homework")}
        </h1>
        <div className="mb-6 text-center">
          <Link
            to="/student-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label={t("back_to_dashboard")}
          >
            {t("back_to_dashboard")}
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : error ? (
          <p className="text-red-600 text-body-md text-center">{error}</p>
        ) : assignment ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-subheading font-semibold text-gray-800 mb-2">
                {t("assignment")} #{assignment.id}
              </h2>
              <p className="text-body-md text-gray-600">
                <span className="font-medium">{t("status")}:</span>{" "}
                {assignment.submitted ? t("submitted") : t("not_submitted")}
              </p>
            </div>
            {assignment.submitted ? (
              <p className="text-gray-600 text-body-md text-center">
                {t("assignment_already_submitted")}
              </p>
            ) : (
              <>
                <h3 className="text-subheading font-semibold text-gray-800 mb-4">
                  {t("questions")}
                </h3>
                {assignment.questionIds && assignment.questionIds.length > 0 ? (
                  assignment.questionIds.map((questionId) => {
                    const question = questions.find((q) => q.id === questionId);
                    return question ? (
                      <div
                        key={questionId}
                        className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 space-y-2"
                      >
                        <p className="text-body-md font-medium text-gray-800">
                          {question.title} ({t("category")}: {question.category}
                          , {t("difficulty")}: {question.difficulty})
                        </p>
                        <QuestionPreview content={question.content} />
                        <input
                          type="text"
                          value={answers[questionId] || ""}
                          onChange={(e) =>
                            handleAnswerChange(questionId, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                          placeholder={t("enter_your_answer")}
                          disabled={submitting}
                        />
                      </div>
                    ) : (
                      <p
                        key={questionId}
                        className="text-gray-600 text-body-md"
                      >
                        {t("question_not_found", { id: questionId })}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-gray-600 text-body-md text-center">
                    {t("no_questions_in_assignment")}
                  </p>
                )}
                <div className="mt-6 text-center">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 text-body-md disabled:bg-indigo-400"
                    disabled={submitting || assignment.submitted}
                  >
                    {submitting ? t("submitting") : t("submit_assignment")}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-body-md text-center">
            {t("assignment_not_found")}
          </p>
        )}
      </div>
    </div>
  );
}

export default AnswerHomework;
