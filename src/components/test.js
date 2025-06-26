const parseContentToSegments = (htmlContent) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const segments = [];
  tempDiv.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text)
        segments.push({ value: text, type: "text", original_latex: null });
    } else if (node.nodeName === "MATH-FIELD") {
      const value = node.getAttribute("data-latex") || node.textContent;
      segments.push({
        value: node.textContent,
        type: "latex",
        original_latex: value,
      });
    } else if (node.nodeName === "DIV" && node.querySelector("math-field")) {
      const mathField = node.querySelector("math-field");
      const value =
        mathField.getAttribute("data-latex") || mathField.textContent;
      segments.push({
        value: mathField.textContent,
        type: "latex",
        original_latex: value,
      });
    }
  });
  console.log("Parsed segments:", segments); // Debug log
  return segments;
};


const str = "<p>abcd</p>";
const newSegments = parseContentToSegments(str)
console.log(newSegments)