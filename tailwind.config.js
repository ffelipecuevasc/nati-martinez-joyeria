/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./static/**/*.js"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        main: "rgb(var(--color-main) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        title: "rgb(var(--color-title) / <alpha-value>)",
      },
      fontFamily: {
        primary: ['"Playfair Display"', "serif"],
        secondary: ["Cinzel", "serif"],
        body: ["Montserrat", "sans-serif"],
      },
      animation: { "fade-in-up": "fadeInUp 1.5s ease-out forwards" },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}