/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#06090E',
          900: '#0A0E17',
          850: '#0F1523',
          800: '#141D30',
          700: '#1C2842',
          600: '#27385B',
          500: '#3B5280',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-focus': 'rgba(6, 182, 212, 0.4)',
        },
        cyan: {
          glow: '#00F0FF',
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
        },
        violet: {
          phase: '#8B5CF6',
          light: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        subtle: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        instrument: '0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 30px rgba(0, 0, 0, 0.4)',
        active: '0 0 0 1px rgba(6, 182, 212, 0.5), 0 4px 20px rgba(6, 182, 212, 0.15)',
      },
      borderRadius: {
        panel: '14px',
        control: '10px',
      }
    },
  },
  plugins: [],
}

