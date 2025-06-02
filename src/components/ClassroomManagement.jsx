import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getUsers,
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} from "../services/api";
import { showToast } from "../utils/toast";
import { v4 as uuidv4 } from "uuid";

const ClassroomManagement = () => {
  const { t } = useTranslation();
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    studentIds: [],
    tutorId: null,
  });
  const [error, setError] = useState(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const response = await getClassrooms();
        setClassrooms(response.data);
      } catch (error) {
        showToast(t("failed_to_fetch_classrooms"), "error");
        console.error("Error fetching classrooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassrooms();
  }, [t]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedClassroomId) return;
      setLoading(true);
      try {
        const [studentResponse, tutorResponse] = await Promise.all([
          getUsers({ role: "student", classroomIds: selectedClassroomId }),
          getUsers({ role: "tutor" }),
        ]);
        setStudents(studentResponse.data);
        setTutors(tutorResponse.data);
      } catch (error) {
        showToast(t("failed_to_fetch_users"), "error");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [selectedClassroomId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClassroom = async (e) => {
    e.preventDefault();
    const classroomData = {
      id: uuidv4(),
      name: formData.name,
      studentIds: formData.studentIds || [],
      tutorId: formData.tutorId || null,
    };
    try {
      await createClassroom(classroomData);
      showToast(t("classroom_added_successfully"), "success");
      setFormData({ id: "", name: "", studentIds: [], tutorId: null });
      const response = await getClassrooms();
      setClassrooms(response.data);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || t("failed_to_add_classroom");
      setError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  const handleDeleteClassroom = async (classroomId) => {
    try {
      await deleteClassroom(classroomId);
      showToast(t("classroom_deleted_successfully"), "success");
      const response = await getClassrooms();
      setClassrooms(response.data);
      if (selectedClassroomId === classroomId) {
        setSelectedClassroomId(null);
        setStudents([]);
        setTutors([]);
      }
    } catch (error) {
      showToast(t("failed_to_delete_classroom"), "error");
      console.error("Error deleting classroom:", error);
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
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("classroom_management")}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {loading ? (
          <p className="text-center">{t("loading")}</p>
        ) : (
          <div className="mb-8">
            <h2 className="text-subheading font-semibold text-gray-800 mb-4">
              {t("classrooms")}
            </h2>
            {classrooms.length === 0 ? (
              <p className="text-gray-600 text-body-md">{t("no_classrooms")}</p>
            ) : (
              <ul className="space-y-4">
                {classrooms.map((classroom) => (
                  <li
                    key={classroom.id}
                    className="p-4 bg-gray-50 rounded-lg border"
                  >
                    <p className="text-body-md text-gray-800">
                      <span className="font-medium">{t("name")}:</span>{" "}
                      {classroom.name}
                    </p>
                    <button
                      onClick={() => setSelectedClassroomId(classroom.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md mr-2"
                    >
                      {t("view_details")}
                    </button>
                    <button
                      onClick={() => handleDeleteClassroom(classroom.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-body-md"
                    >
                      {t("delete")}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {selectedClassroomId && (
          <div className="mb-8">
            <h2 className="text-subheading font-semibold text-gray-800 mb-4">
              {t("classroom_details")}
            </h2>
            <div>
              <p className="text-body-md text-gray-800 mb-2">
                <span className="font-medium">{t("students")}:</span>
              </p>
              {students.length === 0 ? (
                <p className="text-gray-600 text-body-md">{t("no_students")}</p>
              ) : (
                <ul className="space-y-2">
                  {students.map((student) => (
                    <li key={student.id} className="text-body-md text-gray-800">
                      {student.name} ({student.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4">
              <p className="text-body-md text-gray-800 mb-2">
                <span className="font-medium">{t("tutors")}:</span>
              </p>
              {tutors.length === 0 ? (
                <p className="text-gray-600 text-body-md">{t("no_tutors")}</p>
              ) : (
                <ul className="space-y-2">
                  {tutors.map((tutor) => (
                    <li key={tutor.id} className="text-body-md text-gray-800">
                      {tutor.name} ({tutor.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        <form onSubmit={handleAddClassroom} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("classroom_name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md"
              placeholder={t("enter_classroom_name")}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {t("add_classroom")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClassroomManagement;
