/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: "#0a0e1a",
          800: "#0f1629",
          700: "#151d36",
          600: "#1c2644",
          500: "#243052",
          400: "#2d3b61",
        },
        'neon-blue': "#00d4ff",
        'neon-blue-dim': "#00a3c7",
        'neon-purple': "#a855f7",
        'neon-green': "#22d3ee",
        'neon-red': "#ef4444",
        'neon-orange': "#f97316",
        'neon-yellow': "#eab308",
        severity: {
          critical: "#ef4444",
          high: "#f97316",
          medium: "#eab308",
          low: "#22c55e",
        },
        'glass-bg': "rgba(15, 22, 41, 0.6)",
        'glass-border': "rgba(0, 212, 255, 0.12)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
