// src/App.jsx
import { Link } from "react-router-dom";

function App() {
  const handleCategoryManagementClick = () => {
    console.log("Category Management link clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Math Question Dashboard
        </h1>

        {/* Navigation Links */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link
            to="/add-question"
            className="block p-4 bg-indigo-50 rounded-lg shadow-sm hover:bg-indigo-100 transition-colors duration-200 text-center"
            aria-label="Add a New Question"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              Add Question
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Create a new math question
            </p>
          </Link>
          <Link
            to="/list-questions"
            className="block p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 text-center"
            aria-label="List All Questions"
          >
            <h2 className="text-subheading font-semibold text-gray-700">
              List Questions
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              View all saved questions
            </p>
          </Link>
          <Link
            to="/category-management"
            className="relative block p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 text-center cursor-pointer"
            aria-label="Manage Categories"
            onClick={handleCategoryManagementClick}
          >
            <h2 className="text-subheading font-semibold text-gray-700">
              Category Management
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Add or edit question categories
            </p>
          </Link>
          <Link
            to="/answer-one-by-one"
            className="block p-4 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 transition-colors duration-200 text-center"
            aria-label="Answer One by One"
          >
            <h2 className="text-subheading font-semibold text-blue-700">
              Answer One by One
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Practice questions sequentially
            </p>
          </Link>
          <Link
            to="/answer-homework/1" // Example assignment ID, adjust as needed
            className="block p-4 bg-green-50 rounded-lg shadow-sm hover:bg-green-100 transition-colors duration-200 text-center"
            aria-label="Answer Homework"
          >
            <h2 className="text-subheading font-semibold text-green-700">
              Answer Homework
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Complete assigned homework questions
            </p>
          </Link>
          <Link
            to="/assign-homework"
            className="block p-4 bg-purple-50 rounded-lg shadow-sm hover:bg-purple-100 transition-colors duration-200 text-center"
            aria-label="Assign Homework"
          >
            <h2 className="text-subheading font-semibold text-purple-700">
              Assign Homework
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Assign questions to students
            </p>
          </Link>
          <Link
            to="/student-management"
            className="block p-4 bg-orange-50 rounded-lg shadow-sm hover:bg-orange-100 transition-colors duration-200 text-center"
            aria-label="Manage Students"
          >
            <h2 className="text-subheading font-semibold text-orange-700">
              Student Management
            </h2>
            <p className="text-body-md text-gray-600 mt-1">
              Add or edit students
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
