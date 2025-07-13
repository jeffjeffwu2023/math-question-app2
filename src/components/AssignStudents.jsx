import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, assignStudents } from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";

const AssignStudents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    tutorId: "",
    studentIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tutorRes, studentRes] = await Promise.all([
          getUsers({ role: "tutor", disabled: false }),
          getUsers({ role: "student" }),
        ]);
        setTutors(tutorRes.data);
        setStudents(studentRes.data);
      } catch (error) {
        showToast(t("failed_to_fetch_data"), "error");
        console.error("Error fetching data:", error);
        setError(t("failed_to_fetch_data"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "studentIds") {
      const options = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, [name]: options }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.tutorId) {
      setError(t("tutor_required"));
      return false;
    }
    if (formData.studentIds.length === 0) {
      setError(t("at_least_one_student_required"));
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    showToast(t("assigning_students"), "info"); // Loading toast
    try {
      await assignStudents(formData);
      showToast(t("students_assigned_successfully"), "success");
      navigate("/admin/tutor-management");
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || t("failed_to_assign_students");
      showToast(errorMsg, "error");
      console.error("Error assigning students:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-0 pr-4 pb-4 pl-4 sm:pr-6 sm:pb-6 sm:pl-6 md:pr-8 md:pb-8 md:pl-8">
      <Navigation />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/admin/tutor-management"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
          >
            {t("back_to_tutor_management")}
          </Link>
          <h2 className="text-heading-lg">{t("assign_students")}</h2>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-body-md">{t("select_tutor")}</label>
            <select
              name="tutorId"
              value={formData.tutorId}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">{t("choose_tutor")}</option>
              {tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.name} ({tutor.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-body-md">{t("select_students")}</label>
            <select
              name="studentIds"
              multiple
              value={formData.studentIds}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            disabled={loading}
          >
            {loading ? t("assigning") : t("assign_students")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignStudents;
