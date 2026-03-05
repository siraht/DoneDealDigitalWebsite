import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff7b00',
        navy: '#0b1d33',
        concrete: '#e2e8f0',
        'background-light': '#f6f6f8',
        'background-dark': '#0b1d33',
        'grid-gray': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        display: ['Work Sans', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
        dmsans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0',
        lg: '0',
        xl: '0',
        full: '9999px',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  darkMode: 'class',
  plugins: [forms, containerQueries],
};
