import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useTranslation } from "react-i18next";
import {
  getUsersByTutor,
  getQuestions,
  createAssignment,
} from "../services/api";
import { showToast } from "../utils/toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";
import Navigation from "./Navigation"; // Updated path

const AssignHomework = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Added to read pathname and state
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]); // Assume classes are fetched or predefined
  const [selectedClasses, setSelectedClasses] = useState([]); // Array for multiple selection
  const [includedStudents, setIncludedStudents] = useState({});
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    studentIds: [],
    questionIds: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Students, 2: Questions, 3: Review
  const [loadingReview, setLoadingReview] = useState(false); // Loading state for review
  const [renderTrigger, setRenderTrigger] = useState(0); // Trigger re-render on data update
  const observer = useRef();

  // Fetch classes (mock implementation, replace with API call if needed)
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        console.log("Fetching classes for user:", user);
        // Assume an API call to get classes, e.g., getClassesByTutor(user.id)
        const mockClasses = [
          { id: "class1", name: "Class A" },
          { id: "class2", name: "Class B" },
          { id: "class3", name: "Class C" },
          { id: "class4", name: "Class D" },
          { id: "class5", name: "Class E" },
          { id: "class6", name: "Class F" },
        ];
        setClasses(mockClasses);
        console.log("Classes fetched:", mockClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError(t("failed_to_fetch_classes"));
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchClasses();
    }
  }, [user, t]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching data with classIds:", selectedClasses);
        const [studentRes, questionRes] = await Promise.all([
          getUsersByTutor(
            user.id,
            selectedClasses.length > 0 ? { classIds: selectedClasses } : {}
          ),
          getQuestions({ offset, limit: 10, search: searchTerm }),
        ]);
        console.log("Students fetched:", studentRes.data);
        // Deduplicate students by ID
        const uniqueStudents = studentRes.data.reduce((acc, student) => {
          acc[student.id] = student;
          return acc;
        }, {});
        setStudents(Object.values(uniqueStudents));
        setQuestions((prev) => [...prev, ...questionRes.data]);
        setHasMore(questionRes.data.length === 10);
        setOffset((prev) => prev + questionRes.data.length);
      } catch (error) {
        showToast(t("failed_to_fetch_data"), "error");
        console.error("Error fetching data:", error);
        setError(t("failed_to_fetch_data"));
      } finally {
        setLoading(false);
      }
    };
    if (
      user &&
      user.role === "tutor" &&
      hasMore &&
      (currentStep === 1 || currentStep === 2)
    ) {
      fetchData();
    }
  }, [t, user, searchTerm, offset, hasMore, selectedClasses, currentStep]);

  useEffect(() => {
    // Refetch data specifically for review page
    const fetchReviewData = async () => {
      if (currentStep === 3 && user && user.role === "tutor") {
        setLoadingReview(true);
        try {
          console.log("Fetching review data with classIds:", selectedClasses);
          const [studentRes, questionRes] = await Promise.all([
            getUsersByTutor(
              user.id,
              selectedClasses.length > 0 ? { classIds: selectedClasses } : {}
            ),
            getQuestions({ offset: 0, limit: 100, search: "" }), // Fetch all questions for review
          ]);
          console.log("Raw review students:", studentRes.data);
          console.log("Raw review questions:", questionRes.data);
          const uniqueStudents = studentRes.data.reduce((acc, student) => {
            acc[student.id] = student;
            return acc;
          }, {});
          setStudents((prev) => {
            const newStudents = Object.values(uniqueStudents);
            console.log(
              "Setting students with IDs:",
              newStudents.map((s) => s.id)
            );
            return newStudents;
          });
          setQuestions((prev) => {
            console.log(
              "Setting questions with IDs:",
              questionRes.data.map((q) => q.id)
            );
            return questionRes.data;
          });
          setRenderTrigger((prev) => prev + 1); // Trigger re-render
        } catch (error) {
          showToast(t("failed_to_fetch_review_data"), "error");
          console.error("Error fetching review data:", error);
        } finally {
          setLoadingReview(false);
        }
      }
    };
    fetchReviewData();
  }, [currentStep, user, t, selectedClasses]);

  useEffect(() => {
    // Re-render review page when students or questions update
    if (currentStep === 3 && students.length > 0 && questions.length > 0) {
      console.log(
        "Re-rendering review with students:",
        students.map((s) => s.id),
        "questions:",
        questions.map((q) => q.id)
      );
      setRenderTrigger((prev) => prev + 1); // Force re-render
    }
  }, [students, questions, currentStep]);

  useEffect(() => {
    // Set currentStep based on state, falling back to pathname, and restore formData
    const state = location.state;
    console.log(
      "Location state:",
      state,
      "Pathname:",
      location.pathname,
      "Current step before update:",
      currentStep,
      "Current formData:",
      formData
    );
    if (state?.currentStep) {
      setCurrentStep(state.currentStep);
      console.log("Set currentStep from state:", state.currentStep);
      if (state.formData) {
        setFormData((prev) => ({
          ...prev,
          studentIds: state.formData.studentIds || prev.studentIds,
          questionIds: state.formData.questionIds || prev.questionIds,
        }));
        console.log("Restored formData from state:", state.formData);
      }
    } else if (location.pathname === "/assign-homework" && !state) {
      setCurrentStep(1); // Reset to Step 1 only on initial load without state
    } else if (
      location.pathname === "/assign-homework/review" &&
      !state?.currentStep
    ) {
      console.log(
        "No state.currentStep for /review, defaulting to 3 with existing formData"
      );
      setCurrentStep(3); // Default to 3 for /review, preserving current formData
    }
  }, [location.pathname, location.state]);

  useEffect(() => {
    // Persist currentStep on change to prevent reset
    console.log("Current step changed to:", currentStep);
  }, [currentStep]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setOffset((prev) => prev + 10);
        }
      },
      { threshold: 1.0 }
    );

    const currentObserver = observer.current;
    const target = document.querySelector("#load-more-target");
    if (target) currentObserver.observe(target);

    return () => currentObserver.disconnect();
  }, [hasMore, loading]);

  const handleClassDoubleClick = (classId) => {
    if (!selectedClasses.includes(classId)) {
      setSelectedClasses([...selectedClasses, classId]);
      setIncludedStudents({}); // Reset inclusion on class change
    }
  };

  const handleRemoveSelectedClass = (classId) => {
    setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    setIncludedStudents({}); // Reset inclusion on class change
  };

  const handleStudentToggle = (studentId) => {
    console.log(
      "Toggling student:",
      studentId,
      "Current formData:",
      formData,
      "Students:",
      students
    );
    setIncludedStudents((prev) => {
      const newIncluded = { ...prev, [studentId]: !prev[studentId] };
      const selectedIds = students
        .filter((s) => newIncluded[s.id] === true) // Only include when explicitly true
        .map((s) => s.id);
      setFormData((prev) => ({ ...prev, studentIds: selectedIds }));
      console.log("Updated formData.studentIds:", selectedIds);
      return newIncluded;
    });
  };

  const handleSelectAll = () => {
    const allStudentIds = students.map((s) => s.id);
    setFormData((prev) => ({ ...prev, studentIds: allStudentIds }));
    const newIncludedStudents = students.reduce(
      (acc, s) => ({ ...acc, [s.id]: true }),
      {}
    );
    setIncludedStudents(newIncludedStudents);
    setRenderTrigger((prev) => prev + 1); // Force re-render to sync checkboxes
    console.log(
      "Selected all students, new includedStudents:",
      newIncludedStudents
    );
  };

  const handleDeselectAll = () => {
    setFormData((prev) => ({ ...prev, studentIds: [] }));
    setIncludedStudents({});
    setRenderTrigger((prev) => prev + 1); // Force re-render to sync checkboxes
    console.log("Deselected all students, includedStudents cleared");
  };

  const handleQuestionSelect = (questionId) => {
    console.log(
      "Toggling question:",
      questionId,
      "Current formData:",
      formData,
      "Questions:",
      questions,
      "Checkbox event triggered"
    );
    setFormData((prev) => {
      const currentQuestionIds = [...prev.questionIds]; // Create a new array
      if (currentQuestionIds.includes(questionId)) {
        const updatedIds = currentQuestionIds.filter((id) => id !== questionId);
        console.log(
          "Removed questionId:",
          questionId,
          "New questionIds:",
          updatedIds
        );
        return { ...prev, questionIds: updatedIds };
      } else {
        const updatedIds = [...currentQuestionIds, questionId];
        console.log(
          "Added questionId:",
          questionId,
          "New questionIds:",
          updatedIds
        );
        return { ...prev, questionIds: updatedIds };
      }
    });
  };

  const handleNext = (e) => {
    if (e) e.preventDefault(); // Prevent form submission if called as onSubmit
    console.log(
      "Next clicked, currentStep:",
      currentStep,
      "formData:",
      formData,
      "Students:",
      students,
      "Questions:",
      questions
    );
    if (currentStep === 1 && formData.studentIds.length > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.questionIds.length > 0) {
      navigate("/assign-homework/review", {
        state: {
          currentStep: 3,
          formData: { ...formData }, // Persist formData in navigation state
        },
      });
    } else {
      console.log("Next disabled, no valid selection");
    }
  };

  const handleBack = () => {
    console.log("Back clicked, currentStep:", currentStep);
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      navigate("/assign-homework", { state: { currentStep: 2 } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting with formData:", formData);
    if (formData.studentIds.length === 0 || formData.questionIds.length === 0) {
      showToast(t("select_student_and_questions"), "error");
      return;
    }
    setLoading(true);
    try {
      await createAssignment({
        studentIds: formData.studentIds,
        questionIds: formData.questionIds,
      });
      showToast(t("assignment_created_successfully"), "success");
      navigate("/tutor-dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || t("failed_to_create_assignment");
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
    setQuestions([]);
    setHasMore(true);
  };

  const toggleExpand = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const shouldExpand = (segments) => {
    return (
      segments.length > 3 ||
      segments.some((s) => s.type === "latex" && s.value.length > 20)
    );
  };

  if (!user || user.role !== "tutor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
          <p className="text-red-600 text-body-md text-center">
            {t("please_login_tutor")}
          </p>
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      {currentStep === 1 && (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-4">
          <div className="bg-gray-100 p-2 rounded-lg shadow">
            <label className="block text-body-md font-medium text-gray-700 mb-2">
              {t("select_class")}
            </label>
            <div className="h-48 overflow-y-auto bg-white rounded shadow mb-2">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onDoubleClick={() => handleClassDoubleClick(cls.id)}
                >
                  {cls.name}
                </div>
              ))}
            </div>
            {selectedClasses.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedClasses.map((classId) => {
                  const cls = classes.find((c) => c.id === classId);
                  return (
                    cls && (
                      <span
                        key={classId}
                        className="bg-gray-200 p-1 rounded text-xs flex items-center"
                      >
                        {cls.name}
                        <button
                          onClick={() => handleRemoveSelectedClass(classId)}
                          className="ml-1 text-red-500 hover:text-red-700 text-xs"
                        >
                          ×
                        </button>
                      </span>
                    )
                  );
                })}
              </div>
            )}
            <details className="bg-gray-100 p-2 rounded shadow mt-2">
              <summary className="text-body-md font-medium text-gray-700">
                {t("students_under")} {user.name || "Tutor"}
              </summary>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 text-xs">
                {students.map((student) => (
                  <span
                    key={student.id}
                    className="p-1 bg-white rounded shadow"
                  >
                    {student.name}
                  </span>
                ))}
              </div>
            </details>
            <div className="flex justify-between mb-2 mt-4">
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors"
              >
                {t("select_all")}
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              >
                {t("deselect_all")}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
              {students.map((student) => (
                <label
                  key={student.id}
                  className="flex items-center p-1 bg-white rounded shadow hover:bg-indigo-50 text-xs transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={includedStudents[student.id] === true} // Only checked if explicitly true
                    onChange={() => handleStudentToggle(student.id)}
                    className="mr-1"
                  />
                  <span>{student.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleNext}
            className="fancy-button w-full mt-4"
            disabled={formData.studentIds.length === 0 || loading}
          >
            {t("next")}
          </button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-4">
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={t("search_questions")}
              className="w-full p-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {loading && questions.length === 0 ? (
            <div className="flex justify-center">
              <ClipLoader color="#2563eb" size={50} />
            </div>
          ) : (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="mb-4">
                <label className="block text-body-md font-medium text-gray-700">
                  {t("select_questions")}
                </label>
                <div className="preview flex flex-col gap-4 mb-4">
                  {questions.map((question) => {
                    const needsExpansion = shouldExpand(question.question);
                    console.log("Rendering question with id:", question.id); // Debug log for uniqueness
                    return (
                      <div
                        key={question.id}
                        className="flex items-start gap-4 w-full cursor-pointer"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={formData.questionIds.includes(question.id)}
                            onChange={() => handleQuestionSelect(question.id)}
                            className="mr-2"
                          />
                        </div>
                        <div
                          className={`flex-1 p-4 ${
                            expandedQuestion === question.id && needsExpansion
                              ? "flex-col"
                              : "line-clamp-3"
                          } preview border-2 border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors`}
                          onClick={() => toggleExpand(question.id)}
                        >
                          {question.question.map((segment, segIndex) => (
                            <>
                              {segment.type === "newline" && (
                                <p key={`newline-${segIndex}`}>
                                  <br />
                                </p>
                              )}
                              {segment.type === "latex" && (
                                <math-field
                                  key={`latex-${segIndex}`}
                                  readonly="true"
                                  virtual-keyboard-mode="off"
                                  value={
                                    segment.original_latex || segment.value
                                  }
                                  className="text-body-md text-gray-800"
                                ></math-field>
                              )}
                              {segment.type === "text" && (
                                <span
                                  key={`text-${segIndex}`}
                                  className="text-body-md text-gray-800"
                                >
                                  {segment.value}
                                </span>
                              )}
                            </>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {hasMore && <div id="load-more-target" />}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="fancy-button"
                  disabled={loading}
                >
                  {t("back")}
                </button>
                <button
                  type="button" // Change to button to prevent form submission
                  onClick={handleNext}
                  className="fancy-button"
                  disabled={formData.questionIds.length === 0 || loading}
                >
                  {t("review")}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      {currentStep === 3 && (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 mt-4">
          <h2 className="text-body-md font-medium text-gray-700 mb-4">
            {t("review_selections")}
          </h2>
          {loadingReview || students.length === 0 || questions.length === 0 ? (
            <div className="flex justify-center">
              <ClipLoader color="#2563eb" size={50} />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  {t("selected_students")}
                </h3>
                <ul className="list-disc list-inside text-sm">
                  {formData.studentIds.map((studentId) => {
                    const student = students.find((s) => s.id === studentId);
                    console.log(
                      "Reviewing student:",
                      studentId,
                      "Found:",
                      student,
                      "Students array IDs:",
                      students.map((s) => s.id)
                    );
                    return (
                      <li key={studentId}>
                        {student?.name || `Student ID: ${studentId}`}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  {t("selected_questions")}
                </h3>
                <ul className="list-disc list-inside text-sm">
                  {console.log(
                    "Reviewing questions:",
                    formData.questionIds,
                    "Questions array IDs:",
                    questions.map((q) => q.id)
                  )}
                  {formData.questionIds.map((questionId) => {
                    const question = questions.find((q) => q.id === questionId);
                    console.log(
                      "Reviewing question:",
                      questionId,
                      "Found:",
                      question,
                      "Questions array IDs:",
                      questions.map((q) => q.id)
                    );
                    return (
                      <li key={questionId}>
                        {question?.question[0]?.value ||
                          `Question ID: ${questionId}`}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="fancy-button"
                  disabled={loading}
                >
                  {t("back")}
                </button>
                <button
                  onClick={handleSubmit}
                  className="fancy-button"
                  disabled={loading}
                >
                  {t("confirm")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignHomework;
