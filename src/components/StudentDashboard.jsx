// src/components/StudentDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useStudentAnswers } from "../context/StudentAnswerContext.jsx";
import { useStudents } from "../context/StudentContext.jsx";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const { assignments } = useStudentAnswers();
  const { students } = useStudents();

  // Use the logged-in user's ID
  const loggedInStudentId = user ? user.id : "student123";
  const student = students.find((s) => s.id === loggedInStudentId);
  const studentName = student ? student.name : "Student";

  // Filter assignments for the logged-in student
  const studentAssignments = assignments.filter(
    (assignment) => assignment.studentId === loggedInStudentId
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-heading-lg sm:text-heading-lg font-extrabold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
          Welcome, {studentName}!
        </h1>

        {/* Logout Button */}
        <div className="mb-6 text-center">
          <button
            onClick={handleLogout}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-body-md"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

        {/* Assignments List */}
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
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
