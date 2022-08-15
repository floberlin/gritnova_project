/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [{
      solteria: {

        "primary": "#1d4ed8",

        "secondary": "#0ea5e9",

        "accent": "#2563eb",

        "neutral": "#110E0E",

        "base-100": "#171212",

        "info": "#3ABFF8",

        "success": "#36D399",

        "warning": "#FBBD23",

        "error": "#F87272",
      },
    }, ],
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'exo': ['"Exo 2"', 'sans-serif'],
        "syncopate": ["Syncopate", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
}