// src/components/QuestionPreview.jsx
import { useEffect, useRef } from "react";
import * as MathLive from "mathlive";
import "mathlive/static.css";

const QuestionPreview = ({ content }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    console.log("QuestionPreview useEffect triggered");
    console.log("Content received:", content);

    if (previewRef.current) {
      // Clean up zero-width spaces
      const cleanedContent = content ? content.replace(/\u200B/g, "") : "";
      console.log(
        "Setting innerHTML to:",
        cleanedContent || "<p>No content to preview</p>"
      );

      // Clear existing content to prevent DOM inconsistencies
      previewRef.current.innerHTML = "";
      previewRef.current.innerHTML =
        cleanedContent || "<p>No content to preview</p>";

      // Render MathLive content
      try {
        MathLive.renderMathInElement(previewRef.current, {
          readOnly: true,
          virtualKeyboardMode: "off",
        });
        console.log(
          "MathLive rendering complete for:",
          previewRef.current.innerHTML
        );
      } catch (error) {
        console.error("Failed to render MathLive content:", error);
      }

      const mathFields = previewRef.current.querySelectorAll("math-field");
      console.log("Math fields found after rendering:", mathFields.length);
      console.log("Final preview HTML:", previewRef.current.innerHTML);
    }
  }, [content]);

  return (
    <div
      ref={previewRef}
      className="p-4 bg-gray-50 border rounded-md min-h-[100px] w-full overflow-auto"
      style={{ whiteSpace: "normal", overflow: "auto", width: "100%" }}
    />
  );
};

export default QuestionPreview;
