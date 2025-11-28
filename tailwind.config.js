/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        safe: {
          primary: '#2563eb',
          secondary: '#1e40af',
          danger: '#dc2626',
          warning: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
};

