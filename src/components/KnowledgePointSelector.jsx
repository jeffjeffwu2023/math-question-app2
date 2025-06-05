import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { showToast } from "../utils/toast";
import { useKnowledgePoints } from "../context/KnowledgePointContext";
import { FixedSizeList } from "react-window";

const KnowledgePointSelector = ({ selectedIds = [], onChange }) => {
  const { t } = useTranslation();
  const { knowledgePoints, loading, error } = useKnowledgePoints();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState(selectedIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGrade, setActiveGrade] = useState("");

  // Calculate grades before useEffect
  const grades = Array.isArray(knowledgePoints)
    ? [...new Set(knowledgePoints.map((kp) => kp.grade || "Unknown"))].sort((a, b) => {
        // Handle "Kindergarten" as a special case
        if (a === "Kindergarten") return 1; // Place Kindergarten last
        if (b === "Kindergarten") return -1;

        // Extract numeric part of grade (e.g., "Grade 12" -> 12)
        const gradeA = parseInt(a.match(/\d+/)[0], 10);
        const gradeB = parseInt(b.match(/\d+/)[0], 10);

        // Sort in descending order
        return gradeB - gradeA;
      })
    : [];
  const knowledgePointsByGrade = grades.reduce((acc, grade) => {
    acc[grade] = knowledgePoints.filter((kp) => (kp.grade || "Unknown") === grade);
    return acc;
  }, {});

  useEffect(() => {
    console.log("Knowledge points in selector:", knowledgePoints);
    console.log("Grades:", grades);
    console.log("Knowledge points by grade:", knowledgePointsByGrade);
    if (!activeGrade && grades.length > 0) {
      console.log("Setting initial active grade to:", grades[0]);
      setActiveGrade(grades[0]);
    }
  }, [knowledgePoints, grades]);

  const handleSearchChange = (e) => {
    console.log("Search input changed to:", e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (id) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    console.log("Confirm clicked with tempSelectedIds:", tempSelectedIds);
    if (tempSelectedIds.length === 0) {
      showToast(t("Please select at least one knowledge point"), "error", { toastId: "no-selection" });
      return;
    }
    onChange(tempSelectedIds);
    setIsModalOpen(false);
    showToast(t("Knowledge points selected"), "success", { toastId: "selection-success" });
  };

  const handleCancel = () => {
    setTempSelectedIds(selectedIds);
    setSearchQuery("");
    setIsModalOpen(false);
  };

  // Virtualized list item renderer
  const Row = useCallback(
    ({ index, style }) => {
      const kp = filteredKnowledgePoints[index];
      console.log(`Rendering row ${index} for knowledge point:`, kp.id);
      return (
        <label key={kp.id} className="flex items-center space-x-2 py-1" style={style}>
          <input
            type="checkbox"
            checked={tempSelectedIds.includes(kp.id)}
            onChange={() => handleCheckboxChange(kp.id)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <span>{`${kp.strand} - ${kp.topic} - ${kp.skill} - ${kp.subKnowledgePoint}`}</span>
        </label>
      );
    },
    [tempSelectedIds, handleCheckboxChange, activeGrade, searchQuery, knowledgePointsByGrade]
  );

  console.log("KnowledgePointSelector state: loading:", loading, "error:", error, "activeGrade:", activeGrade);

  if (loading) return <div>{t("Loading knowledge points...")}</div>;
  if (error) return <div>{t("Error loading knowledge points")}: {error}</div>;

  // Filter knowledge points with performance logging
  const start = performance.now();
  const filteredKnowledgePoints =
    activeGrade && knowledgePointsByGrade[activeGrade]
      ? knowledgePointsByGrade[activeGrade].filter((kp) =>
          `${kp.strand} ${kp.topic} ${kp.skill} ${kp.subKnowledgePoint}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : [];
  console.log(`Filtering took ${performance.now() - start}ms for ${filteredKnowledgePoints.length} items`);

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => {
          console.log("Opening modal");
          setIsModalOpen(true);
        }}
        className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        {t("Select Knowledge Points")}
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {console.log("Rendering modal with activeGrade:", activeGrade)}
          <div className="bg-white rounded-lg w-[90%] max-w-5xl h-[90%] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{t("Select Knowledge Points")}</h2>
              <button
                type="button"
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t("Search knowledge points...")}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="border-b">
                <nav className="flex space-x-4 px-4">
                  {grades.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        console.log("Switching to grade:", grade);
                        setActiveGrade(grade);
                      }}
                      className={`py-2 px-4 text-sm font-medium ${
                        activeGrade === grade
                          ? "border-b-2 border-indigo-600 text-indigo-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-4">
                {console.log("Rendering grade content: activeGrade:", activeGrade, "grades.length:", grades.length)}
                {grades.length === 0 ? (
                  <p>{t("No knowledge points available")}</p>
                ) : !activeGrade && grades.length > 0 ? (
                  <p>{t("Loading grade...")}</p>
                ) : knowledgePointsByGrade[activeGrade]?.length === 0 ? (
                  <p>{t("No knowledge points for this grade")}</p>
                ) : (
                  <FixedSizeList
                    height={500}
                    width="100%"
                    itemCount={filteredKnowledgePoints.length}
                    itemSize={35}
                  >
                    {Row}
                  </FixedSizeList>
                )}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {t("Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePointSelector;
