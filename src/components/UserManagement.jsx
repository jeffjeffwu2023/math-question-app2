import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, addUser, updateUser } from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import Navigation from "./Navigation";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [oppositeRoleUsers, setOppositeRoleUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "student",
    language: "en",
    tutorId: "",
    studentIds: [],
    parentIds: [],
    classroomIds: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState(null);
  const [assignIds, setAssignIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers({ role: activeTab, disabled: false });
        setUsers(response.data);
        setError(null);
      } catch (error) {
        showToast(t("failed_to_fetch_users"), "error");
        console.error("Error fetching users:", error);
        setError(t("failed_to_fetch_users"));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t, activeTab]);

  useEffect(() => {
    const fetchOppositeRoleUsers = async () => {
      const oppositeRole = activeTab === "student" ? "parent" : "student";
      setLoading(true);
      try {
        const response = await getUsers({
          role: oppositeRole,
          disabled: false,
        });
        setOppositeRoleUsers(response.data);
      } catch (error) {
        showToast(t("failed_to_fetch_users"), "error");
        console.error(`Error fetching ${oppositeRole}s:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchOppositeRoleUsers();
  }, [t, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setAssignIds(options);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t("name_required"));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("invalid_email"));
      return false;
    }
    if (!editingId && !formData.password) {
      setError(t("password_required"));
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setError(t("password_too_short"));
      return false;
    }
    setError(null);
    return true;
  };

  const handleAddOrUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const userData = {
      id: editingId || uuidv4(),
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      role: formData.role,
      language: formData.language,
      studentIds: formData.role === "parent" ? formData.studentIds : [],
      parentIds: formData.role === "student" ? formData.parentIds : [],
      classroomIds: formData.classroomIds || [],
      tutorId: formData.tutorId || undefined,
    };
    setLoading(true);
    try {
      if (editingId) {
        await updateUser(editingId, userData);
        showToast(t("user_updated_successfully"), "success");
      } else {
        await addUser(userData);
        showToast(t("user_added_successfully"), "success");
      }
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        role: activeTab,
        language: "en",
        tutorId: "",
        studentIds: [],
        parentIds: [],
        classroomIds: [],
      });
      setEditingId(null);
      const response = await getUsers({ role: activeTab, disabled: false });
      setUsers(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t("failed_to_add_user");
      showToast(errorMsg, "error");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      language: user.language || "en",
      tutorId: user.tutorId || "",
      studentIds: user.studentIds || [],
      parentIds: user.parentIds || [],
      classroomIds: user.classroomIds || [],
    });
    setEditingId(user.id);
  };

  const handleOpenAssignModal = async (userId) => {
    setAssignUserId(userId);
    const user = users.find((u) => u.id === userId);
    if (!user) {
      showToast(t("user_not_found"), "error");
      return;
    }
    setAssignIds(
      activeTab === "student" ? user.parentIds || [] : user.studentIds || []
    );
    setShowAssignModal(true);
  };

  const handleAssign = () => {
    if (!assignUserId) {
      showToast(t("select_users_to_assign"), "error");
      return;
    }
    setShowAssignModal(false);
    setShowConfirmModal(true);
  };

  const confirmAssign = async () => {
    setLoading(true);
    try {
      const user = users.find((u) => u.id === assignUserId);
      if (!user) {
        showToast(t("user_not_found"), "error");
        setShowConfirmModal(false);
        setAssignUserId(null);
        setAssignIds([]);
        return;
      }
      const oppositeRole = activeTab === "student" ? "parent" : "student";

      // Validate all assignIds exist
      const validAssignIds = [];
      for (const id of assignIds) {
        const exists = oppositeRoleUsers.find((u) => u.id === id);
        if (exists) {
          validAssignIds.push(id);
        } else {
          showToast(t("invalid_user_id", { id }), "error");
        }
      }

      if (validAssignIds.length === 0 && assignIds.length > 0) {
        showToast(t("no_valid_users_selected"), "error");
        setShowConfirmModal(false);
        setAssignUserId(null);
        setAssignIds([]);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showToast(t("authentication_failed"), "error");
        setShowConfirmModal(false);
        setAssignUserId(null);
        setAssignIds([]);
        return;
      }

      if (activeTab === "student") {
        await axios.post(
          "/api/users/assign-parent",
          {
            studentId: assignUserId,
            parentIds: validAssignIds,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "/api/users/assign-student",
          {
            parentId: assignUserId,
            studentIds: validAssignIds,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      showToast(t("assignment_updated_successfully"), "success");
      const response = await getUsers({ role: activeTab, disabled: false });
      setUsers(response.data);
      const oppositeResponse = await getUsers({
        role: oppositeRole,
        disabled: false,
      });
      setOppositeRoleUsers(oppositeResponse.data);
      setShowConfirmModal(false);
      setAssignUserId(null);
      setAssignIds([]);
    } catch (error) {
      const errorMsg =
        error.response?.status === 401
          ? t("authentication_failed")
          : error.response?.status === 404
          ? t("user_not_found")
          : error.response?.data?.detail || t("failed_to_assign_users");
      showToast(errorMsg, "error");
      console.error("Error assigning users:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserList = () => {
    return users.length === 0 ? (
      <p>{t(`no_${activeTab}s_found`)}</p>
    ) : (
      <table className="w-full border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">{t("name")}</th>
            <th className="border p-2 text-left">{t("email")}</th>
            <th className="border p-2 text-left">
              {activeTab === "student"
                ? t("assigned_parents")
                : t("assigned_students")}
            </th>
            <th className="border p-2 text-left">{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {(activeTab === "student"
                  ? user.parentIds?.length
                  : user.studentIds?.length) || 0}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleOpenAssignModal(user.id)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                >
                  {t("assign")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-4">
        <Link
          to="/admin-dashboard"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md mb-4 inline-block"
        >
          {t("back_to_dashboard")}
        </Link>
        <h2 className="text-heading-lg mb-6">{t("user_management")}</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex border-b mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "student"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab("student");
                    setFormData((prev) => ({ ...prev, role: "student" }));
                    setEditingId(null);
                  }}
                >
                  {t("students")}
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "parent"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab("parent");
                    setFormData((prev) => ({ ...prev, role: "parent" }));
                    setEditingId(null);
                  }}
                >
                  {t("parents")}
                </button>
              </div>
              <h3 className="text-heading-md mb-4">
                {editingId ? t(`edit_${activeTab}`) : t(`add_${activeTab}`)}
              </h3>
              <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
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
                    placeholder={editingId ? t("leave_blank_to_keep") : ""}
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
                {activeTab === "student" && (
                  <div>
                    <label className="block text-body-md">{t("tutor")}</label>
                    <input
                      type="text"
                      name="tutorId"
                      value={formData.tutorId}
                      onChange={handleChange}
                      className="border rounded p-2 w-full"
                      placeholder={t("enter_tutor_id_or_leave_blank")}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
                  disabled={loading}
                >
                  {editingId ? t(`update_${activeTab}`) : t(`add_${activeTab}`)}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        id: "",
                        name: "",
                        email: "",
                        password: "",
                        role: activeTab,
                        language: "en",
                        tutorId: "",
                        studentIds: [],
                        parentIds: [],
                        classroomIds: [],
                      });
                      setEditingId(null);
                    }}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    {t("cancel")}
                  </button>
                )}
              </form>
            </div>
            <div>
              <h3 className="text-heading-md mb-4">{t(`${activeTab}_list`)}</h3>
              {oppositeRoleUsers.length === 0 && (
                <p className="text-yellow-600 mb-4">
                  {t(
                    `no_${
                      activeTab === "student" ? "parents" : "students"
                    }_available`
                  )}
                </p>
              )}
              {renderUserList()}
            </div>
          </>
        )}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">
                {t(
                  `assign_${activeTab === "student" ? "parents" : "students"}`
                )}
              </h3>
              {oppositeRoleUsers.length === 0 ? (
                <p className="text-red-600 mb-4">
                  {t(
                    `no_${
                      activeTab === "student" ? "parents" : "students"
                    }_available`
                  )}
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    {t("select_users_to_assign")}:
                  </p>
                  <select
                    multiple
                    value={assignIds}
                    onChange={handleMultiSelect}
                    className="border rounded p-2 w-full mb-4 max-h-40 overflow-y-auto"
                  >
                    {oppositeRoleUsers.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                        className={
                          assignIds.includes(user.id) ? "bg-indigo-100" : ""
                        }
                      >
                        {user.name} ({user.email})
                        {assignIds.includes(user.id) && " (Assigned)"}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleAssign}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  disabled={loading || oppositeRoleUsers.length === 0}
                >
                  {t("next")}
                </button>
              </div>
            </div>
          </div>
        )}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">
                {t("confirm_assignment")}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t("confirm_assign_users", {
                  count: assignIds.length,
                  role: activeTab === "student" ? t("parents") : t("students"),
                })}
              </p>
              {assignIds.length > 0 ? (
                <ul className="list-disc list-inside mb-4 text-sm">
                  {assignIds.map((id) => {
                    const user = oppositeRoleUsers.find((u) => u.id === id);
                    return <li key={id}>{user?.name || id}</li>;
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 mb-4">
                  {t("clear_assignments")}
                </p>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={confirmAssign}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  disabled={loading}
                >
                  {t("confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
