import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { showToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

const KnowledgePointContext = createContext();

export const KnowledgePointProvider = ({ children }) => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(
      "KnowledgePointContext useEffect: user:",
      !!user,
      "token:",
      !!token
    );
    const fetchKnowledgePoints = async () => {
      if (!user || !token) {
        console.log("Skipping fetch: user or token missing");
        return;
      }
      try {
        setLoading(true);
        setError(null); // Clear previous error
        const response = await axios.get(
          "/api/knowledge-points",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched knowledge points:", response.data);
        console.log("Sample knowledge point:", response.data[0]);
        if (!Array.isArray(response.data)) {
          throw new Error(
            `Invalid response format: Expected an array, got ${typeof response.data}`
          );
        }
        setKnowledgePoints(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch knowledge points:", error);
        setError(error.message);
        showToast(t("Failed to load knowledge points"), "error");
        setLoading(false);
      }
    };
    fetchKnowledgePoints();
  }, [t, user, token]);

  console.log(
    "KnowledgePointContext state: loading:",
    loading,
    "error:",
    error,
    "knowledgePoints:",
    knowledgePoints.length
  );

  return (
    <KnowledgePointContext.Provider value={{ knowledgePoints, loading, error }}>
      {children}
    </KnowledgePointContext.Provider>
  );
};

export const useKnowledgePoints = () => {
  const context = useContext(KnowledgePointContext);
  if (!context) {
    throw new Error(
      "useKnowledgePoints must be used within a KnowledgePointProvider"
    );
  }
  return context;
};
