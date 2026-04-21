/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Required for ThemeContext toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      /* =========================
         Semantic Brand Colors
      ========================= */
      colors: {
        primary: {
          light: "#34d399",
          DEFAULT: "#10b981",
          dark: "#059669",
        },
        secondary: {
          light: "#60a5fa",
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        accent: {
          light: "#fbbf24",
          DEFAULT: "#f59e0b",
          dark: "#d97706",
        },

        /* Global background tokens */
        background: {
          light: "#ffffff",
          dark: "#0b1220",
        },

        surface: {
          light: "#f9fafb",
          dark: "#111827",
        }
      },

      /* =========================
         Typography
      ========================= */
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      /* =========================
         Shadows
      ========================= */
      boxShadow: {
        glass: "0 8px 32px rgba(31, 38, 135, 0.2)",
        premium: "0 20px 40px rgba(0,0,0,0.15)",
        darkPremium: "0 20px 40px rgba(0,0,0,0.6)",
      },

      /* =========================
         Blur Utilities
      ========================= */
      backdropBlur: {
        xs: "2px",
      },

      /* =========================
         Animations
      ========================= */
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },

        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },

        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },

        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },

      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
        pulseSoft: "pulseSoft 2s infinite",
        float: "float 3s ease-in-out infinite",
        gradientShift: "gradientShift 8s ease infinite",
      },

      /* =========================
         Smooth Transitions
      ========================= */
      transitionProperty: {
        theme: "background-color, color, border-color, fill, stroke",
      },
    },
  },

  plugins: [],
};
