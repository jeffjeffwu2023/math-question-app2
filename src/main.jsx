// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import { QuestionProvider } from "./context/QuestionContext";
import { StudentAnswerProvider } from "./context/StudentAnswerContext";
import { StudentProvider } from "./context/StudentContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import AddQuestion from "./components/AddQuestion";
import CategoryManagement from "./components/CategoryManagement";
import ListQuestions from "./components/ListQuestions";
import AnswerOneByOne from "./components/AnswerOneByOne";
import AnswerHomework from "./components/AnswerHomework";
import AssignHomework from "./components/AssignHomework";
import StudentManagement from "./components/StudentManagement";
import StudentDashboard from "./components/StudentDashboard";
import StudentLogin from "./components/StudentLogin";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import PerformanceAnalysis from "./components/PerformanceAnalysis";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <CategoryProvider>
      <QuestionProvider>
        <StudentAnswerProvider>
          <StudentProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                {/* Student Routes */}
                <Route
                  path="/student-dashboard"
                  element={
                    <ProtectedRoute allowedRole="student">
                      <StudentDashboard />
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
                  path="/answer-homework/:assignmentId"
                  element={
                    <ProtectedRoute allowedRole="student">
                      <AnswerHomework />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance-analysis"
                  element={
                    <ProtectedRoute allowedRole="student">
                      <PerformanceAnalysis />
                    </ProtectedRoute>
                  }
                />
                {/* Admin Routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <AdminDashboard />
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
                  path="/list-questions"
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <ListQuestions />
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
                  path="/assign-homework"
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <AssignHomework />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student-management"
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <StudentManagement />
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
            </AuthProvider>
          </StudentProvider>
        </StudentAnswerProvider>
      </QuestionProvider>
    </CategoryProvider>
  </Router>
);
