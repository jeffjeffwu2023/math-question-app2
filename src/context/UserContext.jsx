// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { getUsers } from "../services/api.js";
import { showToast } from "../utils/toast.js";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || !["admin", "tutor"].includes(user.role)) return;
      setLoading(true);
      try {
        const response = await getUsers();
        const allUsers = response.data;
        setUsers(allUsers);
        const studentUsers = allUsers.filter((u) => u.role === "student");
        setStudents(studentUsers);
      } catch (error) {
        showToast("Failed to fetch users.", "error");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  return (
    <UserContext.Provider value={{ users, students, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}

export function useStudents() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useStudents must be used within a UserProvider");
  }
  return context;
}
