// src/components/QuestionEditor.jsx
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "mathlive/static.css";

// Ensure MathLive is integrated with Quill (assuming quill.mathlive.js handles this)
import "../quill.mathlive.js";

const QuestionEditor = ({ onContentChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    console.log("QuestionEditor useEffect running");
    if (editorRef.current && !quillRef.current) {
      console.log("Initializing Quill editor");
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["mathlive", "fraction", "exponent", "sqrt"],
            ["clean"],
          ],
          mathlive: {},
        },
      });

      quillRef.current.on("text-change", (delta, oldDelta, source) => {
        console.log("text-change event fired", { delta, oldDelta, source });
        const content = quillRef.current.root.innerHTML;
        console.log("Editor content (raw):", content);

        // Create a temporary DOM element to parse and clean the content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        // Process math-field elements
        const mathFields = tempDiv.querySelectorAll("math-field");
        mathFields.forEach((mf) => {
          const latex =
            mf.getAttribute("data-latex") || mf.textContent || mf.innerHTML;
          mf.innerHTML = "";
          mf.textContent = latex;
          // Keep only the data-latex attribute
          const dataLatex = mf.getAttribute("data-latex");
          mf.removeAttribute("math-virtual-keyboard-policy");
          mf.setAttribute("contenteditable", false);
          mf.removeAttribute("tabindex");
          mf.setAttribute("data-latex", dataLatex);
        });

        const cleanedContent = tempDiv.innerHTML;
        console.log("Editor content (cleaned):", cleanedContent);
        onContentChange(cleanedContent);
      });

      const initialContent = quillRef.current.root.innerHTML;
      console.log("Initial content:", initialContent);
      if (initialContent && initialContent !== "<p><br></p>") {
        console.log("Calling onContentChange with initial content");
        onContentChange(initialContent);
      }

      quillRef.current.focus();
      console.log("Quill editor focused");
    }

    return () => {
      if (quillRef.current) {
        console.log("Cleaning up Quill event listeners");
        //quillRef.current.off("text-change");
      }
    };
  }, [onContentChange]);

  return (
    <div ref={editorRef} className="bg-white border rounded-md min-h-[200px]" />
  );
};

export default QuestionEditor;
