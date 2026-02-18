/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        k8s: {
          blue: '#326CE5',
          darkBlue: '#1a3a6e',
          lightBlue: '#4a90e2',
        }
      }
    },
  },
  plugins: [],
}
