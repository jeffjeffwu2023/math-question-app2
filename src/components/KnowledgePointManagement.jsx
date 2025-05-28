// src/components/KnowledgePointManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const KnowledgePointManagement = () => {
  const { t } = useTranslation();
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    grade: "",
    strand: "",
    topic: "",
    skill: "",
    subKnowledgePoint: "",
    version: "2025.01",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchKnowledgePoints = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/knowledge-points",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: { version: formData.version },
          }
        );
        setKnowledgePoints(response.data);
        setError(null);
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || t("failed_to_fetch_knowledge_points");
        setError(errorMsg);
        toast.error(errorMsg, { toastId: "fetch-kp-error" });
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledgePoints();
  }, [formData.version, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { grade, strand, topic, skill, subKnowledgePoint } = formData;
    if (!grade || !strand || !topic || !skill || !subKnowledgePoint) {
      toast.error(t("all_fields_required"), { toastId: "kp-form-error" });
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        const response = await axios.put(
          `http://localhost:8000/api/knowledge-points/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setKnowledgePoints((prev) =>
          prev.map((kp) => (kp._id === editId ? response.data : kp))
        );
        toast.success(t("knowledge_point_updated"), {
          toastId: "update-kp-success",
        });
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/knowledge-points",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setKnowledgePoints((prev) => [...prev, response.data]);
        toast.success(t("knowledge_point_added"), {
          toastId: "add-kp-success",
        });
      }
      setFormData({
        grade: "",
        strand: "",
        topic: "",
        skill: "",
        subKnowledgePoint: "",
        version: "2025.01",
      });
      setEditId(null);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || t("failed_to_save_knowledge_point");
      setError(errorMsg);
      toast.error(errorMsg, { toastId: "save-kp-error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (kp) => {
    setFormData({
      grade: kp.grade,
      strand: kp.strand,
      topic: kp.topic,
      skill: kp.skill,
      subKnowledgePoint: kp.subKnowledgePoint,
      version: kp.version,
    });
    setEditId(kp._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirm_delete_knowledge_point"))) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/knowledge-points/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setKnowledgePoints((prev) => prev.filter((kp) => kp._id !== id));
      toast.success(t("knowledge_point_deleted"), {
        toastId: "delete-kp-success",
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || t("failed_to_delete_knowledge_point");
      setError(errorMsg);
      toast.error(errorMsg, { toastId: "delete-kp-error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-6">
          {t("manage_knowledge_points")}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-6">
          <Link
            to="/admin-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
          >
            ← {t("back_to_dashboard")}
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="grade"
                className="block text-body-md font-medium text-gray-700"
              >
                {t("grade")}
              </label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t("enter_grade")}
              />
            </div>
            <div>
              <label
                htmlFor="strand"
                className="block text-body-md font-medium text-gray-700"
              >
                {t("strand")}
              </label>
              <input
                type="text"
                id="strand"
                name="strand"
                value={formData.strand}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t("enter_strand")}
              />
            </div>
            <div>
              <label
                htmlFor="topic"
                className="block text-body-md font-medium text-gray-700"
              >
                {t("topic")}
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t("enter_topic")}
              />
            </div>
            <div>
              <label
                htmlFor="skill"
                className="block text-body-md font-medium text-gray-700"
              >
                {t("skill")}
              </label>
              <input
                type="text"
                id="skill"
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t("enter_skill")}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="subKnowledgePoint"
                className="block text-body-md font-medium text-gray-700"
              >
                {t("sub_knowledge_point")}
              </label>
              <input
                type="text"
                id="subKnowledgePoint"
                name="subKnowledgePoint"
                value={formData.subKnowledgePoint}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t("enter_sub_knowledge_point")}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <ClipLoader color="#fff" size={20} className="mr-2" />
                {t("saving")}
              </span>
            ) : editId ? (
              t("update_knowledge_point")
            ) : (
              t("add_knowledge_point")
            )}
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-body-md font-medium text-gray-700">
                  {t("grade")}
                </th>
                <th className="px-4 py-2 text-left text-body-md font-medium text-gray-700">
                  {t("strand")}
                </th>
                <th className="px-4 py-2 text-left text-body-md font-medium text-gray-700">
                  {t("topic")}
                </th>
                <th className="px-4 py-2 text-left text-body-md font-medium text-gray-700">
                  {t("skill")}
                </th>
                <th className="px-4 py-2 text-left text-body-md font-medium text-gray-700">
                  {t("sub_knowledge_point")}
                </th>
                <th className="px-4 py-2 text-left text-body-md font-medium text-gray-700">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    <ClipLoader color="#2563eb" size={30} />
                  </td>
                </tr>
              ) : knowledgePoints.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    {t("no_knowledge_points_found")}
                  </td>
                </tr>
              ) : (
                knowledgePoints.map((kp) => (
                  <tr key={kp._id} className="border-t">
                    <td className="px-4 py-2">{kp.grade}</td>
                    <td className="px-4 py-2">{kp.strand}</td>
                    <td className="px-4 py-2">{kp.topic}</td>
                    <td className="px-4 py-2">{kp.skill}</td>
                    <td className="px-4 py-2">{kp.subKnowledgePoint}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(kp)}
                        className="text-indigo-600 hover:text-indigo-800 mr-4"
                      >
                        {t("edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(kp._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePointManagement;
