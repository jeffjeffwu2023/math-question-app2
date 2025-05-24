// src/services/api.js
import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 5,
});

API.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] ${response.config.method.toUpperCase()} ${
        response.config.url
      } - Status: ${response.status}`
    );
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 0 &&
      error.message.includes("redirect")
    ) {
      console.error("[API Redirect Loop Detected]");
      throw new Error(
        "Redirect loop detected. Please check server configuration."
      );
    }
    console.error(
      "[API Response Error]",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Student APIs
export const addStudent = (student) => API.post("/api/students/", student);
export const getStudents = () => API.get("/api/students/");
export const updateStudent = (id, student) =>
  API.put(`/api/students/${id}/`, student);
export const deleteStudent = (id) => API.delete(`/api/students/${id}/`);

// Question APIs
export const addQuestion = (question) => API.post("/api/questions/", question);
export const getQuestions = () => API.get("/api/questions/");

// Assignment APIs
export const getAssignments = (studentId) =>
  API.get(`/api/assignments/${studentId ? `?student_id=${studentId}` : ""}`);
export const assignHomework = (assignment) =>
  API.post("/api/assignments/", assignment);
export const submitAssignment = (id) =>
  API.put(`/api/assignments/submit/${id}/`);

// Answer APIs
export const addAnswer = (answer) => API.post("/api/answers/", answer);
export const getAnswers = (studentId) =>
  API.get(`/api/answers/${studentId ? `?student_id=${studentId}` : ""}`);

// AI APIs
export const evaluateAnswer = (prompt) => API.post("/api/ai/grok/", { prompt });
export const analyzeStudent = (
  studentData,
  targetAudience = "student",
  language = "en"
) =>
  API.post("/api/ai/analyze-student/", studentData, {
    params: { target_audience: targetAudience, language },
  });

export const performanceMetrics = (data) =>
  API.post("/api/students/performance-metrics/", data);
export const timeSpent = (data) => API.post("/api/students/time-spent/", data);
