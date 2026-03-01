/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brevly: {
          gray: '#E4E6EC',   /* fundo da página */
          card: '#FFFFFF',  /* cards brancos */
          text: '#1F2025',
          muted: '#4D505C',
          placeholder: '#74798B',
          border: '#CDCFD5',
          primary: '#2C46B1',
        },
      },
    },
  },
  plugins: [],
};
