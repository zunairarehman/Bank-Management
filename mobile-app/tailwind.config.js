/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bank: { primary: '#0c4a6e', accent: '#f59e0b', light: '#e0f2fe' },
      },
    },
  },
  plugins: [],
};
