export function parseXAI(raw) {
  try {
    // Parse the outer JSON response
    const outerParsed = JSON.parse(raw);
    // Extract the inner content (assuming it's a string containing JSON)
    const innerContent = outerParsed.choices[0].message.content;
    // Parse the inner JSON
    const innerParsed = JSON.parse(innerContent);
    // Process the question text
    let questionText = innerParsed.question || "";
    // Replace \n\n with <br><br> for two newlines, single \n with space, and remove \[ \] pairs
    questionText = questionText
      .replace(/\n\n/g, "<br><br>") // Two newlines
      .replace(/\n/g, " ") // Single newline to space
//      .replace(/\\\[/g, "") // Remove opening \[
//      .replace(/\\\]/g, "") // Remove closing \]
      .trim();
    return {
      question: questionText,
      correctAnswer: innerParsed.correctAnswer || "",
    };
  } catch (e) {
    console.error("Failed to parse xAI raw content:", e);
    console.warn("Raw content:", raw);
    // Fallback: Attempt to extract question by assuming raw is the inner JSON string
    try {
      const fallbackParsed = JSON.parse(raw);
      let questionText = fallbackParsed.question
        ? fallbackParsed.question
        : raw;
      questionText = questionText
        .replace(/\n\n/g, "<br><br>") // Two newlines
        .replace(/\n/g, " ") // Single newline to space
//        .replace(/\\\[/g, "") // Remove opening \[
//        .replace(/\\\]/g, "") // Remove closing \]
        .trim();
      return {
        question: questionText,
        correctAnswer: fallbackParsed.correctAnswer || "",
      };
    } catch (fallbackError) {
      console.error("Fallback parsing failed:", fallbackError);
      let questionText = raw
        .replace(/\n\n/g, "<br><br>") // Two newlines
        .replace(/\n/g, " ") // Single newline
//        .replace(/\\\[/g, "") // Remove opening \[
//        .replace(/\\\]/g, "") // Remove closing \]
        .trim();
      return { question: questionText, correctAnswer: "" };
    }
  }
}
