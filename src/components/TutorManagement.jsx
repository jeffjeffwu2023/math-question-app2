import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, addUser, assignStudents } from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import Navigation from "./Navigation";

const TutorManagement = () => {
  const { t } = useTranslation();
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "tutor",
    language: "en",
    studentIds: [],
    classroomIds: [],
  });
  const [assignmentData, setAssignmentData] = useState({
    tutorId: "",
    studentIds: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tutorRes, studentRes] = await Promise.all([
          getUsers({ role: "tutor" }),
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    if (name === "studentIds") {
      const options = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setAssignmentData((prev) => ({ ...prev, studentIds: options }));
    } else {
      setAssignmentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTutor = async (e) => {
    e.preventDefault();
    const tutorData = {
      id: uuidv4(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "tutor",
      language: formData.language,
      studentIds: [],
      classroomIds: formData.classroomIds || [],
    };
    try {
      await addUser(tutorData);
      showToast(t("tutor_added_successfully"), "success");
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "tutor",
        language: "en",
        studentIds: [],
        classroomIds: [],
      });
      const response = await getUsers({ role: "tutor" });
      setTutors(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t("failed_to_add_tutor");
      showToast(errorMsg, "error");
    }
  };

  const handleAssignStudents = async (e) => {
    e.preventDefault();
    if (!assignmentData.tutorId || assignmentData.studentIds.length === 0) {
      showToast(t("select_tutor_and_students"), "error");
      return;
    }
    try {
      await assignStudents(assignmentData);
      showToast(t("students_assigned_successfully"), "success");
      setAssignmentData({ tutorId: "", studentIds: [] });
      // Refresh tutors to reflect updated studentIds
      const response = await getUsers({ role: "tutor" });
      setTutors(response.data);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || t("failed_to_assign_students");
      showToast(errorMsg, "error");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-0 pr-4 pb-4 pl-4 sm:pr-6 sm:pb-6 sm:pl-6 md:pr-8 md:pb-8 md:pl-8">
      <Navigation />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-8">
        <h2 className="text-heading-lg mb-6">{t("tutor_management")}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-heading-md mb-4">{t("add_tutor")}</h3>
              <form onSubmit={handleAddTutor} className="space-y-4">
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
                  {t("add_tutor")}
                </button>
              </form>
            </div>
            <div className="mb-8">
              <h3 className="text-heading-md mb-4">{t("assign_students")}</h3>
              <form onSubmit={handleAssignStudents} className="space-y-4">
                <div>
                  <label className="block text-body-md">
                    {t("select_tutor")}
                  </label>
                  <select
                    name="tutorId"
                    value={assignmentData.tutorId}
                    onChange={handleAssignmentChange}
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
                  <label className="block text-body-md">
                    {t("select_students")}
                  </label>
                  <select
                    name="studentIds"
                    multiple
                    value={assignmentData.studentIds}
                    onChange={handleAssignmentChange}
                    className="border rounded p-2 w-full"
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
                  className="bg-indigo-500 text-white px-4 py-2 rounded"
                >
                  {t("assign_students")}
                </button>
              </form>
            </div>
            <div>
              <h3 className="text-heading-md mb-4">{t("tutor_list")}</h3>
              {tutors.length === 0 ? (
                <p>{t("no_tutors_found")}</p>
              ) : (
                <ul className="space-y-2">
                  {tutors.map((tutor) => (
                    <li key={tutor.id} className="border p-4 rounded">
                      {tutor.name} ({tutor.email})
                      <p className="text-body-md text-gray-600">
                        {t("assigned_students")}:{" "}
                        {tutor.studentIds?.length || 0}
                      </p>
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

export default TutorManagement;
