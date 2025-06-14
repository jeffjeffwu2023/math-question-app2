export function parseOpenAI(raw) {
  try {
    const parsed = JSON.parse(raw);
    return {
      question: parsed.question || raw, // Fallback to raw if 'question' is missing
      correctAnswer: parsed.correctAnswer || "",
    };
  } catch (e) {
    console.warn("Failed to parse OpenAI raw content as JSON, treating as question:", raw);
    return { question: raw, correctAnswer: "" };
  }
}