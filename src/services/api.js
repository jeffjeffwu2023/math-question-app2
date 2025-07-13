import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
});

API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = localStorage.getItem("authToken"); // Fallback key
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
  return API.post("/api/auth/login", { email, password }); // Removed trailing slash
};

// User endpoints
export const getUsers = (filters = {}) =>
  API.get("/api/users", { params: filters }); // Removed trailing slash
export const getUsersByTutor = (tutor_id) =>
  API.get(`/api/users/bytutor/${tutor_id}`); // Removed trailing slash
export const addUser = (user) => API.post("/api/users", user); // Removed trailing slash
export const updateUser = (id, user) => API.put(`/api/users/${id}`, user); // Removed trailing slash
export const softDeleteUser = (id) => API.delete(`/api/users/${id}`); // Removed trailing slash
export const assignParent = (data) =>
  API.post("/api/users/assign-parent", data); // New endpoint
export const assignStudent = (data) =>
  API.post("/api/users/assign-student", data); // New endpoint

// Tutor endpoints
export const assignStudents = (data) =>
  API.post("/api/tutors/assign-students", data);

// Assignment endpoints
export const createAssignment = (assignment) =>
  API.post("/api/assignments", assignment); // Removed trailing slash
export const getAssignments = (studentId) =>
  API.get("/api/assignments", { params: { student_id: studentId } }); // Removed trailing slash
export const submitAssignment = (id) =>
  API.put(`/api/assignments/submit/${id}`); // Removed trailing slash

// Question endpoints
export const getQuestions = () => API.get("/api/questions"); // Removed trailing slash
export const getQuestionById = (id) => API.get(`/api/questions/${id}`); // Removed trailing slash
export const addQuestion = (question) => API.post("/api/questions", question); // Removed trailing slash

// Knowledge point endpoints
export const getKnowledgePoints = (params = {}) =>
  API.get("/api/knowledge-points", { params }); // Removed trailing slash
export const addKnowledgePoint = (knowledgePoint) =>
  API.post("/api/knowledge-points", knowledgePoint); // Removed trailing slash
export const updateKnowledgePoint = (id, knowledgePoint) =>
  API.put(`/api/knowledge-points/${id}`, knowledgePoint); // Removed trailing slash
export const deleteKnowledgePoint = (id) =>
  API.delete(`/api/knowledge-points/${id}`); // Removed trailing slash

// Answer endpoints
export const addAnswer = (answer) => API.post("/api/answers", answer); // Removed trailing slash
export const evaluateAnswer = (prompt) => API.post("/api/ai/grok", { prompt }); // Removed trailing slash
export const saveAnswer = (questionId, answer, isCorrect) =>
  API.post("/api/answers", { questionId, answer, isCorrect }); // Removed trailing slash
export const getAnswers = (studentId) =>
  API.get(`/api/answers${studentId ? `?student_id=${studentId}` : ""}`);

// Performance endpoints
export const performanceMetrics = (data) =>
  API.post("/api/students/performance-metrics", data); // Removed trailing slash
export const timeSpent = (data) => API.post("/api/students/time-spent", data); // Removed trailing slash

// AI APIs
export const analyzeStudent = (
  studentData,
  targetAudience = "student",
  language = "en"
) =>
  API.post("/api/ai/analyze-student", studentData, {
    params: { target_audience: targetAudience, language },
  }); // Removed trailing slash

// Classroom endpoints
export const getClassrooms = () => API.get("/api/classrooms"); // Removed trailing slash
export const createClassroom = (classroom) =>
  API.post("/api/classrooms", classroom); // Removed trailing slash
export const updateClassroom = (id, classroom) =>
  API.put(`/api/classrooms/${id}`, classroom); // Removed trailing slash
export const deleteClassroom = (id) => API.delete(`/api/classrooms/${id}`); // Removed trailing slash

// Manager endpoints
export const assignManager = (manager) => API.post("/api/managers", manager); // Removed trailing slash
export const removeManager = (manager) =>
  API.delete("/api/managers", { data: manager }); // Removed trailing slash
export const getManagerAssignments = () => API.get("/api/managers"); // Removed trailing slash

// Course endpoints
export const getCourses = () => API.get("/api/courses"); // Removed trailing slash
export const createCourse = (course) => API.post("/api/courses", course); // Removed trailing slash
export const updateCourse = (id, course) =>
  API.put(`/api/courses/${id}`, course); // Removed trailing slash
export const deleteCourse = (id) => API.delete(`/api/courses/${id}`); // Removed trailing slash

// Verify Answer
export const verifyAnswer = (testAnswer) =>
  API.post("/api/verify-answer", testAnswer); // Removed trailing slash

// Generate Question
export const generateQuestion = (criteria) =>
  API.post("/api/generate-question", criteria, {
    transformResponse: (data) => {
      const result = JSON.parse(data);
      return result;
    },
  }); // Removed trailing slash

export { API };
export default API;
