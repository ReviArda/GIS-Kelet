/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matching User's "Emerald + Slate" theme
        primary: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        slate: {
          light: '#94a3b8',
          DEFAULT: '#64748b',
          dark: '#475569',
        }
      }
    },
  },
  plugins: [],
}
