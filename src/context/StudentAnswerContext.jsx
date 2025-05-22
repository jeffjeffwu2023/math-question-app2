// src/context/StudentAnswerContext.jsx
import { createContext, useContext, useState } from "react";

const StudentAnswerContext = createContext();

export function StudentAnswerProvider({ children }) {
  const [answers, setAnswers] = useState({}); // { questionIndex: { answer: string, isCorrect: boolean } }
  const [assignments, setAssignments] = useState([]); // [{ id: number, questionIndices: number[], studentId: string, submitted: boolean }]

  const saveAnswer = (questionIndex, answer, isCorrect) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: { answer, isCorrect },
    }));
  };

  const assignHomework = (questionIndices, studentId) => {
    const newAssignment = {
      id: assignments.length + 1,
      questionIndices,
      studentId,
      submitted: false,
    };
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const submitAssignment = (assignmentId) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, submitted: true }
          : assignment
      )
    );
  };

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
