/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hawa: {
          blue: '#0066CC',
          'blue-dark': '#004C99',
          'blue-light': '#3385D9',
          red: '#FF6B6B',
          'red-dark': '#E55555',
          'red-light': '#FF8585',
          coral: '#FF7F7F',
        },
      },
    },
  },
  plugins: [],
}
