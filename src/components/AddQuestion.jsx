// AddQuestion.jsx
import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API, generateQuestion, addQuestion } from "../services/api";
import KnowledgePointSelector from "./KnowledgePointSelector";
import QuestionEditor from "./QuestionEditor";
import QuestionPreview from "./QuestionPreview";
import { useTranslation } from "react-i18next";
import { useKnowledgePoints } from "../context/KnowledgePointContext";
import { useAuth } from "../context/AuthContext";
import "mathlive";

// Utility function to format numbers with fixed precision
const formatNumber = (value) => {
  try {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toFixed(10).replace(/\.?0+$/, "");
  } catch {
    return value;
  }
};

// Function to wrap LaTeX strings with <math-field> tags, centering single-line math expressions
const wrapLatexWithMathField = (segments) => {
  return segments
    .map((segment) => {
      if (segment.type === "latex") {
        return `<math-field data-latex="${segment.value}">${segment.value}</math-field>`;
      }else if (segment.type == "newline") {
        return `<p>`;
      }else{
        return segment.value;
      }
    })
    .join("");
};

// Function to parse HTML content back to segments (simplified)
const parseContentToSegments = (htmlContent) => {
  console.log("htmlContent:", htmlContent)

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const segments = [];
  console.log("tempDiv.innerHTML:", tempDiv.innerHTML);
  console.log(tempDiv.childNodes)
  tempDiv.childNodes.forEach((node) => {
    console.log("node.name/type/value:", node.nodeName, node.nodeType, node.nodeValue)
    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "P") {
        segments.push({ value: "", type: "newline", original_latex: null });
        console.log("node.textContent:", node.textContent);

        const text = node.textContent.trim();
        if (text)
          segments.push({ value: text, type: "text", original_latex: null });

      }else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text)
        segments.push({ value: text, type: "text", original_latex: null });
    } else if (node.nodeName === "MATH-FIELD") {
      const value = node.getAttribute("data-latex") || node.textContent;
      segments.push({
        value: node.textContent,
        type: "latex",
        original_latex: value,
      });
    } else if (node.nodeName === "DIV" && node.querySelector("math-field")) {
      const mathField = node.querySelector("math-field");
      const value =
        mathField.getAttribute("data-latex") || mathField.textContent;
      segments.push({
        value: mathField.textContent,
        type: "latex",
        original_latex: value,
      });
    } else {
      console.log("node.textContent:", node.textContent);

      const text = node.textContent.trim();
      if (text)
        segments.push({ value: text, type: "text", original_latex: null });
    }
  });
  console.log("Parsed segments:", segments); // Debug log
  return segments;
};

