import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../services/api";
import KnowledgePointSelector from "./KnowledgePointSelector";
import QuestionEditor from "./QuestionEditor";
import QuestionPreview from "./QuestionPreview";
import { useTranslation } from "react-i18next";
import { useKnowledgePoints } from "../context/KnowledgePointContext";
import "mathlive";

function AddQuestion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    knowledgePoints,
    loading: kpLoading,
    error: kpError,
  } = useKnowledgePoints();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    difficulty: "easy",
    knowledgePointIds: [],
    correctAnswer: "",
    questionType: "numerical",
  });
  const [testAnswer, setTestAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const correctAnswerMathFieldRef = useRef(null);
  const testAnswerMathFieldRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);
    if (!token) {
      toast.error(t("Please log in to add a question"));
      navigate("/login");
    }
  }, [navigate, t]);

  useEffect(() => {
    console.log("Current knowledgePointIds:", formData.knowledgePointIds);
  }, [formData.knowledgePointIds]);

  useEffect(() => {
    console.log("Current content:", formData.content);
  }, [formData.content]);

  useEffect(() => {
    const correctMathField = correctAnswerMathFieldRef.current;
    const testMathField = testAnswerMathFieldRef.current;

    if (correctMathField && testMathField) {
      const handleCorrectInput = () => {
        const latex = correctMathField.value;
        console.log("Correct Answer input:", latex);
        setFormData((prev) => ({ ...prev, correctAnswer: latex }));
      };
      correctMathField.addEventListener("input", handleCorrectInput);

      const handleTestInput = () => {
        const latex = testMathField.value;
        console.log("Test Answer input:", latex);
        setTestAnswer(latex);
        setAnswerFeedback(""); // Clear feedback when typing
      };
      testMathField.addEventListener("input", handleTestInput);

      return () => {
        correctMathField.removeEventListener("input", handleCorrectInput);
        testMathField.removeEventListener("input", handleTestInput);
      };
    } else {
      console.log("MathLive refs not initialized yet:", {
        correctMathField: !!correctMathField,
        testMathField: !!testMathField,
      });
    }
  }, []);

  useEffect(() => {
    console.log("Test Answer field disabled state:", verifyLoading);
    if (testAnswerMathFieldRef.current) {
      const testMathField = testAnswerMathFieldRef.current;
      testMathField.disabled = verifyLoading;
      if (!verifyLoading) {
        testMathField.focus();
      }
    }
  }, [verifyLoading]);

  const verifyAnswer = async (testValue) => {
    if (!formData.correctAnswer || !testValue) {
      setAnswerFeedback("");
      setVerifyLoading(false);
      return;
    }

    setVerifyLoading(true);
    console.log("Starting verification, verifyLoading:", true);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Verification timed out")), 5000)
    );

    try {
      const config = {
        headers: API.defaults.headers.common,
      };
      console.log("API request config:", config);

      const responsePromise = API.post("/api/verify-answer", {
        questionType: formData.questionType,
        correctAnswer: formData.correctAnswer,
        testAnswer: testValue,
      }, config);

      const response = await Promise.race([responsePromise, timeoutPromise]);

      console.log("Verification response:", response.data);

      setAnswerFeedback(
        response.data.isCorrect
          ? t("Answer is correct")
          : t("Answer is incorrect") +
              `: Expected ${response.data.expected}, got ${response.data.simplifiedTest}`
      );
    } catch (err) {
      console.error("Answer verification error:", err);
      setAnswerFeedback(
        t("Verification failed: ") + (err.response?.data?.detail || err.message)
      );
    } finally {
      setVerifyLoading(false);
      console.log("Finished verification, verifyLoading:", false);
    }
  };

  const handleVerifyAnswer = () => {
    if (!formData.correctAnswer) {
      setAnswerFeedback(t("Please enter a Correct Answer first"));
      return;
    }
    if (!testAnswer) {
      setAnswerFeedback(t("Please enter a Test Answer"));
      return;
    }
    verifyAnswer(testAnswer);
  };

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
    console.log(
      "Selected knowledge points:",
      ids
        .map((id) => knowledgePoints.find((kp) => kp.id === id))
        .filter((kp) => kp)
    );
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

  const selectedKnowledgePoints = formData.knowledgePointIds
    .map((id) => knowledgePoints.find((kp) => kp.id === id))
    .filter((kp) => kp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      {console.log("Rendering AddQuestion with formData:", formData)}
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
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
              <p className="mt-2 text-sm text-gray-600">
                {t("Loading knowledge points...")}
              </p>
            ) : selectedKnowledgePoints.length > 0 ? (
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  {t("Selected")}: {selectedKnowledgePoints.length}{" "}
                  {t("knowledge points")}
                </p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {selectedKnowledgePoints.map((kp) => (
                    <li key={kp.id}>
                      {kp.grade}: {kp.strand} - {kp.topic} - {kp.skill} -{" "}
                      {kp.subKnowledgePoint}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                {t("No knowledge points selected")}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Correct Answer")}{" "}
              <span className="text-gray-500">{t("(optional)")}</span>
            </label>
            <math-field
              ref={correctAnswerMathFieldRef}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md"
              style={{ minHeight: "50px", minWidth: "100%" }}
            >
              {formData.correctAnswer}
            </math-field>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Test Answer")}
            </label>
            <math-field
              ref={testAnswerMathFieldRef}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md"
              style={{ minHeight: "50px", minWidth: "100%" }}
              disabled={verifyLoading}
            >
              {testAnswer}
            </math-field>
            <button
              type="button"
              onClick={handleVerifyAnswer}
              disabled={verifyLoading || !formData.correctAnswer}
              className="mt-2 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {verifyLoading ? t("Verifying...") : t("Verify Answer")}
            </button>
            {answerFeedback && (
              <p
                className={`mt-2 text-sm ${
                  answerFeedback.includes("correct") ? "text-green-600" : "text-red-600"
                }`}
              >
                {answerFeedback}
              </p>
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
