// QuestionEditor.jsx
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import * as MathLive from "mathlive";
import "mathlive/static.css";
import "../quill.mathlive.js";

const MathFieldBlot = Quill.import("blots/embed");
class CustomMathFieldBlot extends MathFieldBlot {
  static create(value) {
    const node = super.create();
    node.setAttribute("data-latex", value);
    node.innerHTML = value;
    return node;
  }
  static value(node) {
    return node.getAttribute("data-latex") || node.innerHTML;
  }
}
CustomMathFieldBlot.blotName = "math-field";
CustomMathFieldBlot.tagName = "math-field";
Quill.register(CustomMathFieldBlot);

const QuestionEditor = ({ segments = [], onContentChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const lastValueRef = useRef(""); // Track last value to prevent loops

  useEffect(() => {
    console.log("QuestionEditor useEffect running", { segments });
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
          mathlive: {
            renderLatex: true,
            enabled: true,
          },
        },
      });

      // Set initial content from segments if provided
      const initialContent =
        segments.length > 0
          ? segments
              .map((segment) =>
                segment.type === "latex"
                  ? `<math-field data-latex="${segment.value}">${segment.value}</math-field>`
                  : segment.type === "text"
                  ? segment.value
                  : segment.type == "newline"
                  ? "<p><br></p>"
                  : ""
              )
              .join("")
          : "<p><br></p>";
      quillRef.current.clipboard.dangerouslyPasteHTML(initialContent);
      console.log("Initial content set from segments:", initialContent);

      quillRef.current.on("text-change", (delta, oldDelta, source) => {
        console.log("text-change event fired", { delta, oldDelta, source });
        const content = quillRef.current.root.innerHTML;
        console.log("Editor content (raw):", content);
        lastValueRef.current = content; // Update last value
        onContentChange(content);
        // Re-render and enable virtual keyboard
        MathLive.renderMathInElement(editorRef.current, {
          readOnly: false,
          virtualKeyboardMode: "manual",
          renderToMathML: false,
        });
        const mathFields = editorRef.current.querySelectorAll("math-field");
        mathFields.forEach((mf) => {
          const dataLatex = mf.getAttribute("data-latex");
          if (dataLatex) {
            mf.value = dataLatex.trim();
            mf.setAttribute("virtual-keyboard-mode", "manual");
            console.log("Updated math-field with data-latex:", dataLatex);
          }
        });
      });

      quillRef.current.focus();
      console.log("Quill editor focused");
    }
  }, [onContentChange, segments]);

  useEffect(() => {
    console.log("QuestionEditor segments update effect", { segments });
    if (
      quillRef.current &&
      segments &&
      segments.length > 0 &&
      JSON.stringify(segments) !== JSON.stringify(lastValueRef.current)
    ) {
      console.log("Updating Quill content with new segments:", segments);
      const newContent = segments
        .map((segment) =>
          segment.type === "latex"
            ? `<math-field data-latex="${segment.value}">${segment.value}</math-field>`
            : segment.type === "text"
            ? segment.value
            : segment.type == "newline"
            ? "<p><br></p>"
            : ""
        )
        .join("");
      
      console.log("New content to set in Quill:", newContent);
      quillRef.current.clipboard.dangerouslyPasteHTML(newContent);
      lastValueRef.current = newContent; // Sync last value
      // Initialize math-field elements after update
      MathLive.renderMathInElement(editorRef.current, {
        readOnly: false,
        virtualKeyboardMode: "manual",
        renderToMathML: false,
      });
      const mathFields = editorRef.current.querySelectorAll("math-field");
      mathFields.forEach((mf) => {
        const dataLatex = mf.getAttribute("data-latex");
        if (dataLatex) {
          mf.value = dataLatex.trim();
          mf.setAttribute("virtual-keyboard-mode", "manual");
          console.log("Updated math-field with data-latex:", dataLatex);
        }
      });
    }
  }, [segments]);

  return (
    <div id="content" ref={editorRef} className="bg-white border rounded-md min-h-[200px]" />
  );
};

export default QuestionEditor;
