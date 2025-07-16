import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
});

API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = localStorage.getItem("authToken");
    }
    console.log("Token being used for request:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API response error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn("Authentication failed, redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (email, password) => {
  console.log("Logging in with email:", email);
  console.log("Logging in with Password:", password);
  return API.post("/api/auth/login", { email, password });
};

// User endpoints
export const getUsers = (filters = {}) =>
  API.get("/api/users", { params: filters });
export const getUsersByTutor = (tutor_id) =>
  API.get(`/api/users/bytutor/${tutor_id}`);
export const addUser = (user) => API.post("/api/users", user);
export const updateUser = (id, user) => API.put(`/api/users/${id}`, user);
export const softDeleteUser = (id) => API.delete(`/api/users/${id}`);
export const assignParent = (data) => API.post("/api/users/assign-parent", data);
export const assignStudent = (data) => API.post("/api/users/assign-student", data);
export const assignStudents = (data) => API.post("/api/tutors/assign-students", data);



// Assignment endpoints
export const createAssignment = (assignment) =>
  API.post("/api/assignments", assignment);
export const getAssignments = (studentId) =>
  API.get("/api/assignments", { params: { student_id: studentId } });
export const submitAssignment = (id) =>
  API.put(`/api/assignments/submit/${id}`);

// Question endpoints
export const getQuestions = () => API.get("/api/questions");
export const getQuestionById = (id) => API.get(`/api/questions/${id}`);
export const addQuestion = (question) => API.post("/api/questions", question);

// Knowledge point endpoints
export const getKnowledgePoints = (params = {}) =>
  API.get("/api/knowledge-points", { params });
export const addKnowledgePoint = (knowledgePoint) =>
  API.post("/api/knowledge-points", knowledgePoint);
export const updateKnowledgePoint = (id, knowledgePoint) =>
  API.put(`/api/knowledge-points/${id}`, knowledgePoint);
export const deleteKnowledgePoint = (id) =>
  API.delete(`/api/knowledge-points/${id}`);

// Answer endpoints
export const addAnswer = (answer) => API.post("/api/answers", answer);
export const evaluateAnswer = (prompt) => API.post("/api/ai/grok", { prompt });
export const saveAnswer = (questionId, answer, isCorrect) =>
  API.post("/api/answers", { questionId, answer, isCorrect });
export const getAnswers = (studentId) =>
  API.get(`/api/answers${studentId ? `?student_id=${studentId}` : ""}`);

// Performance endpoints
export const performanceMetrics = (data) =>
  API.post("/api/students/performance-metrics", data);
export const timeSpent = (data) => API.post("/api/students/time-spent", data);

// AI APIs
export const analyzeStudent = (
  studentData,
  targetAudience = "student",
  language = "en"
) =>
  API.post("/api/ai/analyze-student", studentData, {
    params: { target_audience: targetAudience, language },
  });

// Classroom endpoints
export const getClassrooms = () => API.get("/api/classrooms");
export const createClassroom = (classroom) =>
  API.post("/api/classrooms", classroom);
export const updateClassroom = (id, classroom) =>
  API.put(`/api/classrooms/${id}`, classroom);
export const deleteClassroom = (id) => API.delete(`/api/classrooms/${id}`);

// Manager endpoints
export const assignManager = (manager) => API.post("/api/managers", manager);
export const removeManager = (manager) =>
  API.delete("/api/managers", { data: manager });
export const getManagerAssignments = () => API.get("/api/managers");

// Course endpoints
export const getCourses = () => API.get("/api/courses");
export const createCourse = (course) => API.post("/api/courses", course);
export const updateCourse = (id, course) =>
  API.put(`/api/courses/${id}`, course);
export const deleteCourse = (id) => API.delete(`/api/courses/${id}`);

// Verify Answer
export const verifyAnswer = (testAnswer) =>
  API.post("/api/verify-answer", testAnswer);

// Generate Question
export const generateQuestion = (criteria) =>
  API.post("/api/generate-question", criteria, {
    transformResponse: (data) => {
      const result = JSON.parse(data);
      return result;
    },
  });

export { API };
export default API;