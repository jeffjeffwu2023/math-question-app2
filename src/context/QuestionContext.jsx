// math-question-app2/src/context/QuestionContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getQuestions, addQuestion } from "../services/api";
import { showToast } from "../utils/toast";

const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await getQuestions();
        setQuestions(response.data || []);
        setError(null);
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail || "Failed to fetch questions.";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const addQuestion = async (question) => {
    try {
      const response = await addQuestion(question);
      setQuestions((prev) => [...prev, response.data]);
      showToast("Question added successfully!", "success");
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Failed to add question.";
      showToast(errorMessage, "error");
      return false;
    }
  };

  return (
    <QuestionContext.Provider
      value={{ questions, addQuestion, loading, error }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context)
    throw new Error("useQuestions must be used within a QuestionProvider");
  return context;
}
