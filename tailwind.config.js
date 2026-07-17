/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#f0f4ff',
          100: '#dfe7ff',
          200: '#bfd0ff',
          300: '#8ca8ff',
          400: '#5d7bfd',
          500: '#3355f7',
          600: '#243dd6',
          700: '#1f319e',
          800: '#18256f',
          900: '#101a4a'
        }
      },
      boxShadow: {
        glow: '0 20px 60px rgba(51, 85, 247, 0.25)'
      }
    }
  },
  plugins: []
};