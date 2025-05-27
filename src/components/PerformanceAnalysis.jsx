// src/components/PerformanceAnalysis.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analyzeStudent } from "../services/api";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";

function PerformanceAnalysis() {
  const { user } = useAuth();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const response = await analyzeStudent(user.id);
        setPerformance(response.data);
      } catch (err) {
        console.error("Error fetching performance:", err);
        setError("Failed to load performance data.");
        showToast("Failed to load performance data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [user.id]);

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <p className="text-red-600 text-body-md text-center">
            Please log in as a student to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Performance Analysis
        </h1>
        <div className="mb-6 text-center">
          <Link
            to="/student-dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Back to Dashboard"
          >
            Back to Dashboard
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : error ? (
          <p className="text-red-600 text-body-md text-center">{error}</p>
        ) : performance ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-subheading font-semibold text-gray-800 mb-2">
                Overall Performance
              </h2>
              <p className="text-body-md text-gray-600">
                <span className="font-medium">Total Answers:</span>{" "}
                {performance.totalAnswers}
              </p>
              <p className="text-body-md text-gray-600">
                <span className="font-medium">Total Attempts:</span>{" "}
                {performance.performanceData.totalAttempts}
              </p>
              <p className="text-body-md text-gray-600">
                <span className="font-medium">Total Correct:</span>{" "}
                {performance.performanceData.totalCorrect}
              </p>
              <p className="text-body-md text-gray-600">
                <span className="font-medium">Accuracy:</span>{" "}
                {(
                  (performance.performanceData.totalCorrect /
                    performance.performanceData.totalAttempts) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
            <div>
              <h2 className="text-subheading font-semibold text-gray-800 mb-2">
                Category Breakdown
              </h2>
              {Object.keys(performance.categoryMetrics).length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  No category data available.
                </p>
              ) : (
                <ul className="space-y-2">
                  {Object.entries(performance.categoryMetrics).map(
                    ([category, metrics]) => (
                      <li
                        key={category}
                        className="p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                      >
                        <p className="text-body-md font-medium text-gray-800">
                          {category}
                        </p>
                        <p className="text-body-md text-gray-600">
                          Correct: {metrics.correct}/{metrics.total}
                        </p>
                        <p className="text-body-md text-gray-600">
                          Accuracy: {metrics.accuracy.toFixed(2)}%
                        </p>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-body-md text-center">
            No performance data available.
          </p>
        )}
      </div>
    </div>
  );
}

export default PerformanceAnalysis;
