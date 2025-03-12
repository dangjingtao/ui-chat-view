/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        "safe-top": "var(--safe-area-inset-top)",
        "safe-right": "var(--safe-area-inset-right)",
        "safe-bottom": "var(--safe-area-inset-bottom)",
        "safe-left": "var(--safe-area-inset-left)",
      },
    },
  },
  plugins: [require("tailwindcss-safe-area")],
};
