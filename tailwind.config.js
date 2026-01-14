/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f5f3ff',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
    },
  },
  plugins: [],
}