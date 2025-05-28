// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { KnowledgePointProvider } from "./context/KnowledgePointContext";
import { QuestionProvider } from "./context/QuestionContext";
import { StudentAnswerProvider } from "./context/StudentAnswerContext";
import { ClassroomProvider } from "./context/ClassroomContext";
import App from "./App";
import "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <UserProvider>
        <KnowledgePointProvider>
          <QuestionProvider>
            <StudentAnswerProvider>
              <ClassroomProvider>
                <App />
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
      </UserProvider>
    </AuthProvider>
  </Router>
);
