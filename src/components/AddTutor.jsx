import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../services/api";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import Navigation from "./Navigation";

const AddTutor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: uuidv4(),
    name: "",
    email: "",
    password: "",
    role: "tutor",
    language: "en",
    studentIds: [],
    classroomIds: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      console.log("Name is required");
      setError(t("name_required"));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("invalid_email"));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t("password_too_short"));
      return false;
    }
    setError(null);
    console.log("Form data:", formData);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    showToast(t("adding_tutor"), "info"); // Loading toast
    try {
      await addUser(formData);
      showToast(t("tutor_added_successfully"), "success");
      navigate("/admin/tutor-management");
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t("failed_to_add_tutor");
      showToast(errorMsg, "error");
      console.error("Error adding tutor:", error);
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
          <h2 className="text-heading-lg">{t("add_tutor")}</h2>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
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
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            disabled={loading}
          >
            {loading ? t("adding") : t("add_tutor")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTutor;
