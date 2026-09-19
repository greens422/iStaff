import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        brand: "var(--color-brand)",
        "brand-ink": "var(--color-brand-ink)",
        danger: "var(--color-danger)",
        ok: "var(--color-ok)",
      },
      borderRadius: { card: "var(--radius-card)", control: "var(--radius-control)" },
    },
  },
  plugins: [],
};

export default config;
