import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [i, (i / 100).toString()])
      ),
      colors: {
        // Кольори Національної поліції України
        navy: {
          950: "#050D1F",
          900: "#081428",
          800: "#0A1E3D",
          700: "#0E2A54",
          600: "#123A72",
          500: "#1E5BB8",
          400: "#2E71D6",
          300: "#5B93E4",
        },
        ice: "#F4F7FB",
        steel: "#8CA0BC",
        // національний жовтий — акцент, дуже дозовано
        signal: "#FFD400",
        good: "#22C55E",
        warn: "#F59E0B",
        bad: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        head: ["var(--font-head)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(8,20,40,.06), 0 12px 32px -12px rgba(8,20,40,.28)",
        glow: "0 0 0 1px rgba(46,113,214,.35), 0 18px 60px -20px rgba(30,91,184,.55)",
        inset: "inset 0 1px 0 rgba(255,255,255,.08)",
      },
      backgroundImage: {
        "grid-navy":
          "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-led": {
          "0%,100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(34,197,94,.6)" },
          "50%": { opacity: ".55", boxShadow: "0 0 0 6px rgba(34,197,94,0)" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%)" },
          "60%,100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        "pulse-led": "pulse-led 1.8s ease-in-out infinite",
        sheen: "sheen 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
