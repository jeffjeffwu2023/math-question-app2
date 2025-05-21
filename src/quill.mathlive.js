// src/quill.mathlive.js
import Quill from "quill";
import { MathfieldElement } from "mathlive";

// Set static properties for MathLive
MathfieldElement.fontsDirectory = "/assets/mathlive/fonts";
MathfieldElement.soundsDirectory = "/assets/mathlive/sounds";

const Embed = Quill.import("blots/embed");

class MathliveBlot extends Embed {
  static create(value) {
    const mfe = new MathfieldElement();
    mfe.mathVirtualKeyboardPolicy = "onfocus";
    if (value && value !== "INSERT") {
      mfe.value = value;
      mfe.setAttribute("data-latex", value);
    }
    mfe.addEventListener("focus", () => {
      mfe.focus();
    });
    mfe.addEventListener("change", () => {
      mfe.innerText = mfe.value;
      mfe.setAttribute("data-latex", mfe.value);
    });
    return mfe;
  }

  static value(mfe) {
    return mfe.getAttribute("data-latex") || mfe.value;
  }
}

MathliveBlot.blotName = "mathlive";
MathliveBlot.tagName = "span";
MathliveBlot.className = "mathlive";
Quill.register(MathliveBlot);

// Register the mathlive module
class MathliveModule {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
  }
}

Quill.register("modules/mathlive", MathliveModule);

// Toolbar handlers
const toolbar = Quill.import("modules/toolbar");
toolbar.DEFAULTS.handlers = {
  ...toolbar.DEFAULTS.handlers,
  mathlive: function () {
    const quill = this.quill;
    const range = quill.getSelection();
    if (range) {
      let insertIndex = range.index;
      const contentBefore = quill.getText(0, insertIndex);
      let spaceBefore = "";
      if (contentBefore.length > 0 && !contentBefore.endsWith(" ")) {
        spaceBefore = " ";
        quill.insertText(insertIndex, spaceBefore);
        insertIndex += 1;
      }
      quill.insertEmbed(insertIndex, "mathlive", "INSERT");
      const mathFieldLength = 1;
      insertIndex += mathFieldLength;
      const contentAfter = quill.getText(insertIndex);
      if (!contentAfter.startsWith(" ")) {
        quill.insertText(insertIndex, " ");
        insertIndex += 1;
      }
      quill.setSelection(insertIndex);
    }
  },
  fraction: function () {
    const quill = this.quill;
    const range = quill.getSelection();
    if (range) {
      let insertIndex = range.index;
      const contentBefore = quill.getText(0, insertIndex);
      let spaceBefore = "";
      if (contentBefore.length > 0 && !contentBefore.endsWith(" ")) {
        spaceBefore = " ";
        quill.insertText(insertIndex, spaceBefore);
        insertIndex += 1;
      }
      quill.insertEmbed(insertIndex, "mathlive", "\\frac{a}{b}");
      const mathFieldLength = 1;
      insertIndex += mathFieldLength;
      const contentAfter = quill.getText(insertIndex);
      if (!contentAfter.startsWith(" ")) {
        quill.insertText(insertIndex, " ");
        insertIndex += 1;
      }
      quill.setSelection(insertIndex);
    }
  },
  exponent: function () {
    const quill = this.quill;
    const range = quill.getSelection();
    if (range) {
      let insertIndex = range.index;
      const contentBefore = quill.getText(0, insertIndex);
      let spaceBefore = "";
      if (contentBefore.length > 0 && !contentBefore.endsWith(" ")) {
        spaceBefore = " ";
        quill.insertText(insertIndex, spaceBefore);
        insertIndex += 1;
      }
      quill.insertEmbed(insertIndex, "mathlive", "a^b");
      const mathFieldLength = 1;
      insertIndex += mathFieldLength;
      const contentAfter = quill.getText(insertIndex);
      if (!contentAfter.startsWith(" ")) {
        quill.insertText(insertIndex, " ");
        insertIndex += 1;
      }
      quill.setSelection(insertIndex);
    }
  },
  sqrt: function () {
    const quill = this.quill;
    const range = quill.getSelection();
    if (range) {
      let insertIndex = range.index;
      const contentBefore = quill.getText(0, insertIndex);
      let spaceBefore = "";
      if (contentBefore.length > 0 && !contentBefore.endsWith(" ")) {
        spaceBefore = " ";
        quill.insertText(insertIndex, spaceBefore);
        insertIndex += 1;
      }
      // Insert a math-field with a pre-filled square root
      quill.insertEmbed(insertIndex, "mathlive", "\\sqrt{a}");
      const mathFieldLength = 1;
      insertIndex += mathFieldLength;
      const contentAfter = quill.getText(insertIndex);
      if (!contentAfter.startsWith(" ")) {
        quill.insertText(insertIndex, " ");
        insertIndex += 1;
      }
      quill.setSelection(insertIndex);
    }
  },
};
