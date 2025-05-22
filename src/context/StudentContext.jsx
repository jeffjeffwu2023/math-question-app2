// src/context/StudentContext.jsx
import { createContext, useContext, useState } from "react";

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]); // [{ id: string, name: string, email: string }]

  const addStudent = (student) => {
    if (students.some((s) => s.id === student.id)) {
      alert("Student ID already exists!");
      return false;
    }
    setStudents([...students, student]);
    return true;
  };

  const editStudent = (id, updatedStudent) => {
    if (students.some((s) => s.id === updatedStudent.id && s.id !== id)) {
      alert("Student ID already exists!");
      return false;
    }
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, ...updatedStudent } : student
      )
    );
    return true;
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

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
