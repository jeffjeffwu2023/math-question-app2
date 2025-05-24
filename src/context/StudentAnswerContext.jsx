// src/context/StudentAnswerContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getAnswers,
  addAnswer,
  getAssignments,
  assignHomework,
  submitAssignment,
} from "../services/api";
import { showToast } from "../utils/toast";

const StudentAnswerContext = createContext();

export function StudentAnswerProvider({ children }) {
  const [answers, setAnswers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const answersResponse = await getAnswers();
        const assignmentsResponse = await getAssignments();
        setAnswers(answersResponse.data);
        setAssignments(assignmentsResponse.data);
        console.log("Fetched answers:", answersResponse.data);
        console.log("Fetched assignments:", assignmentsResponse.data);
      } catch (error) {
        showToast("Failed to fetch answers or assignments.", "error");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveAnswer = async (questionIndex, answer, isCorrect) => {
    try {
      const answerData = {
        questionIndex,
        studentId: "std001", // Replace with logged-in student ID
        answer,
        isCorrect,
        timeTaken: 120, // Placeholder
      };
      await addAnswer(answerData);
      setAnswers((prev) => [...prev, answerData]);
      console.log("Saved answer:", answerData);
    } catch (error) {
      showToast("Failed to save answer.", "error");
      console.error("Error saving answer:", error);
    }
  };

  const assignHomework = async (questionIndices, studentId) => {
    try {
      const assignmentData = {
        id: Date.now(), // Temporary ID; backend assigns unique ID
        questionIndices,
        studentId,
        submitted: false,
      };
      const response = await assignHomework(assignmentData);
      setAssignments((prev) => [
        ...prev,
        { ...assignmentData, id: response.data.id },
      ]);
      console.log("Assigned homework:", assignmentData);
      return true;
    } catch (error) {
      showToast("Failed to assign homework.", "error");
      console.error("Error assigning homework:", error);
      return false;
    }
  };

  const submitAssignment = async (assignmentId) => {
    try {
      await submitAssignment(assignmentId);
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId
            ? { ...assignment, submitted: true }
            : assignment
        )
      );
      console.log("Submitted assignment ID:", assignmentId);
    } catch (error) {
      showToast("Failed to submit assignment.", "error");
      console.error("Error submitting assignment:", error);
    }
  };

  return (
    <StudentAnswerContext.Provider
      value={{
        answers,
        saveAnswer,
        assignments,
        assignHomework,
        submitAssignment,
        loading,
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
