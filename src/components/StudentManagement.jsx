// src/components/StudentManagement.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useStudents } from "../context/StudentContext.jsx";
import { showToast } from "../utils/toast.js"; // Import toast utility

function StudentManagement() {
  const { students, addStudent, editStudent, deleteStudent } = useStudents();

  const [newStudent, setNewStudent] = useState({ id: "", name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [editStudentData, setEditStudentData] = useState({
    id: "",
    name: "",
    email: "",
  });

  const handleAddStudent = () => {
    if (
      !newStudent.id.trim() ||
      !newStudent.name.trim() ||
      !newStudent.email.trim()
    ) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    const success = addStudent(newStudent);
    if (success) {
      setNewStudent({ id: "", name: "", email: "" });
      showToast("Student added successfully!", "success");
    } else {
      showToast("Student ID already exists!", "error");
    }
  };

  const handleEditStart = (student) => {
    setEditId(student.id);
    setEditStudentData(student);
  };

  const handleEditSave = () => {
    if (
      !editStudentData.id.trim() ||
      !editStudentData.name.trim() ||
      !editStudentData.email.trim()
    ) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    const success = editStudent(editId, editStudentData);
    if (success) {
      setEditId(null);
      setEditStudentData({ id: "", name: "", email: "" });
      showToast("Student updated successfully!", "success");
    } else {
      showToast("Student ID already exists!", "error");
    }
  };

  const handleDelete = (id) => {
    deleteStudent(id);
    showToast("Student deleted successfully!", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Student Management
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

        {/* Add Student Form */}
        <div className="mb-8">
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Add New Student
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={newStudent.id}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, id: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
                placeholder="Enter student ID"
                aria-label="Student ID"
              />
            </div>
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
                placeholder="Enter student name"
                aria-label="Student Name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-200 text-body-md"
                placeholder="Enter student email"
                aria-label="Student Email"
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleAddStudent}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 font-semibold text-body-md"
              aria-label="Add Student"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Students List */}
        <div>
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Existing Students
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-600 text-body-md">No students available.</p>
          ) : (
            <ul className="space-y-4">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  {editId === student.id ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          Student ID
                        </label>
                        <input
                          type="text"
                          value={editStudentData.id}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              id: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 transition-all duration-200 text-body-md"
                          aria-label="Edit Student ID"
                        />
                      </div>
                      <div>
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editStudentData.name}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 transition-all duration-200 text-body-md"
                          aria-label="Edit Student Name"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editStudentData.email}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 transition-all duration-200 text-body-md"
                          aria-label="Edit Student Email"
                        />
                      </div>
                      <div className="sm:col-span-2 flex justify-center gap-3 mt-4">
                        <button
                          onClick={handleEditSave}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label="Save Student Edit"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label="Cancel Edit"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">ID:</span> {student.id}
                        </p>
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">Name:</span>{" "}
                          {student.name}
                        </p>
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">Email:</span>{" "}
                          {student.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStart(student)}
                          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label={`Edit student ${student.name}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                          aria-label={`Delete student ${student.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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

export default StudentManagement;
