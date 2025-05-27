// frontend/src/components/UserManagement.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useClassrooms } from "../context/ClassroomContext";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";

function UserManagement() {
  const { users, addUser, editUser, deleteUser, loading } = useUsers();
  const { classrooms } = useClassrooms();
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "student",
    password: "",
    language: "en",
    studentIds: [],
    classroomIds: [],
    tutorId: "",
  });
  const [editId, setEditId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    id: "",
    name: "",
    email: "",
    role: "student",
    language: "en",
    studentIds: [],
    classroomIds: [],
    tutorId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tutors = users.filter((u) => u.role === "tutor");
  const students = users.filter((u) => u.role === "student");

  const handleAddUser = async () => {
    if (
      !newUser.id.trim() ||
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim()
    ) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await addUser(newUser);
      if (success) {
        setNewUser({
          id: "",
          name: "",
          email: "",
          role: "student",
          password: "",
          language: "en",
          studentIds: [],
          classroomIds: [],
          tutorId: "",
        });
        showToast(
          `${
            newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)
          } added successfully!`,
          "success"
        );
      } else {
        showToast("User ID already exists or invalid role.", "error");
      }
    } catch (error) {
      showToast("Failed to add user.", "error");
      console.error("Error adding user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStart = (user) => {
    setEditId(user.id);
    setEditUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      language: user.language || "en",
      studentIds: user.studentIds || [],
      classroomIds: user.classroomIds || [],
      tutorId: user.tutorId || "",
    });
  };

  const handleEditSave = async () => {
    if (
      !editUserData.id.trim() ||
      !editUserData.name.trim() ||
      !editUserData.email.trim()
    ) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await editUser(editId, editUserData);
      if (success) {
        setEditId(null);
        setEditUserData({
          id: "",
          name: "",
          email: "",
          role: "student",
          language: "en",
          studentIds: [],
          classroomIds: [],
          tutorId: "",
        });
        showToast("User updated successfully!", "success");
      } else {
        showToast("Failed to update user.", "error");
      }
    } catch (error) {
      showToast("Failed to update user.", "error");
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteUser(id);
      showToast("User deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete user.", "error");
      console.error("Error deleting user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          User Management
        </h1>
        <div className="mb-6">
          <Link
            to="/admin-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <div className="mb-8">
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Add New User
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={newUser.id}
                onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                placeholder="Enter user ID"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                placeholder="Enter name"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                placeholder="Enter email"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                placeholder="Enter password"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                disabled={isSubmitting}
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="tutor">Tutor</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-body-md font-semibold text-gray-700 mb-2">
                Language
              </label>
              <select
                value={newUser.language}
                onChange={(e) =>
                  setNewUser({ ...newUser, language: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                disabled={isSubmitting}
              >
                <option value="en">English</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            {newUser.role === "student" && (
              <>
                <div>
                  <label className="block text-body-md font-semibold text-gray-700 mb-2">
                    Classroom
                  </label>
                  <select
                    value={newUser.classroomIds[0] || ""}
                    onChange={(e) =>
                      setNewUser({ ...newUser, classroomIds: [e.target.value] })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a classroom</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-body-md font-semibold text-gray-700 mb-2">
                    Tutor
                  </label>
                  <select
                    value={newUser.tutorId}
                    onChange={(e) =>
                      setNewUser({ ...newUser, tutorId: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a tutor</option>
                    {tutors.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.name} ({tutor.id})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {newUser.role === "tutor" && (
              <div>
                <label className="block text-body-md font-semibold text-gray-700 mb-2">
                  Students
                </label>
                <select
                  multiple
                  value={newUser.studentIds}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      studentIds: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                  disabled={isSubmitting}
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.id})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {["tutor", "manager"].includes(newUser.role) && (
              <div>
                <label className="block text-body-md font-semibold text-gray-700 mb-2">
                  Classrooms
                </label>
                <select
                  multiple
                  value={newUser.classroomIds}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      classroomIds: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                  disabled={isSubmitting}
                >
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleAddUser}
              className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-body-md ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <ClipLoader color="#fff" size={20} className="mr-2" />
                  Adding...
                </span>
              ) : (
                "Add User"
              )}
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Existing Users
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader color="#2563eb" size={50} />
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-600 text-body-md">No users available.</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  {editId === user.id ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          User ID
                        </label>
                        <input
                          type="text"
                          value={editUserData.id}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              id: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editUserData.name}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editUserData.email}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          Role
                        </label>
                        <select
                          value={editUserData.role}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              role: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                          disabled={isSubmitting}
                        >
                          <option value="student">Student</option>
                          <option value="parent">Parent</option>
                          <option value="tutor">Tutor</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-body-md font-semibold text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={editUserData.language}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                          disabled={isSubmitting}
                        >
                          <option value="en">English</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      {editUserData.role === "student" && (
                        <>
                          <div>
                            <label className="block text-body-md font-semibold text-gray-700 mb-2">
                              Classroom
                            </label>
                            <select
                              value={editUserData.classroomIds[0] || ""}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  classroomIds: [e.target.value],
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                              disabled={isSubmitting}
                            >
                              <option value="">Select a classroom</option>
                              {classrooms.map((classroom) => (
                                <option key={classroom.id} value={classroom.id}>
                                  {classroom.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-body-md font-semibold text-gray-700 mb-2">
                              Tutor
                            </label>
                            <select
                              value={editUserData.tutorId}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  tutorId: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                              disabled={isSubmitting}
                            >
                              <option value="">Select a tutor</option>
                              {tutors.map((tutor) => (
                                <option key={tutor.id} value={tutor.id}>
                                  {tutor.name} ({tutor.id})
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                      {editUserData.role === "tutor" && (
                        <div>
                          <label className="block text-body-md font-semibold text-gray-700 mb-2">
                            Students
                          </label>
                          <select
                            multiple
                            value={editUserData.studentIds}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                studentIds: Array.from(
                                  e.target.selectedOptions,
                                  (option) => option.value
                                ),
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                            disabled={isSubmitting}
                          >
                            {students.map((student) => (
                              <option key={student.id} value={student.id}>
                                {student.name} ({student.id})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {["tutor", "manager"].includes(editUserData.role) && (
                        <div>
                          <label className="block text-body-md font-semibold text-gray-700 mb-2">
                            Classrooms
                          </label>
                          <select
                            multiple
                            value={editUserData.classroomIds}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                classroomIds: Array.from(
                                  e.target.selectedOptions,
                                  (option) => option.value
                                ),
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                            disabled={isSubmitting}
                          >
                            {classrooms.map((classroom) => (
                              <option key={classroom.id} value={classroom.id}>
                                {classroom.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="sm:col-span-2 flex justify-center gap-3 mt-4">
                        <button
                          onClick={handleEditSave}
                          className={`px-4 py-2 bg-green-600 text-white rounded-lg text-body-md ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-green-700"
                          }`}
                          disabled={isSubmitting}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className={`px-4 py-2 bg-gray-600 text-white rounded-lg text-body-md ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-700"
                          }`}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">ID:</span> {user.id}
                        </p>
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">Name:</span> {user.name}
                        </p>
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">Email:</span>{" "}
                          {user.email}
                        </p>
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">Role:</span>{" "}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </p>
                        <p className="text-body-md text-gray-800">
                          <span className="font-medium">Language:</span>{" "}
                          {user.language === "en" ? "English" : "Chinese"}
                        </p>
                        {user.role === "student" && (
                          <>
                            <p className="text-body-md text-gray-800">
                              <span className="font-medium">Parent ID:</span>{" "}
                              {user.parentId || "None"}
                            </p>
                            <p className="text-body-md text-gray-800">
                              <span className="font-medium">Tutor:</span>{" "}
                              {tutors.find((t) => t.id === user.tutorId)
                                ?.name || "None"}
                            </p>
                            <p className="text-body-md text-gray-800">
                              <span className="font-medium">Classroom:</span>{" "}
                              {classrooms.find((c) =>
                                user.classroomIds?.includes(c.id)
                              )?.name || "None"}
                            </p>
                          </>
                        )}
                        {["tutor", "parent"].includes(user.role) && (
                          <p className="text-body-md text-gray-800">
                            <span className="font-medium">Students:</span>{" "}
                            {user.studentIds
                              ?.map(
                                (id) =>
                                  students.find((s) => s.id === id)?.name || id
                              )
                              .join(", ") || "None"}
                          </p>
                        )}
                        {["tutor", "manager"].includes(user.role) && (
                          <p className="text-body-md text-gray-800">
                            <span className="font-medium">Classrooms:</span>{" "}
                            {user.classroomIds
                              ?.map(
                                (id) =>
                                  classrooms.find((c) => c.id === id)?.name ||
                                  id
                              )
                              .join(", ") || "None"}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStart(user)}
                          className={`px-3 py-2 bg-indigo-600 text-white rounded-lg text-body-md ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-indigo-700"
                          }`}
                          disabled={isSubmitting}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className={`px-3 py-2 bg-red-600 text-white rounded-lg text-body-md ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-red-700"
                          }`}
                          disabled={isSubmitting}
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

export default UserManagement;
