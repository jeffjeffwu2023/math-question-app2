// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans all your files
  ],
  theme: {
    extend: {
      fontSize: {
        // Headings
        "heading-lg": ["1.875rem", { lineHeight: "2.25rem" }], // ~30px, equivalent to text-3xl
        "heading-md": ["1.5rem", { lineHeight: "2rem" }], // ~24px, equivalent to text-2xl
        "heading-sm": ["1.25rem", { lineHeight: "1.75rem" }], // ~20px, equivalent to text-xl

        // Subheadings
        subheading: ["1.125rem", { lineHeight: "1.75rem" }], // ~18px, equivalent to text-lg

        // Body text
        "body-md": ["0.875rem", { lineHeight: "1.25rem" }], // ~14px, equivalent to text-sm
        "body-sm": ["0.75rem", { lineHeight: "1rem" }], // ~12px, equivalent to text-xs
      },
    },
  },
  plugins: [],
};
