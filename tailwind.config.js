module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this includes all relevant files
  ],
  theme: {
    extend: {
      backgroundImage: {
        "primary-gradient": "linear-gradient(to right, #2E86AB, #FFD166)",
      },
      colors: {
        accent: "#FF6B6B",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
