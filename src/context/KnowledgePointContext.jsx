import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const KnowledgePointContext = createContext();

export function KnowledgePointProvider({ children }) {
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/knowledge-points/")
      .then((response) => {
        console.log("Fetched knowledge points:", response.data);
        setKnowledgePoints(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch knowledge points:", error);
        toast.error("Failed to load knowledge points", {
          toastId: "kp-load-error",
        });
        setLoading(false);
      });
  }, []);

  return (
    <KnowledgePointContext.Provider value={{ knowledgePoints, loading }}>
      {children}
    </KnowledgePointContext.Provider>
  );
}

export const useKnowledgePoint = () => useContext(KnowledgePointContext);
