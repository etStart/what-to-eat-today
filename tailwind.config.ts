import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#131313",
        "obsidian-soft": "#1c1b1b",
        "cocoa-panel": "#201f1f",
        "cocoa-panel-alt": "#261914",
        ember: "#E8622A",
        "ember-deep": "#a83900",
        "text-primary": "#e5e2e1",
        "text-secondary": "#e0bfb4",
        "glass-border": "rgba(255, 255, 255, 0.12)",
      },
      boxShadow: {
        "premium-card": "0 20px 40px -10px rgba(0, 0, 0, 0.58)",
        "premium-orange": "0 14px 32px -8px rgba(232, 98, 42, 0.48)",
        "soft-glow": "0 0 60px rgba(232, 98, 42, 0.12)",
      },
      fontFamily: {
        display: ["Epilogue", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        label: ["Space Grotesk", "sans-serif"],
      },
      backgroundImage: {
        "app-surface": "linear-gradient(160deg, #3d2010 0%, #1a0e08 40%, #0d0800 100%)",
        "accent-hero":
          "linear-gradient(135deg, rgba(232, 98, 42, 0.12), rgba(168, 57, 0, 0.02))",
      },
      maxWidth: {
        shell: "28rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
