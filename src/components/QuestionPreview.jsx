import { useEffect, useRef } from "react";
import * as MathLive from "mathlive";
import "mathlive/static.css";

const QuestionPreview = ({ content }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    console.log("QuestionPreview useEffect triggered");
    console.log("Content received:", content);

    if (previewRef.current) {
      // Clear existing content
      previewRef.current.innerHTML = "";
      // Set raw HTML including <math-field> tags
      previewRef.current.innerHTML = content || "<p>No content to preview</p>";

      // Render MathLive content and initialize math-field elements
      try {
        MathLive.renderMathInElement(previewRef.current, {
          readOnly: true,
          virtualKeyboardMode: "off", // Disable keyboard icon
          renderToMathML: false,
        });
        console.log(
          "MathLive rendering complete for:",
          previewRef.current.innerHTML
        );
        const mathFields = previewRef.current.querySelectorAll("math-field");
        console.log("Math fields found after rendering:", mathFields.length);
        mathFields.forEach((mf) => {
          const dataLatex = mf.getAttribute("data-latex");
          if (dataLatex) {
            mf.value = dataLatex.trim(); // Set value to render the expression
            mf.setAttribute("virtual-keyboard-mode", "off"); // Explicitly disable keyboard
            mf.setAttribute("readOnly", "true"); // Reinforce read-only
            console.log(
              "Initialized preview math-field with data-latex:",
              dataLatex
            );
          }
        });
      } catch (error) {
        console.error("Failed to render MathLive content:", error);
      }
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
