import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#555BF6',
        secondary: '#FD778B',
        complement1: '#FCFFA8',
        complement2: '#B7F1F4',
        complement3: '#D2E9FF',
        complement4: '#02145C',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-worksans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
