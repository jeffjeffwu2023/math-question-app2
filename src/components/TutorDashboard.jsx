// frontend/src/components/TutorDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStudentAnswers } from "../context/StudentAnswerContext";
import { useUsers } from "../context/UserContext";
import { useClassrooms } from "../context/ClassroomContext";
import { ClipLoader } from "react-spinners";

function TutorDashboard() {
  const { user, logout } = useAuth();
  const { assignments } = useStudentAnswers();
  const { users, loading } = useUsers();
  const { classrooms } = useClassrooms();

  const tutorAssignments = assignments.filter(
    (assignment) => assignment.tutorId === user?.id
  );
  const tutorStudents = users.filter((student) =>
    user?.studentIds?.includes(student.id)
  );

  if (!user || user.role !== "tutor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            Please log in as a tutor to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-8">
          Welcome, {user.name}!
        </h1>
        <div className="mb-6 text-center">
          <button
            onClick={logout}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md"
          >
            Logout
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={50} />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-subheading font-semibold text-gray-800 mb-4">
                Your Students
              </h2>
              {tutorStudents.length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  No students assigned.
                </p>
              ) : (
                <ul className="space-y-4">
                  {tutorStudents.map((student) => (
                    <li
                      key={student.id}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">Name:</span>{" "}
                        {student.name}
                      </p>
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">ID:</span> {student.id}
                      </p>
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">Classroom:</span>{" "}
                        {classrooms.find((c) =>
                          student.classroomIds?.includes(c.id)
                        )?.name || "None"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h2 className="text-subheading font-semibold text-gray-800 mb-4">
                Assigned Homework
              </h2>
              {tutorAssignments.length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  No assignments created.
                </p>
              ) : (
                <ul className="space-y-4">
                  {tutorAssignments.map((assignment) => (
                    <li
                      key={assignment.id}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">Assignment #:</span>{" "}
                        {assignment.id}
                      </p>
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">Student:</span>{" "}
                        {tutorStudents.find(
                          (s) => s.id === assignment.studentId
                        )?.name || assignment.studentId}
                      </p>
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">Status:</span>{" "}
                        {assignment.submitted ? "Submitted" : "Not Submitted"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/assign-homework"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-body-md"
              >
                Assign Homework
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TutorDashboard;
