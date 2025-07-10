import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    if (user?.role === "student") {
      return [
        { path: "/student-dashboard", label: t("dashboard") },
        { path: "/answer-one-by-one", label: t("answer_one_by_one") },
        { path: "/performance-analysis", label: t("performance_analysis") },
      ];
    } else if (user?.role === "tutor") {
      return [
        { path: "/tutor-dashboard", label: t("dashboard") },
        { path: "/assign-homework", label: t("assign_homework") },
      ];
    } else if (user?.role === "admin") {
      return [
        { path: "/admin/add-question", label: t("add_question") },
        { path: "/admin/user-management", label: t("user_management") },
        { path: "/admin/tutor-management", label: t("tutor_management") },
        {
          path: "/admin/knowledge-points",
          label: t("knowledge_point_management"),
        },
        {
          path: "/admin/classroom-management",
          label: t("classroom_management"),
        },
        { path: "/admin/courses", label: t("course_management") },
      ];
    }
    return []; // Default to empty for other roles or unauthenticated users
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-primary-gradient sticky top-0 z-50 shadow-md min-h-[64px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-1 h-[64px]">
        <div className="flex items-center space-x-4 h-full">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-gray-200 px-3 py-2 rounded-md text-sm font-medium min-w-[100px] ${
                location.pathname === item.path
                  ? "bg-accent bg-opacity-50"
                  : "hover:bg-white hover:bg-opacity-20"
              } transition-colors`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <button
            onClick={logout}
            className="text-gray-200 px-3 py-2 rounded-md text-sm font-medium min-w-[80px] hover:bg-accent hover:text-white transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
