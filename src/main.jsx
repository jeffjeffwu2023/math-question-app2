// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { QuestionProvider } from "./context/QuestionContext.jsx";
import App from "./App.jsx";
import AddQuestion from "./components/AddQuestion.jsx";
import CategoryManagement from "./components/CategoryManagement.jsx";
import ListQuestions from "./components/ListQuestions.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <CategoryProvider>
      <QuestionProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/add-question" element={<AddQuestion />} />
          <Route path="/list-questions" element={<ListQuestions />} />
          <Route path="/category-management" element={<CategoryManagement />} />
        </Routes>
      </QuestionProvider>
    </CategoryProvider>
  </Router>
);