function AddQuestion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    knowledgePoints,
    loading: kpLoading,
    error: kpError,
  } = useKnowledgePoints();
  const [formData, setFormData] = useState({
    title: "",
    segments: [], // Ensure initial value is an array
    content: "<p>", // Initial content for preview
    difficulty: "easy",
    topic: "algebra",
    knowledgePointIds: [],
    correctAnswer: "",
    questionType: "numerical",
    passValidation: false,
    isManualEdit: false, // Flag to track manual edits
  });
  const [testAnswer, setTestAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [saveToDb, setSaveToDb] = useState(false);
  const [aiProvider, setAiProvider] = useState("grok");

  const correctAnswerMathFieldRef = useRef(null);
  const testAnswerMathFieldRef = useRef(null);

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  // Sync segments to content only if not a manual edit
  useEffect(() => {
    console.log("Syncing segments to content");
    if (!formData.isManualEdit) {
      const wrappedContent = wrapLatexWithMathField(formData.segments || []);
      if (wrappedContent !== formData.content) {
        setFormData((prev) => ({
          ...prev,
          content: wrappedContent || "",
        }));
      }
    }
  }, [formData.segments, formData.isManualEdit]);

  // Handle content changes from QuestionEditor and sync to segments
  const handleContentChange = (content) => {
    console.log("Content changed in editor:", content);
    //const newSegments = parseContentToSegments(content);
    //console.log("New segments after parsing:", newSegments); // Debug log
    setFormData((prev) => ({
      ...prev,
      content,
      //segments: newSegments,
      isManualEdit: true, // Set flag to prevent overwrite
    }));
  };

  useEffect(() => {
    const correctMathField = correctAnswerMathFieldRef.current;
    const testMathField = testAnswerMathFieldRef.current;

    if (correctMathField && testMathField) {
      const handleCorrectInput = () => {
        const latex = correctMathField.value;
        console.log("Correct Answer input (LaTeX):", latex);
        setFormData((prev) => ({ ...prev, correctAnswer: latex }));
      };
      correctMathField.addEventListener("input", handleCorrectInput);

      const handleTestInput = () => {
        const latex = testMathField.value;
        console.log("Test Answer input (LaTeX):", latex);
        setTestAnswer(latex);
        setAnswerFeedback("");
      };
      testMathField.addEventListener("input", handleTestInput);

      return () => {
        correctMathField.removeEventListener("input", handleCorrectInput);
        testMathField.removeEventListener("input", handleTestInput);
      };
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
    console.log(
      "Sending to backend - Correct Answer:",
      formData.correctAnswer,
      "Test Answer:",
      testValue
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Verification timed out")), 5000)
    );

    try {
      const config = {
        headers: API.defaults.headers.common,
      };
      console.log("API request config:", config);

      const responsePromise = API.post(
        "/api/verify-answer/",
        {
          questionType: formData.questionType,
          correctAnswer: formData.correctAnswer,
          testAnswer: testValue,
        },
        config
      );

      const response = await Promise.race([responsePromise, timeoutPromise]);

      console.log("Verification response:", response.data);

      const formattedExpected = formatNumber(response.data.expected);
      const formattedSimplifiedTest = formatNumber(
        response.data.simplifiedTest
      );

      setAnswerFeedback(
        response.data.isConditional
          ? t("Answer is correct")
          : t("Answer is incorrect") +
              `: Expected ${formattedExpected}, got ${formattedSimplifiedTest}`
      );
    } catch (err) {
      console.error("Answer verification error:", err);
      console.error("Error response data:", err.response?.data);
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

  const handleGenerateQuestion = async () => {
    try {
      setLoading(true);
      const criteria = {
        difficulty: formData.difficulty,
        topic: formData.topic,
        save_to_db: saveToDb,
        ai_provider: aiProvider,
      };
      const response = await generateQuestion(criteria);
      console.log("Generated question response:", response.data);
      setFormData((prev) => ({
        ...prev,
        title: response.data.title || "Generated Question",
        segments: response.data.question || [],
        correctAnswer:
          response.data.correctAnswer.length > 0
            ? response.data.correctAnswer[0].value
            : "",
        passValidation: response.data.passValidation || false,
        isManualEdit: false, // Reset flag after generation
      }));
    } catch (err) {
      console.error("Error generating question:", err);
      toast.error(t("Failed to generate question"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      // Validate that segments is not empty and has at least one non-empty value
      console.log("formData:", formData);
      formData.segments = parseContentToSegments(formData.content);
      
      if (
        !formData.segments ||
        formData.segments.length === 0 ||
        !formData.segments.some((s) => s.value && s.value.trim())
      ) {
        toast.error(t("question_cannot_be_empty"), {
          toastId: "empty-question",
        });
        return;
      }

      setLoading(true);
      try {
        await addQuestion({
          ...formData,
          question: formData.segments, // Send segments array to backend
        });
        toast.success(t("question_added"), {
          toastId: "add-question-success",
        });
        navigate("/admin-dashboard");
      } catch (err) {
        const errorMsg = err.response?.data?.detail
          ? Array.isArray(err.response.data.detail)
            ? err.response.data.detail[0]?.msg || t("failed_to_add_question")
            : err.response.data.detail
          : t("failed_to_add_question");
        console.log("Submission error details:", err.response?.data); // Debug log
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
            <QuestionEditor
              segments={formData.segments || []}
              onContentChange={handleContentChange}
            />
            <div className="mt-2 flex space-x-4">
              <button
                type="button"
                onClick={handleGenerateQuestion}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? t("Generating...") : t("Generate Question")}
              </button>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={saveToDb}
                  onChange={(e) => setSaveToDb(e.target.checked)}
                />
                <span>{t("save_to_mongodb")}</span>
              </label>
            </div>
            {formData.passValidation === false && (
              <p className="mt-2 text-yellow-600 text-sm">
                {t("warning_validation_failed")}
              </p>
            )}
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
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700"
            >
              {t("topic")}
            </label>
            <select
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="algebra">{t("algebra")}</option>
              <option value="geometry">{t("geometry")}</option>
              <option value="calculus">{t("calculus")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("ai_provider")}
            </label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="grok">{t("grok")}</option>
              <option value="openai">{t("openai")}</option>
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
                  answerFeedback.includes("correct")
                    ? "text-green-600"
                    : "text-red-600"
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
