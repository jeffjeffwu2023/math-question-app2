// src/components/AnswerHomework.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuestions } from "../context/QuestionContext";
import { getAssignments, submitAssignment } from "../services/api";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";

function AnswerHomework() {
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
          throw new Error("Assignment not found or unauthorized");
        }
        setAssignment(assignmentData);
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError("Failed to load assignment.");
        showToast("Failed to load assignment.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId, user.id]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!assignment || assignment.submitted) return;
    setSubmitting(true);
    try {
      await submitAssignment(assignmentId);
      setAssignment((prev) => ({ ...prev, submitted: true }));
      showToast("Assignment submitted successfully!", "success");
    } catch (err) {
      console.error("Error submitting assignment:", err);
      showToast("Failed to submit assignment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <p className="text-red-600 text-body-md text-center">
            Please log in as a student to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Answer Homework
        </h1>
        <div className="mb-6 text-center">
          <Link
            to="/student-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Back to Dashboard"
          >
            Back to Dashboard
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
                Assignment #{assignment.id}
              </h2>
              <p className="text-body-md text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                {assignment.submitted ? "Submitted" : "Not Submitted"}
              </p>
            </div>
            {assignment.submitted ? (
              <p className="text-gray-600 text-body-md text-center">
                This assignment has already been submitted.
              </p>
            ) : (
              <>
                <h3 className="text-subheading font-semibold text-gray-800 mb-4">
                  Questions
                </h3>
                {assignment.questionIndices.map((index) => {
                  const question = questions.find((q) => q.index === index);
                  return question ? (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 space-y-2"
                    >
                      <p className="text-body-md font-medium text-gray-800">
                        {question.title} (Category: {question.category},
                        Difficulty: {question.difficulty})
                      </p>
                      <p className="text-body-md text-gray-600">
                        {question.content}
                      </p>
                      <input
                        type="text"
                        value={answers[index] || ""}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter your answer"
                        disabled={submitting}
                      />
                    </div>
                  ) : (
                    <p key={index} className="text-gray-600 text-body-md">
                      Question {index} not found.
                    </p>
                  );
                })}
                <div className="mt-6 text-center">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 text-body-md disabled:bg-indigo-400"
                    disabled={submitting || assignment.submitted}
                  >
                    {submitting ? "Submitting..." : "Submit Assignment"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-body-md text-center">
            Assignment not found.
          </p>
        )}
      </div>
    </div>
  );
}

export default AnswerHomework;
