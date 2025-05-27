import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CategoryProvider } from "./context/CategoryContext";
import { KnowledgePointProvider } from "./context/KnowledgePointContext";
import { QuestionProvider } from "./context/QuestionContext";
import { StudentAnswerProvider } from "./context/StudentAnswerContext";
import { ClassroomProvider } from "./context/ClassroomContext";
import ProtectedRoute from "./components/ProtectedRoute";
import App from "./App";
import AdminLogin from "./components/AdminLogin";
import StudentLogin from "./components/StudentLogin";
import ParentLogin from "./components/ParentLogin";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import TutorDashboard from "./components/TutorDashboard";
import ParentDashboard from "./components/ParentDashboard";
import AddQuestion from "./components/AddQuestion";
import AssignHomework from "./components/AssignHomework";
import AnswerHomework from "./components/AnswerHomework";
import AnswerOneByOne from "./components/AnswerOneByOne";
import PerformanceAnalysis from "./components/PerformanceAnalysis";
import UserManagement from "./components/UserManagement";
import ClassroomManagement from "./components/ClassroomManagement";
import CategoryManagement from "./components/CategoryManagement";
import ManagerManagement from "./components/ManagerManagement";
import ClassroomChart from "./components/ClassroomChart";
import "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <UserProvider>
        <CategoryProvider>
          <KnowledgePointProvider>
            <QuestionProvider>
              <StudentAnswerProvider>
                <ClassroomProvider>
                  <Routes>
                    <Route path="*" element={<App />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/student-login" element={<StudentLogin />} />
                    <Route path="/parent-login" element={<ParentLogin />} />
                    <Route path="/tutor-login" element={<StudentLogin />} />
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student-dashboard"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <StudentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tutor-dashboard"
                      element={
                        <ProtectedRoute allowedRole="tutor">
                          <TutorDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/parent-dashboard"
                      element={
                        <ProtectedRoute allowedRole="parent">
                          <ParentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/add-question"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <AddQuestion />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/assign-homework"
                      element={
                        <ProtectedRoute allowedRole={["admin", "tutor"]}>
                          <AssignHomework />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/answer-homework/:assignmentId"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <AnswerHomework />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/answer-one-by-one"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <AnswerOneByOne />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/performance-analysis"
                      element={
                        <ProtectedRoute allowedRole={["student", "parent"]}>
                          <PerformanceAnalysis />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/user-management"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/classroom-management"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <ClassroomManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/category-management"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <CategoryManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/manager-management"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <ManagerManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/classroom-chart"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <ClassroomChart />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </ClassroomProvider>
              </StudentAnswerProvider>
            </QuestionProvider>
          </KnowledgePointProvider>
        </CategoryProvider>
      </UserProvider>
    </AuthProvider>
  </Router>
);
