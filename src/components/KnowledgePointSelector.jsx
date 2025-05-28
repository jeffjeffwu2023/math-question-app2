// src/components/KnowledgePointSelector.jsx
import React, { useState, useEffect } from "react";
import { getKnowledgePoints } from "../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const KnowledgePointSelector = ({ selectedPoints, setSelectedPoints }) => {
  const { t } = useTranslation();
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    grade: "",
    strand: "",
    topic: "",
    skill: "",
    version: "2025.01",
  });

  useEffect(() => {
    const fetchKnowledgePoints = async () => {
      setLoading(true);
      console.log("Fetching knowledge points with filters:", filters);
      try {
        const response = await getKnowledgePoints({ version: filters.version });
        console.log("Fetched knowledge points:", response.data);
        const dataWithIds = response.data.map((item) => ({
          ...item,
          _id: item.id,
        }));
        console.log("dataWithNewField:", dataWithIds);
        setKnowledgePoints(dataWithIds);
        localStorage.setItem("knowledgePoints", JSON.stringify(dataWithIds));
      } catch (error) {
        console.error("Failed to fetch knowledge points:", error);
        toast.error(t("failed_to_fetch_knowledge_points"), {
          toastId: "fetch-kp-error",
        });
        const cachedPoints = localStorage.getItem("knowledgePoints");
        if (cachedPoints && !navigator.onLine) {
          setKnowledgePoints(JSON.parse(cachedPoints));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledgePoints();
  }, [filters.version, t]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "grade" && { strand: "", topic: "", skill: "" }),
      ...(key === "strand" && { topic: "", skill: "" }),
      ...(key === "topic" && { skill: "" }),
    }));
  };

  const getUniqueValues = (key, filterKey = null, filterValue = null) => {
    return [
      ...new Set(
        knowledgePoints
          .filter((kp) => !filterKey || kp[filterKey] === filterValue)
          .map((kp) => kp[key])
      ),
    ].sort();
  };

  const toggleSelection = (pointId) => {
    console.log("Toggling point:", pointId);
    const newPoints = Array.isArray(selectedPoints)
      ? selectedPoints.includes(pointId)
        ? selectedPoints.filter((id) => id !== pointId)
        : [...selectedPoints, pointId]
      : [pointId];
    console.log("New selected points:", newPoints);
    setSelectedPoints(newPoints);
  };

  const filteredPoints = knowledgePoints.filter(
    (kp) =>
      (!filters.grade || kp.grade === filters.grade) &&
      (!filters.strand || kp.strand === filters.strand) &&
      (!filters.topic || kp.topic === filters.topic) &&
      (!filters.skill || kp.skill === filters.skill) &&
      kp.isActive
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <select
          value={filters.grade}
          onChange={(e) => handleFilterChange("grade", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">{t("select_grade")}</option>
          {getUniqueValues("grade").map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        <select
          value={filters.strand}
          onChange={(e) => handleFilterChange("strand", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!filters.grade}
        >
          <option value="">{t("select_strand")}</option>
          {getUniqueValues("strand", "grade", filters.grade).map((strand) => (
            <option key={strand} value={strand}>
              {strand}
            </option>
          ))}
        </select>
        <select
          value={filters.topic}
          onChange={(e) => handleFilterChange("topic", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!filters.strand}
        >
          <option value="">{t("select_topic")}</option>
          {getUniqueValues("topic", "strand", filters.strand).map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <select
          value={filters.skill}
          onChange={(e) => handleFilterChange("skill", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!filters.topic}
        >
          <option value="">{t("select_skill")}</option>
          {getUniqueValues("skill", "topic", filters.topic).map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>
      <div className="max-h-48 overflow-y-auto border border-gray-300 p-3 rounded-md bg-gray-50">
        {loading ? (
          <p className="text-gray-500">{t("loading")}</p>
        ) : filteredPoints.length === 0 ? (
          <p className="text-gray-500">{t("no_knowledge_points_available")}</p>
        ) : (
          filteredPoints.map((point) => (
            <div key={point._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`kp-${point._id}`}
                checked={
                  Array.isArray(selectedPoints) &&
                  selectedPoints.includes(point._id)
                }
                onChange={() => toggleSelection(point._id)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded pointer-events-auto"
                style={{ pointerEvents: "auto" }}
              />
              <label
                htmlFor={`kp-${point._id}`}
                className="text-body-md text-gray-700"
              >
                {point.subKnowledgePoint}
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KnowledgePointSelector;
