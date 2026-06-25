/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0faf4',
          100: '#dcf3e5',
          200: '#bae8cc',
          300: '#87d4a8',
          400: '#4fb87e',
          500: '#2d9d5f',
          600: '#1e7d49',
          700: '#1a6340',
          800: '#174f35',
          900: '#14412c',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
