import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette — restrained, used with intention
        ink: "#050505",        // near-black (dominant)
        paper: "#F0EDE6",      // off-white (shock contrast)
        acid: "#00FF94",       // acid green (single accent)
        danger: "#FF3B00",     // electric red-orange
        surface: "#0A0A0A",    // surface
        "tint-green": "#0A1A0A",
        "tint-navy": "#050A14",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        editorial: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        ui: ["var(--font-dm)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "10v": "10vw",
        "12v": "12vw",
        "15v": "15vw",
        "20v": "20vw",
        "25v": "25vw",
      },
      letterSpacing: {
        tightest: "-0.05em",
        brutalist: "-0.04em",
      },
      animation: {
        "marquee-left": "marquee-left 40s linear infinite",
        "marquee-right": "marquee-right 40s linear infinite",
        "blink": "blink 1s steps(1) infinite",
        "spin-slow": "spin 60s linear infinite",
      },
      keyframes: {
        "marquee-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
