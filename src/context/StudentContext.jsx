// src/context/StudentContext.jsx
import { createContext, useContext, useState } from "react";
import { showToast } from "../utils/toast.js";

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    if (students.some((s) => s.id === student.id)) {
      showToast("Student ID already exists!", "error");
      return false;
    }
    setStudents((prev) => {
      const updatedStudents = [...prev, student];
      console.log("Adding student:", student); // Debug log
      console.log("Updated students array:", updatedStudents); // Debug log
      return updatedStudents;
    });
    return true;
  };

  const editStudent = (id, updatedStudent) => {
    if (students.some((s) => s.id === updatedStudent.id && s.id !== id)) {
      showToast("Student ID already exists!", "error");
      return false;
    }
    setStudents((prev) => {
      const updatedStudents = prev.map((student) =>
        student.id === id ? { ...student, ...updatedStudent } : student
      );
      console.log("Editing student ID:", id, "with data:", updatedStudent); // Debug log
      console.log("Updated students array:", updatedStudents); // Debug log
      return updatedStudents;
    });
    return true;
  };

  const deleteStudent = (id) => {
    setStudents((prev) => {
      const updatedStudents = prev.filter((student) => student.id !== id);
      console.log("Deleting student ID:", id); // Debug log
      console.log("Updated students array:", updatedStudents); // Debug log
      return updatedStudents;
    });
  };

  console.log("StudentContext - Current students:", students); // Debug log

  return (
    <StudentContext.Provider
      value={{ students, addStudent, editStudent, deleteStudent }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
}
