import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, addUser, updateUser, softDeleteUser, assignParent, assignStudent } from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import Navigation from "./Navigation";
import { ClipLoader } from "react-spinners";

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [oppositeRoleUsers, setOppositeRoleUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("student");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [assignIds, setAssignIds] = useState([]);
  const [currentIds, setCurrentIds] = useState([]);
  const [showConfirmAssignModal, setShowConfirmAssignModal] = useState(false);
  const [assignSearchQuery, setAssignSearchQuery] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers({ 
          role: activeTab, 
          disabled: false, 
          search: searchQuery, 
          page: currentPage, 
          limit: itemsPerPage 
        });
        setUsers(response.data.users || []);
        setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
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
  }, [t, activeTab, searchQuery, currentPage]);

  useEffect(() => {
    const fetchOppositeRoleUsers = async () => {
      const oppositeRole = activeTab === "student" ? "parent" : "student";
      setLoading(true);
      try {
        const response = await getUsers({ role: oppositeRole, disabled: false });
        setOppositeRoleUsers(response.data.users || response.data);
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
      setShowAddModal(false);
      const response = await getUsers({ 
        role: activeTab, 
        disabled: false, 
        search: searchQuery, 
        page: currentPage, 
        limit: itemsPerPage 
      });
      setUsers(response.data.users || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
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
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await softDeleteUser(deleteUserId);
      showToast(t("user_deleted_successfully"), "success");
      const response = await getUsers({ 
        role: activeTab, 
        disabled: false, 
        search: searchQuery, 
        page: currentPage, 
        limit: itemsPerPage 
      });
      setUsers(response.data.users || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
      setShowDeleteModal(false);
      setDeleteUserId(null);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t("failed_to_delete_user");
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = async (userId) => {
    setAssignUserId(userId);
    const user = users.find((u) => u.id === userId);
    if (!user) {
      showToast(t("user_not_found"), "error");
      return;
    }
    const ids = activeTab === "student" ? user.parentIds || [] : user.studentIds || [];
    setAssignIds(ids);
    setCurrentIds(ids); // Store current assignments
    setAssignSearchQuery("");
    setShowAssignModal(true);
  };

  const handleAssign = () => {
    if (!assignUserId) {
      showToast(t("select_users_to_assign"), "error");
      return;
    }
    setShowAssignModal(false);
    setShowConfirmAssignModal(true);
  };

  const handleClearAssignments = () => {
    setAssignIds([]);
    setShowAssignModal(false);
    setShowConfirmAssignModal(true);
  };

  const handleCheckboxChange = (userId) => {
    setAssignIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleToggleAll = (selectAll) => {
    if (selectAll) {
      const filteredIds = oppositeRoleUsers
        .filter((user) =>
          `${user.name} ${user.email}`
            .toLowerCase()
            .includes(assignSearchQuery.toLowerCase())
        )
        .map((user) => user.id);
      setAssignIds(filteredIds);
    } else {
      setAssignIds([]);
    }
  };

  const confirmAssign = async () => {
    setLoading(true);
    try {
      const user = users.find((u) => u.id === assignUserId);
      if (!user) {
        showToast(t("user_not_found"), "error");
        setShowConfirmAssignModal(false);
        setAssignUserId(null);
        setAssignIds([]);
        setCurrentIds([]);
        return;
      }
      const oppositeRole = activeTab === "student" ? "parent" : "student";
      const validAssignIds = assignIds.filter((id) => 
        oppositeRoleUsers.find((u) => u.id === id)
      );

      const addedIds = validAssignIds.filter((id) => !currentIds.includes(id));
      const removedIds = currentIds.filter((id) => !validAssignIds.includes(id));

      if (validAssignIds.length === 0 && assignIds.length > 0) {
        showToast(t("no_valid_users_selected"), "error");
        setShowConfirmAssignModal(false);
        setAssignUserId(null);
        setAssignIds([]);
        setCurrentIds([]);
        return;
      }

      if (activeTab === "student") {
        await assignParent({
          studentId: assignUserId,
          parentIds: validAssignIds,
        });
      } else {
        await assignStudent({
          parentId: assignUserId,
          studentIds: validAssignIds,
        });
      }

      if (validAssignIds.length === 0) {
        showToast(t("assignments_cleared_successfully"), "success");
      } else if (addedIds.length > 0 && removedIds.length > 0) {
        showToast(t("assignments_updated_successfully"), "success");
      } else if (addedIds.length > 0) {
        showToast(t("assignment_added_successfully"), "success");
      } else if (removedIds.length > 0) {
        showToast(t("assignment_removed_successfully"), "success");
      }

      const response = await getUsers({ 
        role: activeTab, 
        disabled: false, 
        search: searchQuery, 
        page: currentPage, 
        limit: itemsPerPage 
      });
      setUsers(response.data.users || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
      const oppositeResponse = await getUsers({ role: oppositeRole, disabled: false });
      setOppositeRoleUsers(oppositeResponse.data.users || oppositeResponse.data);
      setShowConfirmAssignModal(false);
      setAssignUserId(null);
      setAssignIds([]);
      setCurrentIds([]);
      setAssignSearchQuery("");
    } catch (error) {
      const errorMsg = error.response?.status === 401
        ? t("authentication_failed")
        : error.response?.status === 404
        ? t("user_not_found")
        : error.response?.data?.detail || t("failed_to_assign_users");
      showToast(errorMsg, "error");
      console.error("Error assigning/unassigning users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAssignSearch = (e) => {
    setAssignSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
              {activeTab === "student" ? t("assigned_parents") : t("assigned_students")}
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
                {(activeTab === "student" ? user.parentIds : user.studentIds)?.map((id) => {
                  const relatedUser = oppositeRoleUsers.find((u) => u.id === id);
                  return relatedUser ? relatedUser.name : id;
                }).join(", ") || t("none")}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleOpenAssignModal(user.id)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                >
                  {t("assign")}
                </button>
                <button
                  onClick={() => {
                    setDeleteUserId(user.id);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  {t("delete")}
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
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-4">
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
              <div className="flex justify-between items-center mb-4">
                <div className="flex border-b">
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
                      setCurrentPage(1);
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
                      setCurrentPage(1);
                    }}
                  >
                    {t("parents")}
                  </button>
                </div>
                <button
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
                    setShowAddModal(true);
                  }}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                >
                  {t(`add_${activeTab}`)}
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={t("search_by_name_or_email")}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {renderUserList()}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                  >
                    {t("previous")}
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    {t("page")} {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                  >
                    {t("next")}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">
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
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    disabled={loading}
                  >
                    {editingId ? t(`update_${activeTab}`) : t(`add_${activeTab}`)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">
                {t(`assign_${activeTab === "student" ? "parents" : "students"}`)}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t("check_to_assign_uncheck_to_unassign", { role: activeTab === "student" ? t("parents") : t("students") })}
              </p>
              {oppositeRoleUsers.length === 0 ? (
                <p className="text-red-600 mb-4">
                  {t(`no_${activeTab === "student" ? "parents" : "students"}_available`)}
                </p>
              ) : (
                <>
                  <input
                    type="text"
                    value={assignSearchQuery}
                    onChange={handleAssignSearch}
                    placeholder={t("search_by_name_or_email")}
                    className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={() => handleToggleAll(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      {t("select_all")}
                    </button>
                    <button
                      onClick={() => handleToggleAll(false)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      {t("deselect_all")}
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto mb-4">
                    {oppositeRoleUsers
                      .filter((user) =>
                        `${user.name} ${user.email}`
                          .toLowerCase()
                          .includes(assignSearchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <label key={user.id} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={assignIds.includes(user.id)}
                            onChange={() => handleCheckboxChange(user.id)}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={assignIds.includes(user.id) ? "font-semibold" : ""}>
                            {user.name} ({user.email})
                            {assignIds.includes(user.id) ? ` ${t("currently_assigned")}` : ""}
                          </span>
                        </label>
                      ))}
                  </div>
                  <button
                    onClick={handleClearAssignments}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4"
                  >
                    {t("clear_all_assignments")}
                  </button>
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
        {showConfirmAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">{t("confirm_assignment")}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t("confirm_assign_users", {
                  count: assignIds.length,
                  role: activeTab === "student" ? t("parents") : t("students"),
                })}
              </p>
              {assignIds.length > 0 ? (
                <>
                  <p className="text-sm font-semibold mb-2">{t("assigned_users")}:</p>
                  <ul className="list-disc list-inside mb-4 text-sm">
                    {assignIds.map((id) => {
                      const user = oppositeRoleUsers.find((u) => u.id === id);
                      return <li key={id}>{user?.name || id}</li>;
                    })}
                  </ul>
                  {currentIds.filter((id) => !assignIds.includes(id)).length > 0 && (
                    <>
                      <p className="text-sm font-semibold mb-2">{t("unassigned_users")}:</p>
                      <ul className="list-disc list-inside mb-4 text-sm text-red-600">
                        {currentIds.filter((id) => !assignIds.includes(id)).map((id) => {
                          const user = oppositeRoleUsers.find((u) => u.id === id);
                          return <li key={id}>{user?.name || id}</li>;
                        })}
                      </ul>
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-red-600 mb-4">{t("clear_assignments_warning")}</p>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmAssignModal(false)}
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
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">{t("confirm_delete")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("are_you_sure_delete_user")}</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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