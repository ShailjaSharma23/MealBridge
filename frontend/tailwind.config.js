/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          200: '#C9DBC8',
          300: '#A9C4A8',
          400: '#8BA888', // Master Sage Green from UI
          500: '#6E8E6B',
          600: '#547352',
          700: '#3D553C',
          800: '#2E412D',
          900: '#1D2A1C',
        },
        sunburst: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Master Amber Orange from UI
          600: '#D97706',
          700: '#B45309',
        },
        forest: {
          DEFAULT: '#1E352F',
          dark: '#142521',
          light: '#2D4E45',
        },
        warm: {
          DEFAULT: '#F9FAFB',
          cream: '#FAF7F2',
          card: '#FFFFFF',
          border: '#E8ECE8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(139, 168, 136, 0.12)',
        card: '0 10px 30px -4px rgba(45, 74, 62, 0.06)',
        hover: '0 16px 36px -6px rgba(139, 168, 136, 0.22)',
      },
    },
  },
  plugins: [],
};
