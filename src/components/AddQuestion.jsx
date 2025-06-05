
import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../services/api";
import { useNavigate } from "react-router-dom";
import KnowledgePointSelector from "./KnowledgePointSelector";
import QuestionEditor from "./QuestionEditor";
import QuestionPreview from "./QuestionPreview";
import { useTranslation } from "react-i18next";
import { useKnowledgePoints } from "../context/KnowledgePointContext";

function AddQuestion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { knowledgePoints, loading: kpLoading, error: kpError } = useKnowledgePoints();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    difficulty: "easy",
    knowledgePointIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Current knowledgePointIds:", formData.knowledgePointIds);
  }, [formData.knowledgePointIds]);

  useEffect(() => {
    console.log("Current content:", formData.content);
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    console.log("Content changed:", content);
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleKnowledgePointsChange = (ids) => {
    console.log("Updated knowledgePointIds:", ids);
    setFormData((prev) => ({ ...prev, knowledgePointIds: ids }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("Form submitted with formData:", formData);
      if (formData.knowledgePointIds.length === 0) {
        console.log("Triggering toast: No knowledge points selected");
        toast.error(t("please_select_knowledge_point"), {
          toastId: "no-knowledge-points",
        });
        return;
      }
      setLoading(true);
      try {
        await API.post("/api/questions", formData);
        toast.success(t("question_added"), {
          toastId: "add-question-success",
        });
        navigate("/admin-dashboard");
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || t("failed_to_add_question");
        setError(errorMsg);
        toast.error(errorMsg, { toastId: "add-question-error" });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, t]
  );

  // Get selected knowledge points details
  const selectedKnowledgePoints = formData.knowledgePointIds
    .map((id) => knowledgePoints.find((kp) => kp.id === id))
    .filter((kp) => kp); // Remove undefined entries

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
        <Link
          to="/admin-dashboard"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-4 inline-block"
        >
          {t("back_to_dashboard")}
        </Link>
        <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
          {t("add_new_question")}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {kpError && <p className="text-red-500 text-center mb-4">{kpError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              {t("title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t("enter_question_title")}
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              {t("content")}
            </label>
            <QuestionEditor onContentChange={handleContentChange} />
          </div>
          <div className="preview">
            <label className="block text-sm font-medium text-gray-700">
              {t("preview")}
            </label>
            <QuestionPreview content={formData.content} />
          </div>
          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700"
            >
              {t("difficulty")}
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="easy">{t("easy")}</option>
              <option value="medium">{t("medium")}</option>
              <option value="hard">{t("hard")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("knowledge_points")}
            </label>
            <KnowledgePointSelector
              selectedIds={formData.knowledgePointIds}
              onChange={handleKnowledgePointsChange}
            />
            {kpLoading ? (
              <p className="mt-2 text-sm text-gray-600">{t("Loading knowledge points...")}</p>
            ) : selectedKnowledgePoints.length > 0 ? (
              <div className="mt-2 text-sm text-gray-600">
                <p>{t("Selected")}: {selectedKnowledgePoints.length} {t("knowledge points")}</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {selectedKnowledgePoints.map((kp) => (
                    <li key={kp.id}>
                      {kp.grade}: {kp.strand} - {kp.topic} - {kp.skill} - {kp.subKnowledgePoint}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">{t("No knowledge points selected")}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? t("Adding...") : t("Add Question")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddQuestion;
