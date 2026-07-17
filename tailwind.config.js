/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213D',
        paper: '#F7F5EF',
        paperCard: '#FFFDF8',
        amber: '#E8A33D',
        forest: '#2F6B4F',
        coral: '#C1443C',
        slate: '#5B6472',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        ticket: '0 16px 45px rgba(20, 33, 61, 0.08)',
      },
    },
  },
  plugins: [],
};
