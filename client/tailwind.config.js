/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      'title': ['"Barlow"'],
      'subtitle': ['"Source Sans 3"'],
      'body': ['"Montserrat"'],
    }
  },
  plugins: [],
}
