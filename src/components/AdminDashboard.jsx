import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import KnowledgePointManagement from "./KnowledgePointManagement";
import ClassroomManagement from "./ClassroomManagement";
import QuestionEditor from "./QuestionEditor";
import TutorManagement from "./TutorManagement";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login_admin")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-0 pr-4 pb-4 pl-4 sm:pr-6 sm:pb-6 sm:pl-6 md:pr-8 md:pb-8 md:pl-8">
      <Navigation />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-8">
          {t("welcome_admin", { name: user.name })}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/add-question"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("add_question")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("create_new_questions")}
            </p>
          </Link>
          <Link
            to="/admin/user-management"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("user_management")}
            </h2>
            <p className="text-body-md text-gray-600">{t("manage_users")}</p>
          </Link>
          <Link
            to="/admin/tutor-management"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("tutor_management")}
            </h2>
            <p className="text-body-md text-gray-600">{t("manage_tutors")}</p>
          </Link>
          <Link
            to="/admin/knowledge-points"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("knowledge_point_management")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("manage_knowledge_points")}
            </p>
          </Link>
          <Link
            to="/admin/classroom-management"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("classroom_management")}
            </h2>
            <p className="text-body-md text-gray-600">
              {t("manage_classrooms")}
            </p>
          </Link>
          <Link
            to="/admin/courses"
            className="p-6 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <h2 className="text-subheading font-semibold text-indigo-700">
              {t("course_management")}
            </h2>
            <p className="text-body-md text-gray-600">{t("manage_courses")}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
