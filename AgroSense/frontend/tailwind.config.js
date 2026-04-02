/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      colors: {
        em: {
          50:  '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b', 950: '#022c22',
        },
        ink: {
          50: '#eef2ef', 100: '#d5e0d9', 200: '#a8bfb0', 300: '#7a9d88',
          400: '#527a62', 500: '#3a5c49', 600: '#2c4638', 700: '#1f3129',
          800: '#121d18', 900: '#0a1410', 950: '#050b08',
        },
      },
    },
  },
  plugins: [],
}
