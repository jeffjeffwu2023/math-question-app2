import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "mathlive/static.css";
import "../quill.mathlive.js";

const QuestionEditor = ({ value, onContentChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const lastValueRef = useRef(value); // Track last value to prevent loops

  useEffect(() => {
    console.log("QuestionEditor useEffect running", { value });
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

      // Set initial content if provided
      if (value && value !== "<p><br></p>") {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
        console.log("Initial content set:", value);
      }

      quillRef.current.on("text-change", (delta, oldDelta, source) => {
        console.log("text-change event fired", { delta, oldDelta, source });
        const content = quillRef.current.root.innerHTML;
        console.log("Editor content (raw):", content);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        const mathFields = tempDiv.querySelectorAll("math-field");
        mathFields.forEach((mf) => {
          const latex =
            mf.getAttribute("data-latex") || mf.textContent || mf.innerHTML;
          mf.innerHTML = "";
          mf.textContent = latex;
          const dataLatex = mf.getAttribute("data-latex");
          mf.removeAttribute("math-virtual-keyboard-policy");
          mf.setAttribute("contenteditable", false);
          mf.removeAttribute("tabindex");
          mf.setAttribute("data-latex", dataLatex);
        });

        const cleanedContent = tempDiv.innerHTML;
        console.log("Editor content (cleaned):", cleanedContent);
        lastValueRef.current = cleanedContent; // Update last value
        onContentChange(cleanedContent);
      });

      quillRef.current.focus();
      console.log("Quill editor focused");
    }
  }, [onContentChange]); // Initial setup, no dependency on value

  useEffect(() => {
    console.log("QuestionEditor value update effect", { value });
    if (
      quillRef.current &&
      value !== lastValueRef.current &&
      value !== "<p><br></p>"
    ) {
      console.log("Updating Quill content with new value:", value);
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
      lastValueRef.current = value; // Update last value to prevent loops
    }
  }, [value]); // Run when value changes

  return (
    <div ref={editorRef} className="bg-white border rounded-md min-h-[200px]" />
  );
};

export default QuestionEditor;
