/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        info: "#17a2b8",
        danger: "#dc3545",
        greenopacity: "rgba(6, 159, 60, 50)"
      },
      flex:{
        "2": "2 2 0%"
      }
    },
  },
  plugins: [],
}
