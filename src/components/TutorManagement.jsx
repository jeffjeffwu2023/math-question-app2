import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, softDeleteUser, assignStudents } from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";
import { ClipLoader } from "react-spinners";

const TutorManagement = () => {
  const { t } = useTranslation();
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmAssignModal, setShowConfirmAssignModal] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [assignStudentIds, setAssignStudentIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignSearchQuery, setAssignSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tutorRes = await getUsers({ 
          role: "tutor", 
          disabled: false, 
          search: searchQuery, 
          page: currentPage, 
          limit: itemsPerPage 
        });
        setTutors(tutorRes.data.users || []);
        setTotalPages(Math.ceil((tutorRes.data.total || 0) / itemsPerPage));
        setError(null);
      } catch (error) {
        showToast(t("failed_to_fetch_data"), "error");
        console.error("Error fetching tutors:", error);
        setError(t("failed_to_fetch_data"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t, searchQuery, currentPage]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentRes = await getUsers({ role: "student", disabled: false });
        setStudents(studentRes.data.users || studentRes.data);
      } catch (error) {
        showToast(t("failed_to_fetch_students"), "error");
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [t]);

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

  const handleRemoveTutor = (tutorId) => {
    setSelectedTutorId(tutorId);
    setShowDeleteModal(true);
  };

  const confirmRemoveTutor = async () => {
    if (selectedTutorId) {
      setLoading(true);
      try {
        await softDeleteUser(selectedTutorId);
        showToast(t("tutor_removed_successfully"), "success");
        const tutorRes = await getUsers({ 
          role: "tutor", 
          disabled: false, 
          search: searchQuery, 
          page: currentPage, 
          limit: itemsPerPage 
        });
        setTutors(tutorRes.data.users || []);
        setTotalPages(Math.ceil((tutorRes.data.total || 0) / itemsPerPage));
        setShowDeleteModal(false);
        setSelectedTutorId(null);
      } catch (error) {
        showToast(t("failed_to_remove_tutor"), "error");
        console.error("Error removing tutor:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenAssignModal = (tutorId) => {
    setSelectedTutorId(tutorId);
    const tutor = tutors.find((t) => t.id === tutorId);
    if (!tutor) {
      showToast(t("tutor_not_found"), "error");
      return;
    }
    setAssignStudentIds(tutor.studentIds || []);
    setAssignSearchQuery("");
    setShowAssignModal(true);
  };

  const handleAssign = () => {
    if (!selectedTutorId) {
      showToast(t("select_tutor_to_assign"), "error");
      return;
    }
    setShowAssignModal(false);
    setShowConfirmAssignModal(true);
  };

  const confirmAssign = async () => {
    setLoading(true);
    try {
      const tutor = tutors.find((t) => t.id === selectedTutorId);
      if (!tutor) {
        showToast(t("tutor_not_found"), "error");
        setShowConfirmAssignModal(false);
        setSelectedTutorId(null);
        setAssignStudentIds([]);
        return;
      }

      const validStudentIds = assignStudentIds.filter((id) =>
        students.find((s) => s.id === id)
      );
      if (validStudentIds.length === 0 && assignStudentIds.length > 0) {
        showToast(t("no_valid_students_selected"), "error");
        setShowConfirmAssignModal(false);
        setSelectedTutorId(null);
        setAssignStudentIds([]);
        return;
      }

      await assignStudents({
        tutorId: selectedTutorId,
        studentIds: validStudentIds,
      });

      showToast(t("students_assigned_successfully"), "success");
      const tutorRes = await getUsers({ 
        role: "tutor", 
        disabled: false, 
        search: searchQuery, 
        page: currentPage, 
        limit: itemsPerPage 
      });
      setTutors(tutorRes.data.users || []);
      setTotalPages(Math.ceil((tutorRes.data.total || 0) / itemsPerPage));
      const studentRes = await getUsers({ role: "student", disabled: false });
      setStudents(studentRes.data.users || studentRes.data);
      setShowConfirmAssignModal(false);
      setSelectedTutorId(null);
      setAssignStudentIds([]);
      setAssignSearchQuery("");
    } catch (error) {
      const errorMsg = error.response?.status === 401
        ? t("authentication_failed")
        : error.response?.status === 404
        ? t("tutor_not_found")
        : error.response?.data?.detail || t("failed_to_assign_students");
      showToast(errorMsg, "error");
      console.error("Error assigning students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setAssignStudentIds(options);
  };

  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-heading-lg">{t("tutor_management")}</h2>
          <Link
            to="/admin/tutor-management/add"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
          >
            {t("add_tutor")}
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t("search_by_name_or_email")}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-8">
              <h3 className="text-heading-md mb-4">{t("tutor_list")}</h3>
              {tutors.length === 0 ? (
                <p>{t("no_tutors_found")}</p>
              ) : (
                <table className="w-full border-collapse shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">{t("name")}</th>
                      <th className="border p-2 text-left">{t("email")}</th>
                      <th className="border p-2 text-left">{t("assigned_students")}</th>
                      <th className="border p-2 text-left">{t("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutors.map((tutor) => (
                      <tr key={tutor.id} className="hover:bg-gray-50">
                        <td className="border p-2">{tutor.name}</td>
                        <td className="border p-2">{tutor.email}</td>
                        <td className="border p-2">{tutor.studentIds?.length || 0}</td>
                        <td className="border p-2 space-x-2">
                          <button
                            onClick={() => handleOpenAssignModal(tutor.id)}
                            className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                          >
                            {t("assign")}
                          </button>
                          <button
                            onClick={() => handleRemoveTutor(tutor.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            {t("remove")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">{t("assign_students")}</h3>
              {students.length === 0 ? (
                <p className="text-red-600 mb-4">{t("no_students_available")}</p>
              ) : (
                <>
                  <input
                    type="text"
                    value={assignSearchQuery}
                    onChange={handleAssignSearch}
                    placeholder={t("search_by_name_or_email")}
                    className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    multiple
                    value={assignStudentIds}
                    onChange={handleMultiSelect}
                    className="border rounded p-2 w-full mb-4 max-h-40 overflow-y-auto"
                  >
                    {students
                      .filter((student) =>
                        `${student.name} ${student.email}`
                          .toLowerCase()
                          .includes(assignSearchQuery.toLowerCase())
                      )
                      .map((student) => (
                        <option
                          key={student.id}
                          value={student.id}
                          className={assignStudentIds.includes(student.id) ? "bg-indigo-100" : ""}
                        >
                          {student.name} ({student.email})
                          {assignStudentIds.includes(student.id) && " (Assigned)"}
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
                  disabled={loading || students.length === 0}
                >
                  {t("next")}
                </button>
              </div>
            </div>
          </div>
        )}
        {showConfirmAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">{t("confirm_assignment")}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t("confirm_assign_users", {
                  count: assignStudentIds.length,
                  role: t("students"),
                })}
              </p>
              {assignStudentIds.length > 0 ? (
                <ul className="list-disc list-inside mb-4 text-sm">
                  {assignStudentIds.map((id) => {
                    const student = students.find((s) => s.id === id);
                    return <li key={id}>{student?.name || id}</li>;
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 mb-4">{t("clear_assignments")}</p>
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
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">{t("confirm_remove")}</h3>
              <p>{t("are_you_sure_remove_tutor")}</p>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={confirmRemoveTutor}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={loading}
                >
                  {t("confirm_soft_delete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorManagement;