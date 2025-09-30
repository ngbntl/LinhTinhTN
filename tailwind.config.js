/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mplus: ["M PLUS Rounded 1c", "sans-serif"],
        hiragino: ["Hiragino Kaku Gothic ProN", "sans-serif"],
        ryumin: ["A-OTF Ryumin Pro", "serif"],
        shingo: ["A-OTF Shin Go Pro", "sans-serif"],
        trajan: ["Trajan Pro", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["A-OTF Ryumin Pro", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(0, 0%, 91%)",
        foreground: "hsl(240, 10%, 3.9%)",
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(240, 10%, 3.9%)",
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(240, 10%, 3.9%)",
        },

        primary: {
          DEFAULT: "hsl(234, 73%, 59%)",
          foreground: "hsl(0, 0%, 98%)",
          light: "hsl(231, 71%, 72%)",
          5: "hsl(231, 71%, 93%)",
          10: "hsl(231, 71%, 87%)",
          15: "hsl(231, 71%, 83%)",
          20: "hsl(231, 71%, 72%)",
          25: "hsl(231, 71%, 67%)",
          30: "hsl(231, 71%, 60%)",
          35: "hsl(231, 71%, 52%)",
          40: "hsl(231, 71%, 45%)",
          45: "hsl(231, 71%, 38%)",
          50: "hsl(231, 71%, 30%)",
          100: "hsl(231, 71%, 25%)",
          200: "hsl(231, 71%, 22%)",
          300: "hsl(231, 71%, 19%)",
          400: "hsl(231, 71%, 16%)",
          500: "hsl(231, 71%, 14%)",
          600: "hsl(231, 71%, 11%)",
          700: "hsl(231, 71%, 8%)",
          800: "hsl(231, 71%, 5%)",
          900: "hsl(231, 71%, 3%)",
        },

        // Secondary colors
        secondary: {
          DEFAULT: "hsl(51, 60%, 39%)",
          foreground: "hsl(240, 5.9%, 10%)",
          light: "hsl(51, 60%, 52%)",
          5: "hsl(51, 60%, 94%)",
          10: "hsl(51, 60%, 88%)",
          15: "hsl(51, 60%, 82%)",
          20: "hsl(51, 60%, 76%)",
          25: "hsl(51, 60%, 70%)",
          30: "hsl(51, 60%, 64%)",
          35: "hsl(51, 60%, 58%)",
          40: "hsl(51, 60%, 52%)",
          45: "hsl(51, 60%, 46%)",
          50: "hsl(51, 60%, 39%)",
          100: "hsl(51, 60%, 34%)",
          200: "hsl(51, 60%, 30%)",
          300: "hsl(51, 60%, 25%)",
          400: "hsl(51, 60%, 21%)",
          500: "hsl(51, 60%, 18%)",
          600: "hsl(51, 60%, 14%)",
          700: "hsl(51, 60%, 11%)",
          800: "hsl(51, 60%, 8%)",
          900: "hsl(51, 60%, 5%)",
        },

        gray: "hsl(0, 0%, 82%)",
        muted: {
          DEFAULT: "hsl(240, 4.8%, 95.9%)",
          foreground: "hsl(240, 3.8%, 46.1%)",
        },
        accent: {
          DEFAULT: "hsl(240, 4.8%, 95.9%)",
          foreground: "hsl(240, 5.9%, 10%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84.2%, 60.2%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        border: "hsl(240, 5.9%, 90%)",
        input: "hsl(240, 5.9%, 90%)",
        ring: "hsl(240, 10%, 3.9%)",

        // Shades
        shades: {
          DEFAULT: "hsl(346, 79%, 55%)",
        },

        // Notify colors
        "notify-success": {
          bg: "hsl(140, 38%, 86%)",
          text: "hsl(140, 58%, 20%)",
        },
        "notify-error": {
          bg: "hsl(0, 100%, 94%)",
          text: "hsl(348, 63%, 28%)",
        },
        "notify-warn": {
          bg: "hsl(48, 88%, 96%)",
          text: "hsl(45, 95%, 27%)",
        },
        "notify-info": {
          bg: "hsl(200, 33%, 93%)",
          text: "hsl(200, 100%, 27%)",
        },

        // Text error
        "text-error": "hsl(348, 79%, 56%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
