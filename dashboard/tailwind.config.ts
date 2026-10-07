import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "niamind-navy": "#0B2545",
        "niamind-teal": "#1A7A8A",
        "niamind-bg": "#F4F6F8",
        "niamind-border": "#DDDDDD",
        "niamind-muted": "#666666",
        "niamind-gold": "#C9973A",
        "niamind-green": "#1B6E4A",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
        card: "0 2px 10px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;