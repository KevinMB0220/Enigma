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
        // Enigma Design System Colors
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",

        primary: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
          deeper: "#1E40AF",
        },

        glass: {
          DEFAULT: "rgba(15, 17, 23, 0.6)",
          dark: "rgba(17, 24, 39, 0.8)",
        },

        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },

        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },

        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          light: "rgba(255, 255, 255, 0.1)",
          primary: "rgba(59, 130, 246, 0.3)",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Fira Code", "Consolas", "monospace"],
      },

      fontSize: {
        "hero": ["64px", { lineHeight: "1.1", fontWeight: "800" }],
        "hero-mobile": ["42px", { lineHeight: "1.2", fontWeight: "800" }],
        "stat": ["40px", { lineHeight: "1", fontWeight: "800" }],
      },

      borderRadius: {
        "glass": "16px",
      },

      backdropBlur: {
        "glass": "20px",
      },

      boxShadow: {
        "glass": "0 4px 24px rgba(0, 0, 0, 0.4)",
        "primary": "0 4px 12px rgba(59, 130, 246, 0.3)",
        "primary-hover": "0 6px 20px rgba(59, 130, 246, 0.4)",
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
