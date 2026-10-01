/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yt: {
          bg: '#0f0f0f',
          surface: '#1f1f1f',
          surfaceHover: '#282828',
          border: '#383838',
          red: '#ff0000',
          redHover: '#cc0000',
          pill: '#272727',
          pillHover: '#383838',
          pillActive: '#f1f1f1',
          text: '#f1f1f1',
          textSec: '#aaaaaa',
          badge: 'rgba(0, 0, 0, 0.82)',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
