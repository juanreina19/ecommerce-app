/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        surface: {
          DEFAULT: "#0F0F14",
          card:    "#16161E",
          border:  "#2A2A38",
          muted:   "#1E1E2A",
        },
        accent: {
          DEFAULT: "#6366F1",
          soft:    "#818CF8",
          glow:    "rgba(99,102,241,0.15)",
        },
      },
      fontFamily: {
        sans:  ["SpaceGrotesk-Regular"],
        medium:["SpaceGrotesk-Medium"],
        bold:  ["SpaceGrotesk-Bold"],
        mono:  ["SpaceMono-Regular"],
      },
    },
  },
  plugins: [],
};
