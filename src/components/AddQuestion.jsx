import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../services/api";
import { useNavigate } from "react-router-dom";
import KnowledgePointSelector from "./KnowledgePointSelector";
import QuestionEditor from "./QuestionEditor";
import QuestionPreview from "./QuestionPreview";
import { useTranslation } from "react-i18next";

function AddQuestion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    difficulty: "easy",
    knowledgePoints: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Current knowledgePoints:", formData.knowledgePoints);
  }, [formData.knowledgePoints]);

  useEffect(() => {
    console.log("Current content:", formData.content);
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    console.log("Content changed--:", content);
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleKnowledgePointsChange = (points) => {
    console.log("Updated knowledgePoints:", points);
    setFormData((prev) => ({ ...prev, knowledgePoints: points }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.content.trim()) {
        toast.error(t("please_fill_title_content"), {
          toastId: "missing-fields",
        });
        return;
      }
      if (formData.knowledgePoints.length === 0) {
        toast.error(t("please_select_knowledge_point"), {
          toastId: "no-knowledge-points",
        });
        return;
      }
      setLoading(true);
      try {
        await API.post("/api/questions/", formData);
        toast.success(t("question_added_successfully"), {
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
          {t("add_new_question")}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t("enter_question_title")}
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("content")}
            </label>
            <QuestionEditor onContentChange={handleContentChange} />
          </div>
          <div className="preview">
            <label className="block text-body-md font-medium text-gray-700">
              {t("preview")}
            </label>
            <QuestionPreview content={formData.content} />
          </div>
          <div>
            <label
              htmlFor="difficulty"
              className="block text-body-md font-medium text-gray-700"
            >
              {t("difficulty")}
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="easy">{t("easy")}</option>
              <option value="medium">{t("medium")}</option>
              <option value="hard">{t("hard")}</option>
            </select>
          </div>
          <div>
            <label className="block text-body-md font-medium text-gray-700">
              {t("knowledge_points")}
            </label>
            <KnowledgePointSelector
              selectedPoints={formData.knowledgePoints}
              setSelectedPoints={handleKnowledgePointsChange}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? t("adding") : t("add_question")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddQuestion;
