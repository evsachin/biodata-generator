/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf3f3', 100: '#fbe4e4', 200: '#f5c4c4', 300: '#ec9a9a', 400: '#dd6464',
          500: '#c73a3a', 600: '#a92626', 700: '#8b1a1a', 800: '#701717', 900: '#5a1616',
        },
        cream: { 50: '#fffdf8', 100: '#fff8ec', 200: '#fbecd0' },
      },
      fontFamily: {
        sans: ['Mukta', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        display: ['"Yatra One"', 'Mukta', 'serif'],
      },
      boxShadow: { soft: '0 6px 24px -8px rgba(90,22,22,.25)' },
    },
  },
  plugins: [],
};
