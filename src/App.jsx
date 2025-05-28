// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import StudentLogin from "./components/StudentLogin";
import AdminLogin from "./components/AdminLogin";
import ParentLogin from "./components/ParentLogin";
import AdminDashboard from "./components/AdminDashboard";
import AddQuestion from "./components/AddQuestion";
import UserManagement from "./components/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./components/StudentDashboard";
import AssignHomework from "./components/AssignHomework";
import AnswerHomework from "./components/AnswerHomework";
import AnswerOneByOne from "./components/AnswerOneByOne";
import PerformanceAnalysis from "./components/PerformanceAnalysis";
import ParentDashboard from "./components/ParentDashboard";
import TutorDashboard from "./components/TutorDashboard";
import ClassroomManagement from "./components/ClassroomManagement";
import KnowledgePointManagement from "./components/KnowledgePointManagement";
import ManagerManagement from "./components/ManagerManagement";
import ClassroomChart from "./components/ClassroomChart";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/parent-login" element={<ParentLogin />} />
        <Route path="/tutor-login" element={<StudentLogin />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
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
          path="/tutor-dashboard"
          element={
            <ProtectedRoute allowedRole="tutor">
              <TutorDashboard />
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
          path="/user-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge-points"
          element={
            <ProtectedRoute allowedRole="admin">
              <KnowledgePointManagement />
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
      </Routes>
    </I18nextProvider>
  );
}

export default App;
