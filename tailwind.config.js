/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        pink: {
          50: "#FFF5F7",
          100: "#FFE4E9",
          200: "#FFC8D1",
          300: "#FFB6C1",
          400: "#FF9AAF",
          500: "#FF7A99",
        },
        mint: {
          50: "#F0FFF4",
          100: "#C6F6D5",
          200: "#9AE6B4",
          300: "#68D391",
        },
        cream: {
          50: "#FFFBF5",
          100: "#FFF3E6",
          200: "#FFE4CC",
        },
        lavender: {
          50: "#FAF5FF",
          100: "#E9D8FD",
          200: "#D6BCFA",
          300: "#B794F4",
        },
        peach: {
          100: "#FFE5D4",
          200: "#FFCBA4",
          300: "#FFB088",
        },
      },
      fontFamily: {
        cute: ["'Comic Sans MS'", "'Noto Sans SC'", "cursive", "sans-serif"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "pop": "pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "shake": "shake 0.5s ease-in-out",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "confetti": "confetti 3s ease-out forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        confetti: {
          "0%": { opacity: "1", transform: "translateY(0) rotate(0deg)" },
          "100%": { opacity: "0", transform: "translateY(500px) rotate(720deg)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(255, 182, 193, 0.4)" },
          "100%": { boxShadow: "0 0 40px rgba(255, 182, 193, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
