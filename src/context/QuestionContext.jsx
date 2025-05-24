// src/context/QuestionContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getQuestions, addQuestion } from "../services/api";
import { showToast } from "../utils/toast";

const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await getQuestions();
        setQuestions(response.data);
        console.log("Fetched questions:", response.data);
      } catch (error) {
        showToast("Failed to fetch questions.", "error");
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const addQuestion = async (newQuestion) => {
    try {
      const response = await addQuestion(newQuestion);
      setQuestions((prev) => [...prev, newQuestion]);
      console.log("Added question:", newQuestion);
      return true;
    } catch (error) {
      showToast("Failed to add question.", "error");
      console.error("Error adding question:", error);
      return false;
    }
  };

  return (
    <QuestionContext.Provider value={{ questions, addQuestion, loading }}>
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionProvider");
  }
  return context;
}
