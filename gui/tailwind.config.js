/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'SangBleuKingdom': ['"SangBleuKingdom"', 'light']
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes:[{
      forest: {
        ...require("daisyui/src/colors/themes")["[data-theme=corporate]"],
        primary: "#1E2E5F",
        "primary-focus": "#524490",
        secondary: "#524490",
        accent: "#524490",
    }
      }],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
}
