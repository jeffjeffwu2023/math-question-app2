// src/components/AssignHomework.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext.jsx";
import { useStudentAnswers } from "../context/StudentAnswerContext.jsx";
import QuestionPreview from "./QuestionPreview.jsx"; // Add this import

function AssignHomework() {
  const { questions } = useQuestions();
  const { assignHomework } = useStudentAnswers();

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [studentId, setStudentId] = useState(""); // Placeholder for student ID

  const handleQuestionToggle = (index) => {
    setSelectedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAssign = () => {
    if (!studentId.trim()) {
      alert("Please enter a student ID.");
      return;
    }
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }
    assignHomework(selectedQuestions, studentId);
    alert(`Homework assigned to student ${studentId}!`);
    setSelectedQuestions([]);
    setStudentId("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Assign Homework
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

        {/* Student ID */}
        <div className="mb-6">
          <label className="block text-body-md font-semibold text-gray-700 mb-2">
            Student ID
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
            placeholder="Enter student ID"
            aria-label="Student ID"
          />
        </div>

        {/* Questions List */}
        <div>
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Select Questions
          </h2>
          {questions.length === 0 ? (
            <p className="text-gray-600 text-body-md">
              No questions available. Please add some questions first.
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
                    aria-label={`Select question ${question.title}`}
                  />
                  <div className="flex-1">
                    <h3 className="text-subheading font-semibold text-gray-800 mb-2">
                      {question.title}
                    </h3>
                    <div className="text-body-md text-gray-800">
                      <QuestionPreview content={question.content} />
                    </div>
                    <div className="mt-2 text-body-sm text-gray-600">
                      <span className="font-medium">Category:</span>{" "}
                      {question.category} |{" "}
                      <span className="font-medium">Difficulty:</span>{" "}
                      {question.difficulty}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Assign Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleAssign}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-subheading"
            aria-label="Assign Homework"
          >
            Assign Homework
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignHomework;
