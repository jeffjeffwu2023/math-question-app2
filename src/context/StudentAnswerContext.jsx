// src/context/StudentAnswerContext.jsx
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { addAnswer } from "../services/api.js";
import { showToast } from "../utils/toast.js";

const StudentAnswerContext = createContext();

export function StudentAnswerProvider({ children }) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitAnswer = async (questionIndex, answer, isCorrect) => {
    if (!user || user.role !== "student") {
      showToast("Only students can submit answers.", "error");
      return false;
    }
    setLoading(true);
    try {
      await addAnswer({
        studentId: user.id,
        questionIndex,
        answer,
        isCorrect,
        createdAt: new Date().toISOString(),
      });
      setAnswers([...answers, { questionIndex, answer, isCorrect }]);
      showToast("Answer submitted successfully!", "success");
      return true;
    } catch (error) {
      showToast("Failed to submit answer.", "error");
      console.error("Error submitting answer:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentAnswerContext.Provider value={{ answers, loading, submitAnswer }}>
      {children}
    </StudentAnswerContext.Provider>
  );
}

export function useStudentAnswers() {
  const context = useContext(StudentAnswerContext);
  if (!context) {
    throw new Error(
      "useStudentAnswers must be used within a StudentAnswerProvider"
    );
  }
  return context;
}
