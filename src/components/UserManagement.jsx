// src/components/UserManagement.jsx
import { useEffect, useState } from "react";
import { getUsers, addUser } from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "parent",
    language: "en",
    tutorId: null,
    studentIds: [],
    classroomIds: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers({ role: "student" }); // Fetch students only
        setUsers(response.data);
      } catch (error) {
        showToast("Failed to fetch users.", "error");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const userData = {
      id: uuidv4(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      language: formData.language,
      studentIds: formData.studentIds || [],
      classroomIds: formData.classroomIds || [],
      ...(formData.role === "student" &&
        formData.tutorId && { tutorId: formData.tutorId }),
    };
    try {
      await addUser(userData);
      showToast(t("user_added_successfully"), "success");
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
      });
      // Refresh users
      const response = await getUsers({ role: "student" });
      setUsers(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t("failed_to_add_user");
      setError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("user_management")}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="text-subheading font-semibold text-gray-800 mb-4">
              Students
            </h2>
            {users.length === 0 ? (
              <p>No students found.</p>
            ) : (
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
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
              className="mt-1 w-full p-3 border border-gray-300 rounded-md"
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
              className="mt-1 w-full p-3 border border-gray-300 rounded-md"
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
              className="mt-1 w-full p-3 border border-gray-300 rounded-md"
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
              className="mt-1 w-full p-3 border border-gray-300 rounded-md"
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
                className="mt-1 w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md"
          >
            {t("add_user")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
