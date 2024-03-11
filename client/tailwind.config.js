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
        'light-primary-bg': '#D7D7D7',
        'light-secondary-bg': '#F5F5F5',
        'the-accent-color': '#4F46E5'
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
