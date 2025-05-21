// src/components/QuestionPreview.jsx
import { useEffect, useRef } from "react";
import { MathfieldElement } from "mathlive";
import "mathlive/static.css";

const QuestionPreview = ({ content }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    console.log("QuestionPreview useEffect triggered");
    console.log("Content received:", content);

    if (previewRef.current) {
      // Clean up zero-width spaces that might cause newlines
      const cleanedContent = content ? content.replace(/\u200B/g, "") : "";
      console.log(
        "Setting innerHTML to:",
        cleanedContent || "<p>No content to preview</p>"
      );
      previewRef.current.innerHTML =
        cleanedContent || "<p>No content to preview</p>";

      const mathFields = previewRef.current.querySelectorAll("math-field");
      console.log("Math fields found:", mathFields.length);

      mathFields.forEach((mf) => {
        try {
          const latex =
            mf.getAttribute("data-latex") || mf.textContent || mf.innerHTML;
          const newMathField = new MathfieldElement();
          newMathField.readOnly = true;
          newMathField.virtualKeyboardMode = "off"; // Disable virtual keyboard
          newMathField.removeAttribute("contenteditable");
          newMathField.removeAttribute("tabindex");
          newMathField.removeAttribute("math-virtual-keyboard-policy");
          newMathField.style.pointerEvents = "none"; // Prevent any interaction
          newMathField.value = latex;

          mf.parentNode.replaceChild(newMathField, mf);
        } catch (error) {
          console.error("Failed to render MathLive field:", error);
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={previewRef}
      className="p-4 bg-gray-50 border rounded-md min-h-[100px] preview"
    />
  );
};

export default QuestionPreview;
