/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4A017",
        dark: "#0F0F0F",
        softDark: "#1A1A1A",
        cream: "#F5E6CA",
      },
    },
  },
  plugins: [],
};