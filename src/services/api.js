import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:8000",
  timeout: 30000,
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
export const getUsers = (filters = {}) =>
  API.get("/api/users/", { params: filters });
export const getUsersByTutor = (tutor_id) => API.get(`/api/users/bytutor/${tutor_id}`);
export const addUser = (user) => API.post("/api/users/", user);
export const updateUser = (id, user) => API.put(`/api/users/${id}/`, user);
export const deleteUser = (id) => API.delete(`/api/users/${id}/`);

// Tutor endpoints
export const assignStudents = (data) =>
  API.post("/api/tutors/assign-students", data);

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

// Knowledge point endpoints
export const getKnowledgePoints = (params = {}) =>
  API.get("/api/knowledge-points/", { params });
export const addKnowledgePoint = (knowledgePoint) =>
  API.post("/api/knowledge-points/", knowledgePoint);
export const updateKnowledgePoint = (id, knowledgePoint) =>
  API.put(`/api/knowledge-points/${id}/`, knowledgePoint);
export const deleteKnowledgePoint = (id) =>
  API.delete(`/api/knowledge-points/${id}/`);

// Answer endpoints
export const addAnswer = (answer) => API.post("/api/answers/", answer);
export const evaluateAnswer = (prompt) => API.post("/api/ai/grok/", { prompt });
export const saveAnswer = (questionId, answer, isCorrect) =>
  API.post("/api/answers/", { questionId, answer, isCorrect });
export const getAnswers = (studentId) =>
  API.get(`/api/answers/${studentId ? `?student_id=${studentId}` : ""}`);


// AI APIs
//export const evaluateAnswer = (prompt) => API.post("/api/ai/grok/", { prompt });
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
  export const timeSpent = (data) =>
    API.post("/api/students/time-spent/", data);

// Performance endpoints
//export const analyzeStudent = (studentId) =>
//  API.get(`/api/performance/${studentId}/`);

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

// Course endpoints
export const getCourses = () => API.get("/api/courses/");
export const createCourse = (course) => API.post("/api/courses/", course);
export const updateCourse = (id, course) =>
  API.put(`/api/courses/${id}/`, course);
export const deleteCourse = (id) => API.delete(`/api/courses/${id}/`);

export { API };
export default API;
