import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs modernes 2024 - Minimalisme Chaleureux
        nzebi: {
          // iOS-style "Terre Nzebi" warm earthen palette
          primary: '#E8A95B',          // Gold accent (active/headword)
          'primary-light': '#F0BC7E',
          'primary-dark': '#C68B3F',
          accent: '#E8A95B',           // Same gold for dark mode parity
          'accent-light': '#F0BC7E',
          'accent-dark': '#C68B3F',
          surface: '#2B201A',          // Card surface
          'surface-dark': '#2B201A',
          'surface-elevated': '#3D2E24',
          background: '#1A1410',       // App background (dark earth)
          'background-dark': '#1A1410',
          text: '#D4CDC4',             // Warm off-white
          'text-secondary': '#A39689',
          'text-dark': '#D4CDC4',
          'text-dark-secondary': '#A39689',
          divider: '#3D2E24',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(232, 169, 91, 0.15)',
      },
      animation: {
        'pop': 'pop 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;


