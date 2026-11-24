/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        monokai: {
          bg: '#1a1b18',         // Deep sleek Monokai base
          panel: '#242520',      // Elevated container/card
          subpanel: '#2d2e28',   // Inner card / table header
          hover: '#373831',      // Row hover
          border: '#3c3d36',     // Card & table border
          borderLight: '#4a4b43',
          darker: '#131412',     // Darkest shade for inputs / canvas
          text: '#f8f8f2',       // Off-white bright typography
          muted: '#9e9d91',      // Secondary text
          dim: '#6d6c60',        // Placeholder & timestamp
          // Syntax highlights for badges & tags
          yellow: '#e6db74',
          pink: '#f92672',
          green: '#a6e22e',
          purple: '#ae81ff',
          orange: '#fd971f',
          cyan: '#66d9ef'
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'teal-glow': '0 0 20px -3px rgba(20, 184, 166, 0.35)',
        'teal-glow-lg': '0 0 30px -4px rgba(20, 184, 166, 0.45)',
        'monokai-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'monokai-modal': '0 20px 40px -10px rgba(0, 0, 0, 0.8)'
      }
    },
  },
  plugins: [],
}
