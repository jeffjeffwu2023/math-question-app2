// src/components/PerformanceAnalysis.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAnswers,
  getAssignments,
  analyzeStudent,
  performanceMetrics,
  timeSpent,
} from "../services/api";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";

function PerformanceAnalysis() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!user) {
        setError("Please log in to view performance analysis.");
        showToast("Please log in to view performance analysis.", "error");
        return;
      }
      setLoading(true);
      try {
        const answersResponse = await getAnswers(user.id);
        const answers = answersResponse.data;
        console.log("Fetched answers:", answers);

        if (answers.length === 0) {
          setError(
            "No answers submitted yet. Please answer some questions to view your performance analysis."
          );
          showToast("No answers submitted yet.", "info");
          return;
        }

        const metricsResponse = await performanceMetrics({ answers });
        console.log("Performance metrics:", metricsResponse.data);
        const assignmentsResponse = await getAssignments(user.id);
        console.log("Fetched assignments:", assignmentsResponse.data);
        const timeSpentResponse = await timeSpent({ answers });
        console.log("Time spent:", timeSpentResponse.data);

        const studentData = {
          studentId: user.id,
          name: user.name,
          answers,
          ...metricsResponse.data,
          assignments: assignmentsResponse.data,
          timeSpent: timeSpentResponse.data,
        };

        // Use the user's language preference, default to "en" if not set
        const userLanguage = user.language || "en";
        const analysisResponse = await analyzeStudent(
          studentData,
          "student",
          userLanguage
        );
        const fetchedAnalysis = analysisResponse.data.analysis;
        console.log("Grok analysis:", fetchedAnalysis);
        if (!fetchedAnalysis) {
          setError(
            "No analysis available. Please submit more answers to generate a detailed analysis."
          );
          showToast("No analysis available.", "info");
          return;
        }
        setAnalysis(fetchedAnalysis);
      } catch (err) {
        if (err.response?.status === 500) {
          setError(
            "Server error: Failed to compute performance metrics. Please ensure all answers include category and difficulty information."
          );
          showToast(
            "Server error: Failed to compute performance metrics.",
            "error"
          );
        } else if (err.response && err.response.status === 0) {
          setError(
            "CORS error: Unable to communicate with the server. Please check your network or server configuration."
          );
          showToast(
            "CORS error: Unable to communicate with the server.",
            "error"
          );
        } else {
          setError("Failed to load performance analysis.");
          showToast("Failed to load performance analysis.", "error");
        }
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Performance Analysis
        </h1>
        <div className="mb-6">
          <Link
            to="/student-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </Link>
        </div>
        {error && (
          <p className="text-red-600 text-body-md text-center mb-4">{error}</p>
        )}
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border rounded-lg min-h-[120px] shadow-sm">
            <p className="text-body-md text-gray-600 whitespace-pre-line">
              {analysis || "No analysis available yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerformanceAnalysis;
