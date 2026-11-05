import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Resolve to CSS variables so light/dark switch actually works
        quietide: {
          bg: "rgb(var(--q-bg) / <alpha-value>)",
          surface: "rgb(var(--q-surface) / <alpha-value>)",
          card: "rgb(var(--q-card) / <alpha-value>)",
          primary: "rgb(var(--q-primary) / <alpha-value>)",
          secondary: "rgb(var(--q-secondary) / <alpha-value>)",
          accent: "rgb(var(--q-accent) / <alpha-value>)",
          muted: "rgb(var(--q-muted) / <alpha-value>)",
          soft: "rgb(var(--q-soft) / <alpha-value>)",
          border: "rgb(var(--q-border) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        breathe: "breathe 8s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
