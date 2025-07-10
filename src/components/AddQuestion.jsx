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

// Utility function to remove empty values from an array
const removeEmptyValues = (arr) => {
  return arr.filter(
    (item) => item !== undefined && item !== null && item !== ""
  );
};

const removeEmptyLatexValues = (arr) => {
  // log the input array for debugging
  console.log("Input array for removeEmptyLatexValues:", arr);
  // log each item in the array
  arr.forEach((item, index) => {
    console.log(`Item ${index}:`, item);
  });
  return arr.filter(
    (item) => item !== undefined && item !== null && item.value.trim() !== ""
  );
};

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
      } else if (segment.type === "newline") {
        return `<p><br></p>`;
      } else {
        return segment.value;
      }
    })
    .join("");
};

// Function to parse HTML content back to segments (simplified)
const parseContentToSegments = (htmlContent) => {
  console.log("htmlContent:", htmlContent);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const segments = [];
  console.log("tempDiv.innerHTML:", tempDiv.innerHTML);
  console.log(tempDiv.childNodes);
  tempDiv.childNodes.forEach((node) => {
    console.log(
      "node.name/type/value:",
      node.nodeName,
      node.nodeType,
      node.nodeValue
    );
    console.log("node:", node);
    console.log("segments start:", segments); // Debug log

    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "P") {
      //segments.push({ value: "", type: "newline", original_latex: null });
      console.log("node.textContent:", node.textContent);

      const text = node.textContent.trim();
      if (text && text.length > 0) {
        console.log("Adding text segment1:", "[", text, "]", text.length);
        segments.push({ value: "", type: "newline", original_latex: null });
        segments.push({ value: text, type: "text", original_latex: null });
      }else{
        if (
          node.childNodes &&
          node.childNodes.length == 1 &&
          node.childNodes[0].nodeName &&
          node.childNodes[0].nodeName.toLowerCase() === "br".toLowerCase()
        ){
          segments.push({ value: "", type: "newline", original_latex: null });
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text && text.length > 0) console.log("Adding text segment2:", text);
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
      if (text && text.length > 0) {
        console.log("Adding text segment3:", text);
        segments.push({ value: text, type: "text", original_latex: null });
      }
    }

    console.log("segments end:", segments); // Debug log
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
    correctAnswerRelationship: "or", // Default to "or" for multiple correct answers
    correctAnswer: [{ value: "", type: "latex" }], // Array of correct answers
    questionType: "numerical",
    passValidation: false,
    isManualEdit: false, // Flag to track manual edits
  });
  const [testAnswer, setTestAnswer] = useState([{ value: "", type: "latex" }]); // Array of test answers
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [saveToDb, setSaveToDb] = useState(false);
  const [aiProvider, setAiProvider] = useState("grok");

  const correctAnswerRefs = useRef([]); // Array of refs for correct answer fields
  const testAnswerRefs = useRef([]); // Array of refs for test answer fields
  const verifyAnswerButtonRef = useRef(null);

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
    setFormData((prev) => ({
      ...prev,
      content,
      isManualEdit: true, // Set flag to prevent overwrite
    }));
  };

  const updateCorrectAnswers = () => {
    const newCorrectAnswers = correctAnswerRefs.current.map((ref, index) => ({
      value: ref?.value || formData.correctAnswer[index]?.value || "",
      type: formData.correctAnswer[index]?.type || "latex", // Preserve or default to "latex"
    }));
    if (
      JSON.stringify(newCorrectAnswers) !==
      JSON.stringify(formData.correctAnswer)
    ) {
      setFormData((prev) => ({ ...prev, correctAnswer: newCorrectAnswers }));
    }
  };

  const updateTestAnswers = () => {
    const newTestAnswers = testAnswerRefs.current.map((ref, index) => ({
      value: ref?.value || testAnswer[index]?.value || "",
      type: testAnswer[index]?.type || "latex", // Preserve or default to "latex"
    }));
    if (JSON.stringify(newTestAnswers) !== JSON.stringify(testAnswer)) {
      setTestAnswer(newTestAnswers);
    }
  };

  // Update correct answer values from math-fields
  useEffect(() => {
    updateCorrectAnswers();
  }, [formData.correctAnswer]);

  // Update test answer values from math-fields
  useEffect(() => {
    updateTestAnswers();
  }, [testAnswer]);

  // Handle input changes for each correct answer math-field
  const handleCorrectInput = (index) => (e) => {
    const newRefs = [...correctAnswerRefs.current];
    newRefs[index] = e.target;
    correctAnswerRefs.current = newRefs;
    const newCorrectAnswers = [...formData.correctAnswer];
    newCorrectAnswers[index] = {
      value: e.target.value || "",
      type: newCorrectAnswers[index]?.type || "latex", // Preserve existing type
    };
    setFormData((prev) => ({ ...prev, correctAnswer: newCorrectAnswers }));
  };

  // Handle input changes for each test answer math-field
  const handleTestInput = (index) => (e) => {
    const newRefs = [...testAnswerRefs.current];
    newRefs[index] = e.target;
    testAnswerRefs.current = newRefs;
    const newTestAnswers = [...testAnswer];
    newTestAnswers[index] = {
      value: e.target.value || "",
      type: newTestAnswers[index]?.type || "latex", // Preserve existing type
    };
    setTestAnswer(newTestAnswers);
  };

  // Handle test answer input
  useEffect(() => {
    const testMathFields = testAnswerRefs.current;
    testMathFields.forEach((field, index) => {
      if (field) {
        const handleInput = () => {
          const latex = field.value;
          console.log(`Test Answer ${index} input (LaTeX):`, latex);
          updateTestAnswers();
          setAnswerFeedback("");
        };
        field.addEventListener("input", handleInput);
        return () => field.removeEventListener("input", handleInput);
      }
    });
  }, [verifyLoading, testAnswerRefs.current.length]);

  useEffect(() => {
    console.log("Test Answer field disabled state:", verifyLoading);
    if (testAnswerRefs.current.length > 0) {
      testAnswerRefs.current.forEach((field) => {
        if (field) {
          field.disabled = verifyLoading;
          if (!verifyLoading) {
            field.focus();
          }
        }
      });
    }
  }, [verifyLoading]);

  const verifyAnswer = async (testValues) => {
    if (
      !formData.correctAnswer.some((ans) => ans.value) ||
      !testValues.some((ans) => ans.value)
    ) {
      setAnswerFeedback("");
      setVerifyLoading(false);
      return;
    }

    setVerifyLoading(true);
    console.log("Starting verification, verifyLoading:", true);
    console.log(
      "Verification input - Correct Answers:",
      formData.correctAnswer.map((ans) => ({
        value: ans.value,
        type: ans.type,
      })),
      "Test Answers:",
      testValues.map((ans) => ({ value: ans.value, type: ans.type }))
    );

    const timeoutPromise = new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error("Verification timed out")), 10000) // 10 seconds timeout
    );

    try {
      const config = {
        headers: API.defaults.headers.common,
      };
      console.log("API request config:", config);

      testValues = removeEmptyLatexValues(testValues);
      formData.correctAnswer = removeEmptyLatexValues(formData.correctAnswer);
      console.log("Formatted test values:", testValues);
      console.log("Formatted correct answers:", formData.correctAnswer);

      const responsePromise = API.post(
        "/api/verify-answer/",
        {
          questionType: formData.questionType,
          correctAnswerRelationship: formData.correctAnswerRelationship,
          correctAnswers: formData.correctAnswer,
          testAnswers: testValues,
        },
        config
      );
      console.log("Response promise created:", responsePromise); // Debug log

      const response = await Promise.race([responsePromise, timeoutPromise]);
      console.log("Full Verification response data:", response.data); // Log full response

      // Handle multiple correct and test answers using backend results
      if (!response.data.results || !Array.isArray(response.data.results)) {
        console.warn("Invalid results format in response:", response.data);
        setAnswerFeedback(t("Verification failed: Invalid response format"));
        return;
      }

      const results = response.data.results;
      console.log("Received results:", results); // Debug log for results structure
      const feedbackParts = results.map((result) =>
        result.isCorrect
          ? `${t("Test")} '${result.testAnswer}' ${t("is correct")}`
          : `${t("Test")} '${result.testAnswer}' ${t("is incorrect")}: ${t(
              "Expected"
            )} ${
              result.expectedAnswer
                ? result.expectedAnswer
                : result.expectedAnswers.join(" or ")
            }, ${t("got")} ${result.testAnswer}`
      );

      const allCorrect = results.every((result) => result.isCorrect);
      setAnswerFeedback(
        allCorrect
          ? t("All test answers are correct")
          : feedbackParts.join(" | ")
      );
      console.log("Feedback set to:", answerFeedback); // Debug log
    } catch (err) {
      console.error("Answer verification error:", err);
      console.error("Error response data:", err.response?.data);
      setAnswerFeedback(
        t("Verification failed: ") + (err.response?.data?.detail || err.message)
      );
      console.log("Error feedback set to:", answerFeedback); // Debug log
    } finally {
      setVerifyLoading(false);
      console.log("Finished verification, verifyLoading:", false);
    }
  };

  const handleVerifyAnswer = () => {
    console.log("Verifying answer with testAnswers:", testAnswer);
    console.log("Correct Answers:", formData.correctAnswer);

    updateCorrectAnswers();
    updateTestAnswers();
    console.log("Updated Correct Answers:", formData.correctAnswer);
    console.log("Updated Test Answers:", testAnswer);

    if (!formData.correctAnswer.some((ans) => ans.value)) {
      setAnswerFeedback(t("Please enter at least one Correct Answer first"));
      return;
    }
    if (!testAnswer.some((ans) => ans.value)) {
      setAnswerFeedback(t("Please enter at least one Test Answer"));
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
        include_correct_answers: true, // Request correct answers explicitly
      };
      const response = await generateQuestion(criteria);
      console.log("Generated question response:", response.data);
      const correctAnswers = response.data.correctAnswer;
      let updatedCorrectAnswers;
      if (Array.isArray(correctAnswers) && correctAnswers.length > 0) {
        updatedCorrectAnswers = correctAnswers.map((ans) => ({
          value: ans.value || ans,
          type: "latex",
        }));
      } else if (correctAnswers) {
        updatedCorrectAnswers = [{ value: correctAnswers, type: "latex" }];
      } else {
        updatedCorrectAnswers = [{ value: "", type: "latex" }];
        console.warn("No correct answers received from API, using default.");
      }
      console.log("Updated correct answers before set:", updatedCorrectAnswers);
      // Update refs to match the new number of correct answers before state set
      correctAnswerRefs.current = Array(updatedCorrectAnswers.length).fill(
        null
      );
      setFormData((prev) => ({
        ...prev,
        title: response.data.title || "Generated Question",
        segments: response.data.question || [],
        correctAnswer: updatedCorrectAnswers,
        passValidation: response.data.passValidation || false,
        isManualEdit: false, // Reset flag after generation
      }));
      console.log("CorrectAnswer after set:", formData.correctAnswer); // Debug log
      // Invoke function to render and populate correct answer fields
      renderCorrectAnswerFields();
      console.log(
        "Refs length after update:",
        correctAnswerRefs.current.length
      ); // Debug log
    } catch (err) {
      console.error("Error generating question:", err);
      toast.error(t("Failed to generate question"));
    } finally {
      setLoading(false);
    }
  };

  // Function to dynamically render correct answer fields
  const renderCorrectAnswerFields = () => {
    console.log(
      "Rendering correct answer fields with:",
      formData.correctAnswer
    );
    console.log("corectAnswer in formData:", formData.correctAnswer);
    if (!formData.correctAnswer || formData.correctAnswer.length === 0) {
      return (
        <div className="text-gray-500 flex items-center">
          <math-field
            ref={(el) => (correctAnswerRefs.current[0] = el)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md"
            style={{ minHeight: "50px", minWidth: "90%" }}
            onInput={handleCorrectInput(0)}
            data-latex=""
          ></math-field>
          <select
            value={formData.correctAnswer[0]?.type || "latex"}
            onChange={(e) =>
              setFormData((prev) => {
                const newCorrectAnswers = [...prev.correctAnswer];
                newCorrectAnswers[0] = {
                  ...newCorrectAnswers[0],
                  type: e.target.value,
                };
                return { ...prev, correctAnswer: newCorrectAnswers };
              })
            }
            className="ml-2 p-1 border border-gray-300 rounded"
          >
            <option value="latex">LaTeX</option>
            <option value="text">Text</option>
          </select>
        </div>
      );
    }
    return formData.correctAnswer.map((ans, index) => (
      <div key={index} className="mb-2 flex items-center">
        <math-field
          ref={(el) => (correctAnswerRefs.current[index] = el)}
          className="mt-1 w-full p-3 border border-gray-300 rounded-md"
          style={{ minHeight: "50px", minWidth: "90%" }}
          onInput={handleCorrectInput(index)}
          data-latex={ans.value}
        >
          {ans.value}
        </math-field>
        <select
          value={ans.type || "latex"}
          onChange={(e) =>
            setFormData((prev) => {
              const newCorrectAnswers = [...prev.correctAnswer];
              newCorrectAnswers[index] = {
                ...newCorrectAnswers[index],
                type: e.target.value,
              };
              return { ...prev, correctAnswer: newCorrectAnswers };
            })
          }
          className="ml-2 p-1 border border-gray-300 rounded"
        >
          <option value="latex">LaTeX</option>
          <option value="text">Text</option>
        </select>
      </div>
    ));
  };

  // Function to dynamically render test answer fields
  const renderTestAnswerFields = () => {
    console.log("Rendering test answer fields with:", testAnswer);
    if (!testAnswer || testAnswer.length === 0) {
      return (
        <div className="text-gray-500 flex items-center">
          <math-field
            ref={(el) => (testAnswerRefs.current[0] = el)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md"
            style={{ minHeight: "50px", minWidth: "90%" }}
            onInput={handleTestInput(0)}
            data-latex=""
          ></math-field>
          <select
            value={testAnswer[0]?.type || "latex"}
            onChange={(e) =>
              setTestAnswer((prev) => {
                const newTestAnswers = [...prev];
                newTestAnswers[0] = {
                  ...newTestAnswers[0],
                  type: e.target.value,
                };
                return newTestAnswers;
              })
            }
            className="ml-2 p-1 border border-gray-300 rounded"
          >
            <option value="latex">LaTeX</option>
            <option value="text">Text</option>
          </select>
        </div>
      );
    }
    return testAnswer.map((ans, index) => (
      <div key={index} className="mb-2 flex items-center">
        <math-field
          ref={(el) => (testAnswerRefs.current[index] = el)}
          className="mt-1 w-full p-3 border border-gray-300 rounded-md"
          style={{ minHeight: "50px", minWidth: "90%" }}
          onInput={handleTestInput(index)}
          data-latex={ans.value}
        >
          {ans.value}
        </math-field>
        <select
          value={ans.type || "latex"}
          onChange={(e) =>
            setTestAnswer((prev) => {
              const newTestAnswers = [...prev];
              newTestAnswers[index] = {
                ...newTestAnswers[index],
                type: e.target.value,
              };
              return newTestAnswers;
            })
          }
          className="ml-2 p-1 border border-gray-300 rounded"
        >
          <option value="latex">LaTeX</option>
          <option value="text">Text</option>
        </select>
      </div>
    ));
  };

  const handleAddTestAnswer = () => {
    setTestAnswer((prev) => [...prev, { value: "", type: "latex" }]);
    testAnswerRefs.current = [...testAnswerRefs.current, null];
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

  const handleAddCorrectAnswer = () => {
    setFormData((prev) => ({
      ...prev,
      correctAnswer: [...prev.correctAnswer, { value: "", type: "latex" }],
    }));
    // Ensure refs array is updated
    correctAnswerRefs.current = [...correctAnswerRefs.current, null];
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
          correctAnswer: formData.correctAnswer, // Send array of correct answers
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

  // Enable "Verify Answer" button when correctAnswer and testAnswer are not empty
  useEffect(() => {
    const hasCorrectAnswers = formData.correctAnswer.some((ans) => ans.value);
    const hasTestAnswers = testAnswer.some((ans) => ans.value);
    const isDisabled = verifyLoading || !hasCorrectAnswers || !hasTestAnswers;
    console.log(
      "Verify button disabled state:",
      isDisabled,
      "Correct Answers:",
      hasCorrectAnswers,
      "Test Answers:",
      hasTestAnswers
    );
    if (verifyAnswerButtonRef.current) {
      verifyAnswerButtonRef.current.disabled = isDisabled;
    }
  }, [formData.correctAnswer, testAnswer, verifyLoading]);

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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                {t("Correct Answer(s)")}{" "}
                <span className="text-gray-500">{t("(optional)")}</span>
              </label>
              <span className="text-sm text-gray-700">
                {t("Correct Answer Relationship:")}
                <input
                  type="radio"
                  name="correctAnswerRelationship"
                  value="and"
                  checked={formData.correctAnswerRelationship === "and"}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      correctAnswerRelationship: "and",
                    }))
                  }
                  className="mr-2"
                />
                {t("And (all must be correct)  ")}
                <input
                  type="radio"
                  name="correctAnswerRelationship"
                  value="or"
                  checked={
                    !formData.correctAnswerRelationship ||
                    formData.correctAnswerRelationship === "or"
                  }
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      correctAnswerRelationship: "or",
                    }))
                  }
                  className="mr-2"
                />
                {t("Or (any one is correct)")}
              </span>
            </div>
            {renderCorrectAnswerFields()}
            <button
              type="button"
              onClick={handleAddCorrectAnswer}
              className="mt-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {t("Add Another Correct Answer")}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Test Answer(s)")}
            </label>
            {renderTestAnswerFields()}
            <button
              type="button"
              onClick={handleAddTestAnswer}
              className="mt-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {t("Add Another Test Answer")}
            </button>
          </div>

          <button
            ref={verifyAnswerButtonRef}
            type="button"
            onClick={handleVerifyAnswer}
            disabled={
              verifyLoading ||
              !formData.correctAnswer.some((ans) => ans.value) ||
              !testAnswer.some((ans) => ans.value)
            }
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
