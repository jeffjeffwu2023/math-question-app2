// src/App.jsx
import { useState } from "react";
import QuestionEditor from "./components/QuestionEditor.jsx";
import QuestionPreview from "./components/QuestionPreview.jsx";

function App() {
  const [questionContent, setQuestionContent] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const handleSave = () => {
    if (!questionTitle.trim() || !questionContent.trim()) {
      alert("Please enter a question title and content before saving.");
      return;
    }
    console.log("Saving question:", {
      title: questionTitle,
      content: questionContent,
      difficulty,
    });
    alert("Question saved (logged to console)!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Math Question Editor
        </h1>

        {/* Question Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Question Title
          </label>
          <input
            type="text"
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter question title"
            aria-label="Question Title"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-white transition-all duration-200"
            aria-label="Select Difficulty"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Question Content */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Question Content
          </label>
          <QuestionEditor onContentChange={setQuestionContent} />
        </div>

        {/* Preview */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preview
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[120px] shadow-sm">
            <QuestionPreview content={questionContent} />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-lg"
          aria-label="Save Question"
        >
          Save Question
        </button>
      </div>
    </div>
  );
}

export default App;
