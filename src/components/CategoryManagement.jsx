// src/components/CategoryManagement.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoryContext.jsx";

function CategoryManagement() {
  const { categories, addCategory, editCategory, deleteCategory } =
    useCategories();

  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name.");
      return;
    }
    const success = addCategory(newCategory.trim());
    if (success) {
      setNewCategory("");
    }
  };

  const handleEditStart = (category) => {
    setEditIndex(category);
    setEditValue(category);
  };

  const handleEditSave = () => {
    if (!editValue.trim()) {
      alert("Please enter a category name.");
      return;
    }
    const success = editCategory(editIndex, editValue.trim());
    if (success) {
      setEditIndex(null);
      setEditValue("");
    }
  };

  const handleDelete = (category) => {
    deleteCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Category Management
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

        {/* Add Category Form */}
        <div className="mb-8">
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Add New Category
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
              placeholder="Enter new category"
              aria-label="New Category Name"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-body-md"
              aria-label="Add Category"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Category List */}
        <div>
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Existing Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-gray-600 text-body-md">
              No categories available.
            </p>
          ) : (
            <ul className="space-y-3">
              {categories.map((category) => (
                <li
                  key={category}
                  className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  {editIndex === category ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 transition-all duration-200 text-body-md"
                        aria-label={`Edit category ${category}`}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditSave}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label={`Save edit for category ${category}`}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditIndex(null)}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label={`Cancel edit for category ${category}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-800 text-body-md">
                        {category}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStart(category)}
                          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label={`Edit category ${category}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label={`Delete category ${category}`}
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

export default CategoryManagement;
