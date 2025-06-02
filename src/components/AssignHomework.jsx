import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getUsersByTutor, getQuestions, createAssignment } from "../services/api";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";

const AssignHomework = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    studentIds: [], // Changed to array
    questionIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentRes, questionRes] = await Promise.all([
          getUsersByTutor(user.id),
          getQuestions(),
        ]);
        setStudents(studentRes.data);
        setQuestions(questionRes.data);
      } catch (error) {
        showToast(t("failed_to_fetch_data"), "error");
        console.error("Error fetching data:", error);
        setError(t("failed_to_fetch_data"));
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === "tutor") {
      fetchData();
    }
  }, [t, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "studentIds") {
      const options = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, studentIds: options }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, questionIds: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.studentIds.length === 0 || formData.questionIds.length === 0) {
      showToast(t("select_student_and_questions"), "error");
      return;
    }
    setLoading(true);
    try {
      await createAssignment({
        studentIds: formData.studentIds,
        questionIds: formData.questionIds,
      });
      showToast(t("assignment_created_successfully"), "success");
      setFormData({ studentIds: [], questionIds: [] });
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || t("failed_to_create_assignment");
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "tutor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login_tutor")}
          </p>
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <Link
          to="/tutor-dashboard"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md mb-4 inline-block"
        >
          {t("back_to_dashboard")}
        </Link>
        <h2 className="text-heading-lg mb-6">{t("assign_homework")}</h2>
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-body-md">
                  {t("select_students")}
                </label>
                <select
                  name="studentIds"
                  multiple
                  value={formData.studentIds}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-body-md">
                  {t("select_questions")}
                </label>
                <select
                  multiple
                  value={formData.questionIds}
                  onChange={handleMultiSelect}
                  className="border rounded p-2 w-full"
                >
                  {questions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {t("create_assignment")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignHomework;
