/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f7',
          100: '#dbf0ea',
          200: '#b8e0d3',
          300: '#8fcab9',
          400: '#5fac99',
          500: '#3d8f7c',
          600: '#2f7365',
          700: '#285d52',
          800: '#224a42',
          900: '#1d3d37',
        },
        accent: {
          50: '#fdf3f0',
          100: '#fbe3db',
          200: '#f5c4b3',
          300: '#eda087',
          400: '#e17c5c',
          500: '#cf6544',
          600: '#b04f34',
          700: '#8f402c',
          800: '#733528',
          900: '#602e24',
        },
        surface: {
          50: '#faf9f7',
          100: '#f3f1ee',
          200: '#e7e3de',
          300: '#d6d0c8',
          400: '#a8a096',
          500: '#7d7568',
          600: '#5c554b',
          700: '#453f38',
          800: '#302b26',
          900: '#211d19',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
