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
          primary: "#F8F3E6", // Light mode primary background - warm cream
          secondary: "#E6DCC8", // Light mode secondary background - light beige
          text: "#2C1810", // Light mode text color - deep brown
        },
        dark: {
          primary: "#1C1713", // Dark mode primary background - rich dark brown
          secondary: "#2C2420", // Dark mode secondary background - slightly lighter brown
          text: "#E6DCC8", // Dark mode text color - light beige
        },
        secondary: {
          DEFAULT: "#D4A373", // Warm tan for secondary elements
          hover: "#C68B59", // Slightly darker tan for hover states
          border: "#B07D56", // Border color with enough contrast
          text: "#5C4033", // Medium brown for secondary text
          dark: "#8B5E3C", // Darker brown for dark mode secondary elements
          "dark-hover": "#A67B5B", // Lighter brown for hover states in dark mode
        },
        accent: {
          DEFAULT: "#7D4F50", // Muted red-brown as an accent color
          hover: "#9A6263", // Lighter red-brown for hover states
          text: "#F8F3E6", // Light cream for text on accent backgrounds
        },
      },
      boxShadow: {
        menu: "0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.1)",
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
