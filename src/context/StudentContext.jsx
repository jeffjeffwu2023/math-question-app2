// src/context/StudentContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../services/api";
import { showToast } from "../utils/toast";

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await getStudents();
        setStudents(response.data);
        console.log("Fetched students:", response.data);
      } catch (error) {
        showToast("Failed to fetch students.", "error");
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const addStudent = async (student) => {
    try {
      const response = await addStudent(student);
      setStudents((prev) => [...prev, student]);
      console.log("Added student:", student);
      return true;
    } catch (error) {
      showToast("Failed to add student. ID may already exist.", "error");
      console.error("Error adding student:", error);
      return false;
    }
  };

  const editStudent = async (id, updatedStudent) => {
    try {
      await updateStudent(id, updatedStudent);
      setStudents((prev) =>
        prev.map((student) =>
          student.id === id ? { ...student, ...updatedStudent } : student
        )
      );
      console.log("Edited student ID:", id, "with data:", updatedStudent);
      return true;
    } catch (error) {
      showToast("Failed to update student. ID may already exist.", "error");
      console.error("Error editing student:", error);
      return false;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
      console.log("Deleted student ID:", id);
      return true;
    } catch (error) {
      showToast("Failed to delete student.", "error");
      console.error("Error deleting student:", error);
      return false;
    }
  };

  return (
    <StudentContext.Provider
      value={{ students, addStudent, editStudent, deleteStudent, loading }}
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
