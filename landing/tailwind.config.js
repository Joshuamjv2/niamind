/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        niamind: {
          navy: "#0B2545",
          teal: "#1A7A8A",
          green: "#1B6E4A",
          gold: "#C9973A",
          coral: "#C0392B",
          bg: "#F7FAFC",
          card: "#FFFFFF",
          text: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(11, 37, 69, 0.12)",
        card: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
