/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        calSans: ["'Cal Sans'", "sans-serif"], // Add Cal Sans
        geist: ["'Geist'", "sans-serif"], // Add Geist
      },
    },
  },
  plugins: [],
}