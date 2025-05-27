// frontend/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 5000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (id, password) =>
  API.post("/api/auth/login/", { id, password });

// User endpoints
export const getUsers = () => API.get("/api/users/");
export const addUser = (user) => API.post("/api/users/", user);
export const updateUser = (id, user) => API.put(`/api/users/${id}/`, user);
export const deleteUser = (id) => API.delete(`/api/users/${id}/`);

// Assignment endpoints
export const createAssignment = (assignment) =>
  API.post("/api/assignments/", assignment);
export const getAssignments = (studentId) =>
  API.get("/api/assignments/", { params: { student_id: studentId } });
export const submitAssignment = (id) =>
  API.put(`/api/assignments/submit/${id}`);

// Question endpoints
export const getQuestions = () => API.get("/api/questions/");
export const addQuestion = (question) => API.post("/api/questions/", question);

// Category endpoints
export const getCategories = () => API.get("/api/categories/");
export const addCategory = (category) => API.post("/api/categories/", category);
export const updateCategory = (name, category) =>
  API.put(`/api/categories/${name}/`, category);
export const deleteCategory = (name) => API.delete(`/api/categories/${name}/`);

// Answer endpoints
export const addAnswer = (answer) => API.post("/api/answers/", answer);
export const evaluateAnswer = (prompt) => API.post("/api/ai/grok/", { prompt });
export const saveAnswer = (index, answer, isCorrect) =>
  API.post("/api/answers/", { index, answer, isCorrect });

// Performance endpoints
export const analyzeStudent = (studentId) =>
  API.get(`/api/performance/${studentId}/`);

// Classroom endpoints
export const getClassrooms = () => API.get("/api/classrooms/");
export const createClassroom = (classroom) =>
  API.post("/api/classrooms/", classroom);
export const updateClassroom = (id, classroom) =>
  API.put(`/api/classrooms/${id}/`, classroom);
export const deleteClassroom = (id) => API.delete(`/api/classrooms/${id}/`);

// Manager endpoints
export const assignManager = (manager) => API.post("/api/managers/", manager);
export const removeManager = (manager) =>
  API.delete("/api/managers/", { data: manager });
export const getManagerAssignments = () => API.get("/api/managers/");

export { API };
export default API;
