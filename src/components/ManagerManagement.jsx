// frontend/src/components/ManagerManagement.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useClassrooms } from "../context/ClassroomContext";
import {
  getUsers,
  assignManager,
  removeManager,
  getManagerAssignments,
} from "../services/api";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

function ManagerManagement() {
  const { t } = useTranslation();
  const { classrooms, loading: classroomsLoading } = useClassrooms();
  const [managers, setManagers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [managerAssignments, setManagerAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    userId: "",
    classroomId: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch managers on-demand
  useEffect(() => {
    const fetchManagers = async () => {
      setUsersLoading(true);
      try {
        const response = await getUsers({ role: "manager" });
        setManagers(response.data);
      } catch (error) {
        showToast(t("failed_to_fetch_users"), "error");
        console.error("Error fetching managers:", error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchManagers();
  }, [t]);

  // Fetch manager assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const response = await getManagerAssignments();
        setManagerAssignments(response.data);
      } catch (error) {
        showToast(t("failed_to_fetch_manager_assignments"), "error");
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [t]);

  const handleAssignManager = async () => {
    if (!newAssignment.userId || !newAssignment.classroomId) {
      showToast(t("select_manager_and_classroom"), "error");
      return;
    }
    setLoading(true);
    try {
      await assignManager(newAssignment);
      const response = await getManagerAssignments();
      setManagerAssignments(response.data);
      showToast(t("manager_assigned_successfully"), "success");
      setNewAssignment({ userId: "", classroomId: "" });
    } catch (error) {
      showToast(t("failed_to_assign_manager"), "error");
      console.error("Error assigning manager:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveManager = async (userId, classroomId) => {
    setLoading(true);
    try {
      await removeManager({ userId, classroomId });
      setManagerAssignments((prev) =>
        prev.filter(
          (a) => !(a.userId === userId && a.classroomId === classroomId)
        )
      );
      showToast(t("manager_removed_successfully"), "success");
    } catch (error) {
      showToast(t("failed_to_remove_manager"), "error");
      console.error("Error removing manager:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          {t("manager_management")}
        </h1>
        <div className="mb-6">
          <Link
            to="/admin-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
            aria-label={t("back_to_dashboard")}
          >
            ← {t("back_to_dashboard")}
          </Link>
        </div>
        {loading || classroomsLoading || usersLoading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-subheading font-semibold text-gray-800 mb-4">
                {t("assign_manager")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-body-md font-semibold text-gray-700 mb-2">
                    {t("manager")}
                  </label>
                  <select
                    value={newAssignment.userId}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        userId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                    aria-label={t("select_manager")}
                  >
                    <option value="">{t("select_manager")}</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} ({manager.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-body-md font-semibold text-gray-700 mb-2">
                    {t("classroom")}
                  </label>
                  <select
                    value={newAssignment.classroomId}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        classroomId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-body-md"
                    aria-label={t("select_classroom")}
                  >
                    <option value="">{t("select_classroom")}</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={handleAssignManager}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-body-md hover:bg-indigo-700"
                  aria-label={t("assign_manager")}
                >
                  {t("assign_manager")}
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-subheading font-semibold text-gray-800 mb-4">
                {t("assigned_managers")}
              </h2>
              {managerAssignments.length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  {t("no_managers_assigned")}
                </p>
              ) : (
                <ul className="space-y-4">
                  {managerAssignments.map((assignment) => (
                    <li
                      key={`${assignment.userId}-${assignment.classroomId}`}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">{t("manager")}:</span>{" "}
                        {managers.find((m) => m.id === assignment.userId)
                          ?.name || assignment.userId}
                      </p>
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">{t("classroom")}:</span>{" "}
                        {classrooms.find((c) => c.id === assignment.classroomId)
                          ?.name || "Unknown"}
                      </p>
                      <button
                        onClick={() =>
                          handleRemoveManager(
                            assignment.userId,
                            assignment.classroomId
                          )
                        }
                        className="mt-2 px-3 py-2 bg-red-600 text-white rounded-lg text-body-md hover:bg-red-700"
                        aria-label={t("remove_manager", {
                          managerId: assignment.userId,
                          classroomId: assignment.classroomId,
                        })}
                      >
                        {t("remove")}
                      </button>
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
}

export default ManagerManagement;
