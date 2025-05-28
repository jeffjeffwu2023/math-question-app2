// src/components/KnowledgePointSelector.jsx
import React, { useState, useEffect } from "react";
import { getKnowledgePoints } from "../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Tree } from "react-arborist";

const KnowledgePointSelector = ({ selectedPoints, setSelectedPoints }) => {
  const { t } = useTranslation();
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchKnowledgePoints = async () => {
      setLoading(true);
      console.log("Fetching knowledge points with filters:", {
        version: "2025.01",
      });
      try {
        const response = await getKnowledgePoints({ version: "2025.01" });
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
  }, [t]);

  // Build tree data from knowledge points
  const buildTreeData = () => {
    const tree = [];
    const gradeMap = {};

    knowledgePoints.forEach((point) => {
      const { grade, strand, topic, skill, subKnowledgePoint, _id } = point;

      // Grade level
      if (!gradeMap[grade]) {
        gradeMap[grade] = {
          id: `grade-${grade}`,
          name: grade,
          children: [],
          isOpen: false,
        };
        tree.push(gradeMap[grade]);
      }

      // Strand level
      const gradeNode = gradeMap[grade];
      let strandNode = gradeNode.children.find(
        (child) => child.name === strand
      );
      if (!strandNode) {
        strandNode = {
          id: `strand-${grade}-${strand}`,
          name: strand,
          children: [],
          isOpen: false,
        };
        gradeNode.children.push(strandNode);
      }

      // Topic level
      let topicNode = strandNode.children.find((child) => child.name === topic);
      if (!topicNode) {
        topicNode = {
          id: `topic-${grade}-${strand}-${topic}`,
          name: topic,
          children: [],
          isOpen: false,
        };
        strandNode.children.push(topicNode);
      }

      // Skill level
      let skillNode = topicNode.children.find((child) => child.name === skill);
      if (!skillNode) {
        skillNode = {
          id: `skill-${grade}-${strand}-${topic}-${skill}`,
          name: skill,
          children: [],
          isOpen: false,
        };
        topicNode.children.push(skillNode);
      }

      // SubKnowledgePoint level (leaf node)
      skillNode.children.push({
        id: _id,
        name: subKnowledgePoint,
        isLeaf: true,
        isSelected: selectedPoints.includes(_id),
      });
    });

    return tree;
  };

  const toggleSelection = (pointId) => {
    console.log("Toggling selection for point:", pointId);
    const newPoints = selectedPoints.includes(pointId)
      ? selectedPoints.filter((id) => id !== pointId)
      : [...selectedPoints, pointId];
    setSelectedPoints(newPoints);
  };

  const removeSelectedPoint = (pointId) => {
    console.log("Removing selected point:", pointId);
    setSelectedPoints(selectedPoints.filter((id) => id !== pointId));
  };

  const Node = ({ node, style, dragHandle }) => {
    return (
      <div style={style} ref={dragHandle} className="flex items-center py-1">
        {node.data.isLeaf ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={node.data.isSelected}
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to form
              onChange={() => toggleSelection(node.id)}
              className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              aria-label={`Select ${node.data.name}`}
            />
            <span className="text-sm text-gray-700">{node.data.name}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <button
              type="button" // Explicitly set type to prevent form submission
              onClick={(e) => {
                e.stopPropagation();
                console.log(
                  `Toggling node: ${node.data.name}, isOpen: ${node.isOpen}`
                );
                node.toggle();
              }}
              className="mr-2 focus:outline-none"
              aria-expanded={node.isOpen}
              aria-label={
                node.isOpen
                  ? `Collapse ${node.data.name}`
                  : `Expand ${node.data.name}`
              }
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  node.isOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {node.data.name}
            </span>
          </div>
        )}
      </div>
    );
  };

  const treeData = buildTreeData();

  return (
    <div className="space-y-4">
      {/* Display Selected Knowledge Points */}
      {selectedPoints.length > 0 && (
        <div className="mt-2">
          <label className="block text-body-md font-medium text-gray-700 mb-1">
            {t("selected_knowledge_points")}
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedPoints.map((pointId) => {
              const point = knowledgePoints.find((p) => p._id === pointId);
              return point ? (
                <span
                  key={pointId}
                  className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {point.subKnowledgePoint}
                  <button
                    type="button"
                    onClick={() => removeSelectedPoint(pointId)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                    aria-label={`Remove ${point.subKnowledgePoint}`}
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Button to Open Modal */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {t("select_knowledge_points")}
      </button>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("select_knowledge_points")}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={t("close")}
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              {loading ? (
                <p className="text-gray-500">{t("loading")}</p>
              ) : knowledgePoints.length === 0 ? (
                <p className="text-gray-500">
                  {t("no_knowledge_points_available")}
                </p>
              ) : (
                <Tree
                  data={treeData}
                  openByDefault={false}
                  width="100%"
                  height={400}
                  indent={24}
                  rowHeight={36}
                >
                  {Node}
                </Tree>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePointSelector;
