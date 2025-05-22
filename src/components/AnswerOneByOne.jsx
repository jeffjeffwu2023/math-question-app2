// src/components/AnswerOneByOne.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext.jsx";
import { useStudentAnswers } from "../context/StudentAnswerContext.jsx";
import QuestionPreview from "./QuestionPreview.jsx";

function AnswerOneByOne() {
  const { questions } = useQuestions();
  const { answers, saveAnswer } = useStudentAnswers();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");

  useEffect(() => {
    // Load the student's previous answer for the current question, if any
    if (answers[currentIndex]) {
      setStudentAnswer(answers[currentIndex].answer);
    } else {
      setStudentAnswer("");
    }
  }, [currentIndex, answers]);

  const handleSubmit = () => {
    // Simple validation for demo purposes (in a real app, compare against a correct answer)
    const isCorrect = studentAnswer.trim().length > 0; // Placeholder logic
    saveAnswer(currentIndex, studentAnswer, isCorrect);
    setStudentAnswer("");
  };

  const handleNext = () => {
    handleSubmit();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    handleSubmit();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
            Answer One by One
          </h1>
          <p className="text-gray-600 text-body-md text-center">
            No questions available. Please add some questions first.
          </p>
          <div className="mt-6 text-center">
            <Link
              to="/student-dashboard" // Updated to point to student dashboard
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

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Answer One by One
        </h1>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="text-body-md text-gray-600 text-center mb-2">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Display */}
        <div className="mb-6">
          <h2 className="text-subheading font-semibold text-gray-800 mb-2">
            {currentQuestion.title}
          </h2>
          <div className="text-body-md text-gray-800">
            <QuestionPreview content={currentQuestion.content} />
          </div>
          <div className="mt-2 text-body-sm text-gray-600">
            <span className="font-medium">Category:</span>{" "}
            {currentQuestion.category} |{" "}
            <span className="font-medium">Difficulty:</span>{" "}
            {currentQuestion.difficulty}
          </div>
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <label className="block text-body-md font-semibold text-gray-700 mb-2">
            Your Answer
          </label>
          <input
            type="text"
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
            placeholder="Enter your answer"
            aria-label="Student Answer"
          />
          {answers[currentIndex] && (
            <p className="mt-2 text-body-md text-gray-600">
              Saved Answer: {answers[currentIndex].answer} (
              {answers[currentIndex].isCorrect ? "Correct" : "Incorrect"})
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-3 rounded-lg shadow-md transition-all duration-200 font-semibold text-body-md ${
              currentIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50"
            }`}
            aria-label="Previous Question"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-body-md"
            aria-label="Next Question"
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>

        {/* Back to Dashboard Link */}
        <div className="mt-6 text-center">
          <Link
            to="/student-dashboard" // Updated to point to student dashboard
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

export default AnswerOneByOne;
