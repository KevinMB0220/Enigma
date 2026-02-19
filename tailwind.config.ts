import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enigma Design System Colors — Fintech Glassmorphism
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",

        primary: {
          DEFAULT: "#4ADE80",   // Green — brand primary
          dark: "#22C55E",
          deeper: "#16A34A",
          foreground: "#0B0F14",
        },

        // shadcn semantic tokens — Enigma dark theme
        muted: {
          DEFAULT: "rgba(31, 41, 55, 0.5)",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#0E141B",
          foreground: "#E5E7EB",
        },
        secondary: {
          DEFAULT: "rgba(31, 41, 55, 0.5)",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FB7185",
          foreground: "#FFFFFF",
        },
        input: "rgba(255, 255, 255, 0.08)",
        ring: "rgba(74, 222, 128, 0.4)",

        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          dark: "rgba(255, 255, 255, 0.02)",
        },

        status: {
          success: "#4ADE80",
          warning: "#FCD34D",
          error: "#FB7185",
        },

        text: {
          primary: "#E5E7EB",
          secondary: "#94A3B8",
          muted: "#64748B",
        },

        border: {
          subtle: "rgba(255, 255, 255, 0.05)",
          light: "rgba(255, 255, 255, 0.08)",
          primary: "rgba(74, 222, 128, 0.3)",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "Consolas", "monospace"],
      },

      fontSize: {
        "hero": ["64px", { lineHeight: "1.1", fontWeight: "800" }],
        "hero-mobile": ["42px", { lineHeight: "1.2", fontWeight: "800" }],
        "stat": ["40px", { lineHeight: "1", fontWeight: "800" }],
      },

      borderRadius: {
        "glass": "12px",
      },

      backdropBlur: {
        "glass": "20px",
      },

      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.35)",
        "glass-premium": "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        "primary": "0 4px 12px rgba(74, 222, 128, 0.25)",
        "primary-hover": "0 6px 20px rgba(74, 222, 128, 0.35)",
      },

      animation: {
        "twinkle": "twinkle 3s ease-in-out infinite",
        "spotlight-pulse": "spotlight-pulse 6s ease-in-out infinite",
        "fade-in": "fade-in 200ms ease-in-out",
      },

      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "spotlight-pulse": {
          "0%, 100%": { opacity: "0.15", transform: "scale(1)" },
          "50%": { opacity: "0.25", transform: "scale(1.1)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
