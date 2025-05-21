// src/App.jsx
import { useState } from "react";
import QuestionEditor from "./components/QuestionEditor.jsx";
import QuestionPreview from "./components/QuestionPreview.jsx";

function App() {
  const [questionContent, setQuestionContent] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const handleSave = () => {
    console.log("handleSave triggered");
    console.log("questionTitle:", questionTitle);
    console.log("questionContent:", questionContent);
    console.log("difficulty:", difficulty);

    if (!questionTitle.trim() || !questionContent.trim()) {
      console.log("Validation failed: Title or content is empty");
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Math Question App 2 - Admin
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Question Title
          </label>
          <input
            type="text"
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter question title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Question Content
          </label>
          <QuestionEditor onContentChange={setQuestionContent} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Preview
          </label>
          <QuestionPreview content={questionContent} />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Save Question
        </button>
      </div>
    </div>
  );
}

export default App;
