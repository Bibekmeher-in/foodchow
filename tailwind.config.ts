import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0AA89E",
          hover: "#088c83",
          light: "#e6f7f6",
          50: "#f0fdfc",
          100: "#ccfbf7",
          200: "#99f6ee",
          300: "#5eead9",
          400: "#2dd4be",
          500: "#0AA89E",
          600: "#088c83",
          700: "#066f68",
        },
        brand: {
          dark: "#1f2430",
          gray: "#7d7d7d",
          border: "#dadada",
          bg: "#f3f4f6",
        }
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
        float: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }
    },
  },
  plugins: [],
};
export default config;
