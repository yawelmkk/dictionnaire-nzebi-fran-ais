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
          primary: '#008080', // Vert sarcelle profond
          'primary-light': '#00A0A0',
          'primary-dark': '#006666',
          accent: '#007FFF', // Bleu azur vif
          'accent-light': '#3399FF',
          'accent-dark': '#0066CC',
          surface: '#F5F5F5', // Blanc cassé pour les cartes
          'surface-dark': '#2A2A2A',
          background: '#FFFFFF',
          'background-dark': '#1E1E1E',
          text: '#1E1E1E',
          'text-secondary': '#6B7280',
          'text-dark': '#E5E7EB',
          'text-dark-secondary': '#9CA3AF',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 128, 128, 0.15)',
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


