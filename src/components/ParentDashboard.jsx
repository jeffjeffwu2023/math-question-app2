// src/components/ParentDashboard.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ParentDashboard = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("parent_dashboard")}
        </h1>
        {isLoading ? (
          <p className="text-center text-gray-500">{t("loading")}</p>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">{t("welcome_parent_dashboard")}</p>
            <div className="text-center">
              <p className="text-gray-500 italic">
                {t("dashboard_under_construction")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
