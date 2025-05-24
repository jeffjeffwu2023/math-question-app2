// src/components/StudentDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStudentAnswers } from "../context/StudentAnswerContext";
import { useStudents } from "../context/StudentContext";
import { ClipLoader } from "react-spinners";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const { assignments } = useStudentAnswers();
  const { students, loading } = useStudents();

  const loggedInStudentId = user ? user.id : null;
  const studentName = user ? user.name : "Student"; // Use user.name directly
  const studentAssignments = assignments.filter(
    (assignment) => assignment.studentId === loggedInStudentId
  );

  // Debug logs
  console.log("StudentDashboard - Logged-in student ID:", loggedInStudentId);
  console.log("StudentDashboard - All assignments:", assignments);
  console.log(
    "StudentDashboard - Filtered student assignments:",
    studentAssignments
  );
  console.log("StudentDashboard - Students:", students);
  console.log("StudentDashboard - Loading students:", loading);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
          <p className="text-red-600 text-body-md text-center">
            Please log in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Welcome, {studentName}!
        </h1>
        <div className="mb-6 text-center">
          <button
            onClick={handleLogout}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <div>
            <h2 className="text-subheading font-semibold text-gray-800 mb-4">
              Your Homework Assignments
            </h2>
            {studentAssignments.length === 0 ? (
              <p className="text-gray-600 text-body-md">
                No assignments available. Check back later!
              </p>
            ) : (
              <ul className="space-y-4">
                {studentAssignments.map((assignment) => (
                  <li
                    key={assignment.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-subheading font-semibold text-gray-800 mb-2">
                          Assignment #{assignment.id}
                        </h3>
                        <p className="text-body-md text-gray-600">
                          <span className="font-medium">Questions:</span>{" "}
                          {assignment.questionIndices.length}
                        </p>
                        <p className="text-body-md text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          {assignment.submitted ? "Submitted" : "Not Submitted"}
                        </p>
                      </div>
                      <Link
                        to={`/answer-homework/${assignment.id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                        aria-label={`Answer Assignment ${assignment.id}`}
                      >
                        {assignment.submitted
                          ? "View Submission"
                          : "Start Answering"}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 text-center">
              <Link
                to="/performance-analysis"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-200 text-body-md"
                aria-label="View Performance Analysis"
              >
                View Performance Analysis
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
