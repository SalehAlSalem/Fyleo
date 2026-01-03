/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'shimmer': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      screens: {
        "mobile-sm": {
          max: '400px',
        },
        mobile: {
          max: '531px',
        },
        'anti-mobile': {
          min: '531px',
          max: '640px',
        },
        'max-sm': {
          max: '640px',
        },
        'max-md': {
          max: '768px',
        },
        'max-lg': {
          max: '1024px',
        },
        'max-xl': {
          'max': '1280px'
        },
        'max-2xl': {
          'max': '1536px'
        },
        'anti-ham': {
          'min': '500px'
        },
        'hero-section-sm': {
          'max': '670px',
        },
        'hero-section': {
          'min': '670px',
          'max': '800px',
        },
        'hero-section-lg': {
          'min': '800px',
          'max': '960px',
        },
      }
    },
  },

  plugins: [],
}
