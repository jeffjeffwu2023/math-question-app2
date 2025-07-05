import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/student-dashboard", label: t("dashboard") },
    { path: "/answer-one-by-one", label: t("answer_one_by_one") },
    { path: "/performance-analysis", label: t("performance_analysis") },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-teal-400 sticky top-0 z-50 shadow-md min-h-[64px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-100 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-accent bg-opacity-50"
                      : "hover:bg-white hover:bg-opacity-20"
                  } transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <button
              onClick={logout}
              className="text-gray-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-white transition-colors"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navigation;
