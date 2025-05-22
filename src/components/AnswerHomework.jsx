// src/components/AnswerHomework.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext.jsx";
import { useStudentAnswers } from "../context/StudentAnswerContext.jsx";
import QuestionPreview from "./QuestionPreview.jsx";

function AnswerHomework() {
  const { assignmentId } = useParams();
  const { questions } = useQuestions();
  const { answers, saveAnswer, assignments, submitAssignment } =
    useStudentAnswers();

  const assignment = assignments.find((a) => a.id === parseInt(assignmentId));
  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
            Homework Assignment
          </h1>
          <p className="text-gray-600 text-body-md text-center">
            Assignment not found.
          </p>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
              aria-label="Back to Dashboard"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const assignmentQuestions = questions.filter((_, index) =>
    assignment.questionIndices.includes(index)
  );

  const [studentAnswers, setStudentAnswers] = useState({});

  useEffect(() => {
    // Load saved answers for the assignment questions
    const initialAnswers = {};
    assignment.questionIndices.forEach((index) => {
      if (answers[index]) {
        initialAnswers[index] = answers[index].answer;
      }
    });
    setStudentAnswers(initialAnswers);
  }, [answers, assignment.questionIndices]);

  const handleAnswerChange = (index, value) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = () => {
    // Save all answers
    Object.keys(studentAnswers).forEach((index) => {
      const answer = studentAnswers[index];
      const isCorrect = answer.trim().length > 0; // Placeholder logic
      saveAnswer(parseInt(index), answer, isCorrect);
    });
    submitAssignment(assignment.id);
    alert("Assignment submitted!");
  };

  if (assignment.submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
            Homework Assignment
          </h1>
          <p className="text-gray-600 text-body-md text-center">
            This assignment has already been submitted.
          </p>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
              aria-label="Back to Dashboard"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Homework Assignment
        </h1>

        {/* Back to Dashboard Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Questions List */}
        <div>
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Assignment Questions
          </h2>
          {assignmentQuestions.length === 0 ? (
            <p className="text-gray-600 text-body-md">No questions assigned.</p>
          ) : (
            <ul className="space-y-6">
              {assignmentQuestions.map((question, idx) => {
                const questionIndex = assignment.questionIndices[idx];
                return (
                  <li
                    key={questionIndex}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h3 className="text-subheading font-semibold text-gray-800 mb-2">
                      {question.title}
                    </h3>
                    <div className="text-body-md text-gray-800 mb-4">
                      <QuestionPreview content={question.content} />
                    </div>
                    <div className="text-body-sm text-gray-600 mb-2">
                      <span className="font-medium">Category:</span>{" "}
                      {question.category} |{" "}
                      <span className="font-medium">Difficulty:</span>{" "}
                      {question.difficulty}
                    </div>
                    <input
                      type="text"
                      value={studentAnswers[questionIndex] || ""}
                      onChange={(e) =>
                        handleAnswerChange(questionIndex, e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
                      placeholder="Enter your answer"
                      aria-label={`Answer for question ${question.title}`}
                    />
                    {answers[questionIndex] && (
                      <p className="mt-2 text-body-md text-gray-600">
                        Saved Answer: {answers[questionIndex].answer} (
                        {answers[questionIndex].isCorrect
                          ? "Correct"
                          : "Incorrect"}
                        )
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-subheading"
            aria-label="Submit Assignment"
          >
            Submit Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnswerHomework;
