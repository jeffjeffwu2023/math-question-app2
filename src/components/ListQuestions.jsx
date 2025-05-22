// src/components/ListQuestions.jsx
import { Link } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext.jsx";
import QuestionPreview from "./QuestionPreview.jsx";

function ListQuestions() {
  const { questions } = useQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          List Math Questions
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
            Saved Questions
          </h2>
          {questions.length === 0 ? (
            <p className="text-gray-600 text-body-md">
              No questions available. Add some questions to see them here.
            </p>
          ) : (
            <ul className="space-y-4">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 text-body-md">
                      <div className="text-gray-800">
                        <QuestionPreview content={question.content} />
                      </div>
                      <div className="mt-2 text-body-sm text-gray-600">
                        <span className="font-medium">Category:</span>{" "}
                        {question.category} |{" "}
                        <span className="font-medium">Difficulty:</span>{" "}
                        {question.difficulty}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListQuestions;
