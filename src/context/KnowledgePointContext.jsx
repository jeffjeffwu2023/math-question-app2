// src/context/KnowledgePointContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { API, getKnowledgePoints } from "../services/api";
import { toast } from "react-toastify";

const KnowledgePointContext = createContext();

export function KnowledgePointProvider({ children }) {
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKnowledgePoints = async () => {
      setLoading(true);
      try {
        const response = await getKnowledgePoints({ version: "2025.01" });
        console.log("Fetched knowledge points:", response.data);
        setKnowledgePoints(response.data);
        localStorage.setItem("knowledgePoints", JSON.stringify(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch knowledge points:", error);
        toast.error("Failed to load knowledge points", {
          toastId: "kp-load-error",
        });
        // Load cached data if offline
        const cachedPoints = localStorage.getItem("knowledgePoints");
        if (cachedPoints && !navigator.onLine) {
          setKnowledgePoints(JSON.parse(cachedPoints));
        }
        setLoading(false);
      }
    };
    fetchKnowledgePoints();
  }, []);

  return (
    <KnowledgePointContext.Provider value={{ knowledgePoints, loading }}>
      {children}
    </KnowledgePointContext.Provider>
  );
}

export const useKnowledgePoint = () => useContext(KnowledgePointContext);
