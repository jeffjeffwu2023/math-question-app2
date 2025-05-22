// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { QuestionProvider } from "./context/QuestionContext.jsx";
import { StudentAnswerProvider } from "./context/StudentAnswerContext.jsx";
import { StudentProvider } from "./context/StudentContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import App from "./App.jsx";
import AddQuestion from "./components/AddQuestion.jsx";
import CategoryManagement from "./components/CategoryManagement.jsx";
import ListQuestions from "./components/ListQuestions.jsx";
import AnswerOneByOne from "./components/AnswerOneByOne.jsx";
import AnswerHomework from "./components/AnswerHomework.jsx";
import AssignHomework from "./components/AssignHomework.jsx";
import StudentManagement from "./components/StudentManagement.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import StudentLogin from "./components/StudentLogin.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
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
            </AuthProvider>
          </StudentProvider>
        </StudentAnswerProvider>
      </QuestionProvider>
    </CategoryProvider>
  </Router>
);
