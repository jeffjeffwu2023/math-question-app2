// frontend/src/context/ClassroomContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} from "../services/api";
import { showToast } from "../utils/toast";

const ClassroomContext = createContext();

export function ClassroomProvider({ children }) {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const response = await getClassrooms();
        setClassrooms(response.data);
      } catch (error) {
        showToast("Failed to fetch classrooms.", "error");
        console.error("Error fetching classrooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassrooms();
  }, []);

  const addClassroom = async (classroom) => {
    try {
      const response = await createClassroom(classroom);
      setClassrooms((prev) => [...prev, response.data]);
      showToast("Classroom added successfully!", "success");
      return true;
    } catch (error) {
      showToast("Failed to add classroom.", "error");
      console.error("Error adding classroom:", error);
      return false;
    }
  };

  const updateClassroom = async (id, updatedClassroom) => {
    try {
      await updateClassroom(id, updatedClassroom);
      setClassrooms((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedClassroom } : c))
      );
      showToast("Classroom updated successfully!", "success");
      return true;
    } catch (error) {
      showToast("Failed to update classroom.", "error");
      console.error("Error updating classroom:", error);
      return false;
    }
  };

  const deleteClassroom = async (id) => {
    try {
      await deleteClassroom(id);
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
      showToast("Classroom deleted successfully!", "success");
      return true;
    } catch (error) {
      showToast("Failed to delete classroom.", "error");
      console.error("Error deleting classroom:", error);
      return false;
    }
  };

  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        loading,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
}

export function useClassrooms() {
  const context = useContext(ClassroomContext);
  if (!context)
    throw new Error("useClassrooms must be used within a ClassroomProvider");
  return context;
}
