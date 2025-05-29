import React, { createContext, useState, useEffect } from "react";
import { getQuestions, addQuestion } from "../services/api";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuestions();
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (question) => {
    try {
      const response = await addQuestion(question);
      setQuestions([...questions, response.data]);
      return response.data;
    } catch (error) {
      console.error("Failed to add question:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <QuestionContext.Provider
      value={{ questions, loading, fetchQuestions, createQuestion }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
