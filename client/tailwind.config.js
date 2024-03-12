/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-primary-bg': '#0F0C11',
        'dark-secondary-bg': '#201822',
        'dark-tertiary-bg': '#47334D',
        'light-primary-bg': '#EEF2FF',
        'light-secondary-bg': '#FFFFFF',
        'light-tertiary-bg': '#EAEAEA',
        'the-accent-color': '#E8F0F7'
      },
    },
    fontFamily: {
      'title': ['"Barlow"'],
      'subtitle': ['"Source Sans 3"'],
      'body': ['"Montserrat"'],
    }
  },
  plugins: [],
}
