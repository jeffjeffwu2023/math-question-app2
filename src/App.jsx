import { Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import AddQuestion from "./components/AddQuestion";
import UserManagement from "./components/UserManagement";
import TutorManagement from "./components/TutorManagement";
import CourseManagement from "./components/CourseManagement";
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
import AddTutor from "./components/AddTutor"; // New component
import AssignStudents from "./components/AssignStudents"; // Placeholder or new component

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
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
          path="/admin/add-question"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tutor-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <TutorManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tutor-management/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddTutor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tutor-management/assign"
          element={
            <ProtectedRoute allowedRole="admin">
              <AssignStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRole="admin">
              <CourseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/knowledge-points"
          element={
            <ProtectedRoute allowedRole="admin">
              <KnowledgePointManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classroom-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <ClassroomManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manager-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManagerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classroom-chart"
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
          path="/assign-homework/review"
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
