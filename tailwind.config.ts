/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Indique à Tailwind où chercher tes composants pour purger le CSS inutile
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Si tu as un dossier "src", décommente la ligne suivante :
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Permet de gérer le mode sombre via une classe CSS (ex: avec next-themes)
  theme: {
    extend: {
      // Tu pourras étendre ta palette de couleurs ou tes polices ici
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
      },
    },
  },
  // 2. Ajout des plugins indispensables
  plugins: [
    require("@tailwindcss/typography"), // 🔥 REQUIS pour le Markdown de ton assistant IA
  ],
};