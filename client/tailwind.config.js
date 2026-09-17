/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFF3EF',
          100: '#FFE4D9',
          200: '#FFB899',
          300: '#FF8C5F',
          400: '#FF6B35',
          500: '#E55020',
          600: '#C23F18',
          700: '#9A2F10',
        },
        secondary: {
          DEFAULT: '#1A1A2E',
          light: '#16213E',
          lighter: '#0F3460',
        },
        accent: '#FFBE0B',
        cafe: {
          bg: '#F8F4F0',
          card: '#FFFFFF',
          text: '#2D2D2D',
          muted: '#6B7280',
          border: '#E5DDD5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 15px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(255,107,53,0.15)',
        float: '0 -4px 20px rgba(0,0,0,0.10)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
        'pulse-once': 'pulseOnce 0.4s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseOnce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
