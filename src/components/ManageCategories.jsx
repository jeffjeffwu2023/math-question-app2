// src/components/ManageCategories.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

function ManageCategories() {
  const [categories, setCategories] = useState([
    "Algebra",
    "Geometry",
    "Calculus",
    "Trigonometry",
    "Statistics",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name.");
      return;
    }
    if (categories.includes(newCategory.trim())) {
      alert("Category already exists.");
      return;
    }
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };

  const handleEditCategory = (index) => {
    setEditIndex(index);
    setEditValue(categories[index]);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      alert("Please enter a category name.");
      return;
    }
    if (
      categories.includes(editValue.trim()) &&
      categories[editIndex] !== editValue.trim()
    ) {
      alert("Category already exists.");
      return;
    }
    const updatedCategories = [...categories];
    updatedCategories[editIndex] = editValue.trim();
    setCategories(updatedCategories);
    setEditIndex(null);
    setEditValue("");
  };

  const handleDeleteCategory = (index) => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${categories[index]}"?`
      )
    ) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Manage Categories
        </h1>

        {/* Back to Add Question Link */}
        <div className="mb-6">
          <Link
            to="/add-question"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            aria-label="Back to Add Question"
          >
            ← Back to Add Question
          </Link>
        </div>

        {/* Add Category */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add New Category
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200"
              placeholder="Enter new category"
              aria-label="New Category"
            />
            <button
              onClick={handleAddCategory}
              className="bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 font-semibold"
              aria-label="Add Category"
            >
              Add
            </button>
          </div>
        </div>

        {/* Category List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Existing Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories available.</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  {editIndex === index ? (
                    <div className="flex gap-3 w-full">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200"
                        aria-label="Edit Category"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-200"
                        aria-label="Save Edit"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditIndex(null)}
                        className="bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200"
                        aria-label="Cancel Edit"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-800">{category}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(index)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                          aria-label={`Edit ${category}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(index)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                          aria-label={`Delete ${category}`}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
