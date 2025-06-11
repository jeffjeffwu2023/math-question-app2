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
            mathlive: {
              renderLatex: true,
              enabled: true,
            },
          },
        });

        // Set initial content if provided
        if (value && value !== "<p><br></p>") {
          quillRef.current.clipboard.dangerouslyPasteHTML(value);
          console.log("Initial content set:", value);
          // Initialize and enable virtual keyboard for math-field elements
          const mathFields = editorRef.current.querySelectorAll("math-field");
          mathFields.forEach((mf) => {
            const dataLatex = mf.getAttribute("data-latex");
            if (dataLatex) {
              mf.setAttribute("data-latex", dataLatex.trim());
              mf.value = dataLatex.trim(); // Set value to render
              mf.setAttribute("virtual-keyboard-mode", "manual"); // Enable keyboard toggle icon
              console.log("Initialized math-field with data-latex:", dataLatex);
            }
          });
        }

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
    }, [onContentChange]);

    useEffect(() => {
      console.log("QuestionEditor value update effect", { value });
      if (
        quillRef.current &&
        value !== lastValueRef.current &&
        value !== "<p><br></p>"
      ) {
        console.log("Updating Quill content with new value:", value);
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
        lastValueRef.current = quillRef.current.innerHTML; // Sync last value
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
    }, [value]);

    return (
      <div ref={editorRef} className="bg-white border rounded-md min-h-[200px]" />
    );
  };

  export default QuestionEditor;
  