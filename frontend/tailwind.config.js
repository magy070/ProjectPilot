/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        'accent-orange': 'var(--color-accent-orange)',
        'accent-green': 'var(--color-accent-green)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Bebas Neue"', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        blackops: ['"Black Ops One"', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.05', fontWeight: '800' }],
        'title': ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
        'subtitle': ['1.375rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'meta': ['0.875rem', { lineHeight: '1.43', fontWeight: '400' }],
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(58, 95, 11, 0.25)',
        'glow-secondary': '0 0 25px rgba(196, 154, 74, 0.25)',
        'glow-orange': '0 0 25px rgba(228, 122, 46, 0.3)',
        'hud': '0 0 10px rgba(0, 0, 0, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(196, 154, 74, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(228, 122, 46, 0.5)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
      },
    },
  },
  plugins: [],
};
