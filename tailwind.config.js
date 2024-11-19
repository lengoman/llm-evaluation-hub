/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scale: {
        '102': '1.02',
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: 0.4,
          },
          '50%': {
            transform: 'translateY(-4px)',
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};