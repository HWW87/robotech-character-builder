/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: ["'VT323'", "monospace"]
      },
      colors: {
        retrobg: "#f2f2f2",
        retroblue: "#007acc",
        retrogray: "#dcdcdc",
        retrotext: "#1a1a1a"
      }
    },
  },
  plugins: [],
}
