// src/components/ParentDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import { useStudentAnswers } from "../context/StudentAnswerContext";
import { ClipLoader } from "react-spinners";
import { showToast } from "../utils/toast";
import { analyzeStudent } from "../services/api";

function ParentDashboard() {
  const { user, logout } = useAuth();
  const { users, loading } = useUsers();
  const { assignments } = useStudentAnswers();
  const [analysis, setAnalysis] = useState({});

  const children = users.filter((u) => user?.studentIds?.includes(u.id));
  const childAssignments = assignments.filter((a) =>
    user?.studentIds?.includes(a.studentId)
  );

  const fetchAnalysis = async (childId) => {
    try {
      const childData = {
        studentId: childId,
        name: users.find((u) => u.id === childId)?.name,
        answers: (await API.get(`/api/answers/?student_id=${childId}`)).data,
        assignments: childAssignments.filter((a) => a.studentId === childId),
      };
      const response = await analyzeStudent(childData, "parent", user.language);
      setAnalysis((prev) => ({
        ...prev,
        [childId]: response.data.analysis,
      }));
    } catch (error) {
      showToast("Failed to load analysis.", "error");
    }
  };

  if (!user || user.role !== "parent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            Please log in as a parent to view this page.
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
                Your Children
              </h2>
              {children.length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  No children assigned.
                </p>
              ) : (
                <ul className="space-y-4">
                  {children.map((child) => (
                    <li
                      key={child.id}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">Name:</span> {child.name}
                      </p>
                      <p className="text-body-md text-gray-800">
                        <span className="font-medium">ID:</span> {child.id}
                      </p>
                      <button
                        onClick={() => fetchAnalysis(child.id)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-body-md"
                      >
                        View Performance Analysis
                      </button>
                      {analysis[child.id] && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                          <p className="text-body-md text-gray-600 whitespace-pre-line">
                            {analysis[child.id]}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h2 className="text-subheading font-semibold text-gray-800 mb-4">
                Assignments
              </h2>
              {childAssignments.length === 0 ? (
                <p className="text-gray-600 text-body-md">
                  No assignments available.
                </p>
              ) : (
                <ul className="space-y-4">
                  {childAssignments.map((assignment) => (
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
                        {
                          children.find((c) => c.id === assignment.studentId)
                            ?.name
                        }
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
          </>
        )}
      </div>
    </div>
  );
}

export default ParentDashboard;
