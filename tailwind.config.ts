import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Standard Shadcn UI mappings (aligned with flare-ui V4 theme)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          dark: "#22C55E",
          deeper: "#16A34A",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          cyan: "#22D3EE",
          yellow: "#FCD34D",
          red: "#FB7185",
          purple: "#A78BFA",
          orange: "#FB923C",
          blue: "#60A5FA",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // Flare custom classes (to support direct usage on pages)
        "flare-bg": "var(--flare-bg)",
        "flare-surface": "var(--flare-surface)",
        "flare-accent": {
          DEFAULT: "var(--flare-accent)",
          cyan: "var(--flare-accent-cyan)",
        },
        "flare-muted": "var(--flare-muted)",
        "flare-stroke": "var(--flare-stroke)",
        "flare-text-h": "var(--flare-text-h)",
        "flare-text-l": "var(--flare-text-l)",
        "flare-chart-white": "var(--flare-chart-white)",

        // Enigma Legacy Fallbacks
        glass: {
          DEFAULT: "rgba(74, 222, 128, 0.04)",
          dark: "rgba(74, 222, 128, 0.02)",
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
          disabled: "#475569",
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
        "sm": "8px",
        "md": "12px",
        "lg": "16px",
        "xl": "24px",
      },

      backdropBlur: {
        "glass": "20px",
        "heavy": "60px",
      },

      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.35)",
        "glass-premium": "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(74, 222, 128, 0.05)",
        "primary": "0 4px 12px rgba(74, 222, 128, 0.25)",
        "primary-hover": "0 6px 20px rgba(74, 222, 128, 0.35)",
      },

      animation: {
        "fade-in": "fade-in 200ms ease-in-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
