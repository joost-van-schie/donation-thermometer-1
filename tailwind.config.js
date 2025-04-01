/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a2683', // Woord & Daad purple
        secondary: '#f49b28', // Woord & Daad orange/gold
        accent: '#e17000', // Deeper orange for emphasis
        background: '#f9f9f9', // Lighter background
        text: '#4a4a4a', // Darker text for better readability
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}