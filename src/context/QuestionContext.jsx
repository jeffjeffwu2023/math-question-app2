// src/context/QuestionContext.jsx
import { createContext, useContext, useState } from "react";

const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (newQuestion) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev, newQuestion];
      console.log("Adding question:", newQuestion); // Debug log
      console.log("Updated questions array:", updatedQuestions); // Debug log
      return updatedQuestions;
    });
  };

  console.log("QuestionContext - Current questions:", questions); // Debug log

  return (
    <QuestionContext.Provider value={{ questions, addQuestion }}>
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
