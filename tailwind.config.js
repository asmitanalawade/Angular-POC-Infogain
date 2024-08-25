/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Just-in-Time mode
  purge: ['./src/**/*.{html,ts,scss}'], // Adjust paths to include all files where you use Tailwind classes
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
