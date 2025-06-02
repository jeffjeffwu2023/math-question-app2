import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getKnowledgePoints,
  getQuestions,
} from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";

const CourseManagement = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    grade: "",
    knowledgePointIds: [],
    questionIds: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseRes, kpRes, qRes] = await Promise.all([
          getCourses(),
          getKnowledgePoints({ version: "2025.01" }),
          getQuestions(),
        ]);
        setCourses(courseRes.data);
        setKnowledgePoints(kpRes.data);
        setQuestions(qRes.data);
      } catch (error) {
        showToast(t("failed_to_fetch_data"), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e, field) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, [field]: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCourse(editingId, formData);
        showToast(t("course_updated_successfully"), "success");
      } else {
        await createCourse(formData);
        showToast(t("course_added_successfully"), "success");
      }
      setFormData({
        name: "",
        description: "",
        grade: "",
        knowledgePointIds: [],
        questionIds: [],
      });
      setEditingId(null);
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      showToast(t("failed_to_save_course"), "error");
    }
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      description: course.description,
      grade: course.grade,
      knowledgePointIds: course.knowledgePointIds.map((kp) => kp.id),
      questionIds: course.questionIds.map((q) => q.id),
    });
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      showToast(t("course_deleted_successfully"), "success");
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      showToast(t("failed_to_delete_course"), "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <Link
          to="/admin-dashboard"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md mb-4 inline-block"
        >
          {t("back_to_dashboard")}
        </Link>
        <h2 className="text-heading-lg mb-6">{t("course_management")}</h2>
        {loading ? (
          <p>{t("loading")}</p>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-heading-md mb-4">
                {editingId ? t("edit_course") : t("add_course")}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-body-md">
                    {t("description")}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-body-md">{t("grade")}</label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-body-md">
                    {t("knowledge_points")}
                  </label>
                  <select
                    multiple
                    value={formData.knowledgePointIds}
                    onChange={(e) => handleMultiSelect(e, "knowledgePointIds")}
                    className="border rounded p-2 w-full"
                  >
                    {knowledgePoints.map((kp) => (
                      <option key={kp.id} value={kp.id}>
                        {kp.subKnowledgePoint}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-body-md">{t("questions")}</label>
                  <select
                    multiple
                    value={formData.questionIds}
                    onChange={(e) => handleMultiSelect(e, "questionIds")}
                    className="border rounded p-2 w-full"
                  >
                    {questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded"
                >
                  {editingId ? t("update_course") : t("add_course")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        name: "",
                        description: "",
                        grade: "",
                        knowledgePointIds: [],
                        questionIds: [],
                      });
                      setEditingId(null);
                    }}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    {t("cancel")}
                  </button>
                )}
              </form>
            </div>
            <div>
              <h3 className="text-heading-md mb-4">{t("course_list")}</h3>
              {courses.length === 0 ? (
                <p>{t("no_courses_found")}</p>
              ) : (
                <ul className="space-y-2">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className="border p-4 rounded flex justify-between items-center"
                    >
                      <div>
                        <h4 className="text-heading-sm">{course.name}</h4>
                        <p>{course.description}</p>
                        <p>
                          {t("grade")}: {course.grade}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        >
                          {t("edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          {t("delete")}
                        </button>
                      </div>
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

export default CourseManagement;
