/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        cream: '#e9ebdf',
        grass: '#78bf30',
        ink: '#284010',
      },
      fontFamily: {
        display: ['"Londrina Solid"', 'sans-serif'],
        hand: ['"Gochi Hand"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
