import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    role: "student",
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
        const response = await getUsers({ role: "student" });
        setUsers(response.data);
      } catch (error) {
        showToast(t("failed_to_fetch_users"), "error");
        console.error("Error fetching users:", error);
        setError(t("failed_to_fetch_users"));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

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
      role: "student",
      language: formData.language,
      studentIds: [],
      classroomIds: formData.classroomIds || [],
      tutorId: formData.tutorId || null,
    };
    try {
      await addUser(userData);
      showToast(t("user_added_successfully"), "success");
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "student",
        language: "en",
        tutorId: null,
        studentIds: [],
        classroomIds: [],
      });
      const response = await getUsers({ role: "student" });
      setUsers(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t("failed_to_add_user");
      showToast(errorMsg, "error");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <Link
          to="/admin-dashboard"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md mb-4 inline-block"
        >
          {t("back_to_dashboard")}
        </Link>
        <h2 className="text-heading-lg mb-6">{t("student_management")}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-heading-md mb-4">{t("add_student")}</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-body-md">{t("name")}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-body-md">{t("email")}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-body-md">{t("password")}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-body-md">{t("language")}</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded"
                >
                  {t("add_student")}
                </button>
              </form>
            </div>
            <div>
              <h3 className="text-heading-md mb-4">{t("student_list")}</h3>
              {users.length === 0 ? (
                <p>{t("no_students_found")}</p>
              ) : (
                <ul className="space-y-2">
                  {users.map((user) => (
                    <li key={user.id} className="border p-4 rounded">
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
