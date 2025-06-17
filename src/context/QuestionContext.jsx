// QuestionContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react"; // Added useRef
import { API, getQuestions } from "../services/api";

const QuestionContext = createContext();

export function QuestionProvider({ children, autoFetch = false }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds delay between retries
  const fetchCount = useRef(0); // Now works with useRef imported

  const fetchQuestions = useCallback(async () => {
    fetchCount.current += 1;
    console.log(`Fetching questions - Attempt #${fetchCount.current}`);
    setLoading(true);
    setError(null);
    try {
      const response = await getQuestions();
      console.log("Fetched questions:", response.data);
      if (Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        throw new Error(
          "Invalid response format: expected an array of questions"
        );
      }
    } catch (err) {
      console.error(
        `Failed to fetch questions (Attempt #${fetchCount.current}):`,
        err
      );
      const errorMessage = err.message || "Failed to load questions";
      setError({
        message: errorMessage,
        isNetwork: err.code === "ERR_NETWORK",
        details: err.response?.data?.detail || err.message,
      });
      if (err.code === "ERR_NETWORK" && retryCount < maxRetries) {
        console.log(
          `Retrying fetch... Attempt ${retryCount + 1} of ${maxRetries}`
        );
        setRetryCount((prev) => prev + 1);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        await fetchQuestions(); // Recursive retry
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    if (autoFetch) {
      console.log("QuestionProvider useEffect triggered - Initial fetch");
      fetchQuestions();
    }
  }, [autoFetch, fetchQuestions]);

  return (
    <QuestionContext.Provider
      value={{ questions, loading, error, fetchQuestions }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export const useQuestions = () => useContext(QuestionContext);
