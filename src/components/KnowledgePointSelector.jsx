// src/components/KnowledgePointSelector.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const KnowledgePointSelector = ({ selectedPoints, setSelectedPoints }) => {
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    grade: "",
    strand: "",
    topic: "",
    skill: "",
    version: "2025.01", // Default version
  });

  // Fetch knowledge points
  useEffect(() => {
    const fetchKnowledgePoints = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/knowledge-points",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              version: filters.version,
            },
          }
        );
        setKnowledgePoints(response.data);
      } catch (error) {
        toast.error("Failed to fetch knowledge points.", {
          toastId: "fetch-kp-error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledgePoints();
  }, [filters.version]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "grade" && { strand: "", topic: "", skill: "" }),
      ...(key === "strand" && { topic: "", skill: "" }),
      ...(key === "topic" && { skill: "" }),
    }));
  };

  // Get unique values for dropdowns
  const getUniqueValues = (key, filterKey = null, filterValue = null) => {
    return [
      ...new Set(
        knowledgePoints
          .filter((kp) => !filterKey || kp[filterKey] === filterValue)
          .map((kp) => kp[key])
      ),
    ].sort();
  };

  // Toggle sub-knowledge point selection
  const toggleSelection = (pointId) => {
    setSelectedPoints((prev) =>
      prev.includes(pointId)
        ? prev.filter((id) => id !== pointId)
        : [...prev, pointId]
    );
  };

  // Filter sub-knowledge points based on selections
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
        {/* Grade Dropdown */}
        <select
          value={filters.grade}
          onChange={(e) => handleFilterChange("grade", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Grade</option>
          {getUniqueValues("grade").map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        {/* Strand Dropdown */}
        <select
          value={filters.strand}
          onChange={(e) => handleFilterChange("strand", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!filters.grade}
        >
          <option value="">Select Strand</option>
          {getUniqueValues("strand", "grade", filters.grade).map((strand) => (
            <option key={strand} value={strand}>
              {strand}
            </option>
          ))}
        </select>
        {/* Topic Dropdown */}
        <select
          value={filters.topic}
          onChange={(e) => handleFilterChange("topic", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!filters.strand}
        >
          <option value="">Select Topic</option>
          {getUniqueValues("topic", "strand", filters.strand).map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        {/* Skill Dropdown */}
        <select
          value={filters.skill}
          onChange={(e) => handleFilterChange("skill", e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!filters.topic}
        >
          <option value="">Select Skill</option>
          {getUniqueValues("skill", "topic", filters.topic).map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>
      {/* Sub-Knowledge Points Checkboxes */}
      <div className="max-h-48 overflow-y-auto border border-gray-300 p-3 rounded-md bg-gray-50">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredPoints.length === 0 ? (
          <p className="text-gray-500">No knowledge points available.</p>
        ) : (
          filteredPoints.map((point) => (
            <div key={point._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`kp-${point._id}`}
                checked={selectedPoints.includes(point._id)}
                onChange={() => toggleSelection(point._id)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
