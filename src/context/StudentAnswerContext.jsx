// src/context/StudentAnswerContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const StudentAnswerContext = createContext();

export function StudentAnswerProvider({ children }) {
  // Initialize state from localStorage
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("answers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [assignments, setAssignments] = useState(() => {
    const savedAssignments = localStorage.getItem("assignments");
    return savedAssignments ? JSON.parse(savedAssignments) : [];
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
    console.log("Persisting answers to localStorage:", answers); // Debug log
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
    console.log("Persisting assignments to localStorage:", assignments); // Debug log
  }, [assignments]);

  const saveAnswer = (questionIndex, answer, isCorrect) => {
    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [questionIndex]: { answer, isCorrect },
      };
      console.log(
        "Saving answer for question index:",
        questionIndex,
        "Answer:",
        updatedAnswers[questionIndex]
      ); // Debug log
      return updatedAnswers;
    });
  };

  const assignHomework = (questionIndices, studentId) => {
    const newAssignment = {
      id: assignments.length + 1,
      questionIndices,
      studentId,
      submitted: false,
    };
    setAssignments((prev) => {
      const updatedAssignments = [...prev, newAssignment];
      console.log("Assigning homework:", newAssignment); // Debug log
      console.log("Updated assignments array:", updatedAssignments); // Debug log
      return updatedAssignments;
    });
  };

  const submitAssignment = (assignmentId) => {
    setAssignments((prev) => {
      const updatedAssignments = prev.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, submitted: true }
          : assignment
      );
      console.log("Submitting assignment ID:", assignmentId); // Debug log
      console.log("Updated assignments array:", updatedAssignments); // Debug log
      return updatedAssignments;
    });
  };

  console.log("StudentAnswerContext - Current answers:", answers); // Debug log
  console.log("StudentAnswerContext - Current assignments:", assignments); // Debug log

  return (
    <StudentAnswerContext.Provider
      value={{
        answers,
        saveAnswer,
        assignments,
        assignHomework,
        submitAssignment,
      }}
    >
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
