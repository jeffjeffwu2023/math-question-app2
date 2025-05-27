// frontend/src/i18n.js
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome, {{name}}!",
          assignments: "Your Homework Assignments",
          no_assignments: "No assignments available. Check back later!",
          please_login: "Please log in to view this page.",
          logout: "Logout",
          classroom: "Classroom",
          tutor: "Tutor",
          questions: "Questions",
          status: "Status",
          submitted: "Submitted",
          not_submitted: "Not Submitted",
          view_submission: "View Submission",
          start_answering: "Start Answering",
          view_performance: "View Performance Analysis",
        },
      },
      zh: {
        translation: {
          welcome: "欢迎，{{name}}！",
          assignments: "您的作业",
          no_assignments: "暂无作业，请稍后查看！",
          please_login: "请登录以查看此页面。",
          logout: "退出",
          classroom: "教室",
          tutor: "导师",
          questions: "问题",
          status: "状态",
          submitted: "已提交",
          not_submitted: "未提交",
          view_submission: "查看提交",
          start_answering: "开始答题",
          view_performance: "查看表现分析",
        },
      },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18next;
