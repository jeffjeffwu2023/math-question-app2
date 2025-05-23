// src/components/AddQuestion.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoryContext.jsx";
import { useQuestions } from "../context/QuestionContext.jsx";
import { showToast } from "../utils/toast.js"; // Import toast utility
import QuestionEditor from "./QuestionEditor.jsx";
import QuestionPreview from "./QuestionPreview.jsx";

function AddQuestion() {
  const { categories } = useCategories();
  const { addQuestion } = useQuestions();

  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCategory, setQuestionCategory] = useState(
    categories[0] || "Algebra"
  );

  const handleSave = () => {
    if (!questionTitle.trim() || !questionContent.trim()) {
      showToast(
        "Please enter a question title and content before saving.",
        "error"
      );
      return;
    }
    const newQuestion = {
      title: questionTitle,
      content: questionContent,
      difficulty,
      category: questionCategory,
    };
    addQuestion(newQuestion);
    console.log("Saving question:", newQuestion);
    showToast("Question saved successfully!", "success");
    setQuestionTitle("");
    setQuestionContent("");
    setDifficulty("easy");
    setQuestionCategory(categories[0] || "Algebra");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Add Math Question
        </h1>

        {/* Back to Dashboard Link */}
        <div className="mb-6">
          <Link
            to="/admin-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Question Title */}
        <div className="mb-6">
          <label className="block text-body-md font-semibold text-gray-700 mb-2">
            Question Title
          </label>
          <input
            type="text"
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
            placeholder="Enter question title"
            aria-label="Question Title"
          />
        </div>

        {/* Question Category */}
        <div className="mb-6">
          <label className="block text-body-md font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={questionCategory}
            onChange={(e) => setQuestionCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-white transition-all duration-200 text-body-md"
            aria-label="Select Category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <label className="block text-body-md font-semibold text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-white transition-all duration-200 text-body-md"
            aria-label="Select Difficulty"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Question Content */}
        <div className="mb-6">
          <label className="block text-body-md font-semibold text-gray-700 mb-2">
            Question Content
          </label>
          <QuestionEditor onContentChange={setQuestionContent} />
        </div>

        {/* Preview */}
        <div className="mb-6">
          <label className="block text-body-md font-semibold text-gray-700 mb-2">
            Preview
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[120px] shadow-sm">
            <QuestionPreview content={questionContent} />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-subheading"
          aria-label="Save Question"
        >
          Save Question
        </button>
      </div>
    </div>
  );
}

export default AddQuestion;
