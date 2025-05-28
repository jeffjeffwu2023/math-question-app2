// src/components/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addUser } from "../services/api"; // Explicitly import addUser
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique IDs

const UserManagement = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    id: "", // Will be set using uuid
    name: "",
    email: "",
    password: "",
    role: "parent", // Default to parent
    language: "en",
    tutorId: null,
    studentIds: [],
    classroomIds: [],
  });
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]); // For displaying existing users (optional)

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const userData = {
      id: uuidv4(), // Generate unique ID
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      language: formData.language,
      studentIds: formData.studentIds || [],
      classroomIds: formData.classroomIds || [],
    };
    // Only include tutorId if it's a non-empty string (omit if null or empty)
    if (
      formData.role === "student" &&
      formData.tutorId &&
      formData.tutorId.trim() !== ""
    ) {
      userData.tutorId = formData.tutorId;
    }
    console.log("Attempting to add user with addUser:", userData);
    try {
      const response = await addUser(userData);
      console.log("User added successfully:", response.data);
      toast.success(t("user_added_successfully"), {
        toastId: "add-user-success",
      });
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "parent",
        language: "en",
        tutorId: null,
        studentIds: [],
        classroomIds: [],
      }); // Reset form
      // Optionally refresh user list
      // setUsers([...users, response.data]);
    } catch (error) {
      console.error("Error adding user:", error);
      console.error("Error response:", error.response?.data);
      // Handle FastAPI validation errors (detail might be an array or string)
      let errorMsg;
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          // Validation error array (e.g., [{type, loc, msg, input}])
          errorMsg = detail.map((err) => err.msg).join("; ");
        } else {
          // String error (e.g., "User ID already exists")
          errorMsg = detail;
        }
      } else {
        errorMsg = t("failed_to_add_user");
      }
      setError(errorMsg);
      toast.error(errorMsg, { toastId: "add-user-error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("user_management")}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleAddUser} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("enter_name")}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("enter_email")}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("enter_password")}
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("role")}
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="parent">{t("parent")}</option>
              <option value="student">{t("student")}</option>
              <option value="admin">{t("admin")}</option>
              <option value="tutor">{t("tutor")}</option>
              <option value="manager">{t("manager")}</option>
            </select>
          </div>
          {formData.role === "student" && (
            <div>
              <label
                htmlFor="tutorId"
                className="block text-body-md font-medium text-gray-700"
              >
                {t("tutor_id")}
              </label>
              <input
                type="text"
                id="tutorId"
                name="tutorId"
                value={formData.tutorId || ""}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t("enter_tutor_id")}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {t("add_user")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
