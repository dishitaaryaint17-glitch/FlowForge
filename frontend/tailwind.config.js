/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f1628',
        panel: '#121b30',
        accent: '#4cc9f0',
        glow: '#f4d35e',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        neo: '8px 8px 20px rgba(5, 8, 17, 0.7), -8px -8px 20px rgba(34, 46, 74, 0.45)',
        glass: '0 8px 24px rgba(13, 20, 39, 0.45)',
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.5s ease both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

