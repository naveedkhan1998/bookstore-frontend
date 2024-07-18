import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          primary: "#c9cba3",
          secondary: "#ffe1a8",
        },
        dark: {
          primary: "#2f4858",
          secondary: "#33658a",
        },
        secondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          "dark-hover": colors.neutral[900],
        },
        "light-mode-background": "#E1E1A8",
        "dark-mode-background": "#36454F",
        "light-mode-header": "#D9D9A5",
        "dark-mode-header": "#2F3A40",
        "light-mode-text": "#333333",
        "dark-mode-text": "#FFFFFF",
        "light-mode-subtext": "#666666",
        "dark-mode-subtext": "#CCCCCC",
        "light-mode-hover": "#C5C592",
        "dark-mode-hover": "#45545B",
        "light-mode-table-header": "#C8C89C",
        "dark-mode-table-header": "#3B454D",
        "nav-border": "#EBEAEA",
        "light-white": "#FAFAFB",
        "light-white-100": "#F1F4F5",
        "light-white-200": "#d7d7d7",
        "light-white-300": "#F3F3F4",
        "light-white-400": "#E2E5F1",
        "light-white-500": "#E4E4E4",
        "primary-purple": "#9747FF",
        "gray-50": "#D9D9D9",
      },
      boxShadow: {
        menu: "0px 159px 95px rgba(13,12,34,0.01), 0px 71px 71px rgba(13,12,34,0.02), 0px 18px 39px rgba(13,12,34,0.02), 0px 0px 0px rgba(13,12,34,0.02)",
      },
      screens: {
        xs: "400px",
      },
      maxWidth: {
        "10xl": "1680px",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
};
