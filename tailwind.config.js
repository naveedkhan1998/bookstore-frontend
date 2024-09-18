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
          primary: "#F1F8E9",   // Pale green
          secondary: "#DCEDC8", // Light green
          text: "#33691E",      // Dark green
        },
        dark: {
          primary: "#1B3022",   // Forest green
          secondary: "#2C4A35", // Lighter forest green
          text: "#DCEDC8",      // Light green
        },
        secondary: {
          DEFAULT: "#8BC34A",   // Lime green
          hover: "#9CCC65",     // Lighter lime green
          border: "#7CB342",    // Darker lime green
          text: "#33691E",      // Dark green
          dark: "#689F38",      // Muted green for dark mode
          "dark-hover": "#7CB342", // Lighter green for dark mode hover
        },
        accent: {
          DEFAULT: "#FF5722",   // Deep orange
          hover: "#FF7043",     // Lighter orange
          text: "#F1F8E9",      // Pale green
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

// additional colors
// colors: {
//   main: {
//     primary: "#FFF8E1",   // Soft yellow
//     secondary: "#FFECB3", // Light amber
//     text: "#3E2723",      // Dark brown
//   },
//   dark: {
//     primary: "#3E2723",   // Dark brown
//     secondary: "#4E342E", // Lighter brown
//     text: "#FFF8E1",      // Soft yellow
//   },
//   secondary: {
//     DEFAULT: "#FFCA28",   // Amber
//     hover: "#FFD54F",     // Light amber
//     border: "#FFB300",    // Dark amber
//     text: "#3E2723",      // Dark brown
//     dark: "#FFA000",      // Muted amber for dark mode
//     "dark-hover": "#FFC107", // Brighter amber for dark mode hover
//   },
//   accent: {
//     DEFAULT: "#795548",   // Brown
//     hover: "#8D6E63",     // Lighter brown
//     text: "#FFF8E1",      // Soft yellow
//   },
// }

// colors: {
//   main: {
//     primary: "#F1F8E9",   // Pale green
//     secondary: "#DCEDC8", // Light green
//     text: "#33691E",      // Dark green
//   },
//   dark: {
//     primary: "#1B3022",   // Forest green
//     secondary: "#2C4A35", // Lighter forest green
//     text: "#DCEDC8",      // Light green
//   },
//   secondary: {
//     DEFAULT: "#8BC34A",   // Lime green
//     hover: "#9CCC65",     // Lighter lime green
//     border: "#7CB342",    // Darker lime green
//     text: "#33691E",      // Dark green
//     dark: "#689F38",      // Muted green for dark mode
//     "dark-hover": "#7CB342", // Lighter green for dark mode hover
//   },
//   accent: {
//     DEFAULT: "#FF5722",   // Deep orange
//     hover: "#FF7043",     // Lighter orange
//     text: "#F1F8E9",      // Pale green
//   },
// }