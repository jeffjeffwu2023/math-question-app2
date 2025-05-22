// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { QuestionProvider } from "./context/QuestionContext.jsx";
import { StudentAnswerProvider } from "./context/StudentAnswerContext.jsx";
import { StudentProvider } from "./context/StudentContext.jsx";
import App from "./App.jsx";
import AddQuestion from "./components/AddQuestion.jsx";
import CategoryManagement from "./components/CategoryManagement.jsx";
import ListQuestions from "./components/ListQuestions.jsx";
import AnswerOneByOne from "./components/AnswerOneByOne.jsx";
import AnswerHomework from "./components/AnswerHomework.jsx";
import AssignHomework from "./components/AssignHomework.jsx";
import StudentManagement from "./components/StudentManagement.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <CategoryProvider>
      <QuestionProvider>
        <StudentAnswerProvider>
          <StudentProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/add-question" element={<AddQuestion />} />
              <Route path="/list-questions" element={<ListQuestions />} />
              <Route
                path="/category-management"
                element={<CategoryManagement />}
              />
              <Route path="/answer-one-by-one" element={<AnswerOneByOne />} />
              <Route
                path="/answer-homework/:assignmentId"
                element={<AnswerHomework />}
              />
              <Route path="/assign-homework" element={<AssignHomework />} />
              <Route
                path="/student-management"
                element={<StudentManagement />}
              />
            </Routes>
          </StudentProvider>
        </StudentAnswerProvider>
      </QuestionProvider>
    </CategoryProvider>
  </Router>
);
