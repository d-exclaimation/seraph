/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      animation: {
        "fades-in": "fades-in 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-up": "slide-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "inc-height": "inc-height 0.5s ease-out",
      },
      keyframes: {
        "fades-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "inc-height": {
          "0%": { height: "0" },
          "100%": { height: "attr(height)" },
        }
      }
    },
  },
  plugins: [],
}

