/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        primary: '#6366F1',
        secondary: '#8B5CF6',
        text: '#FFFFFF',
        muted: '#A1A1AA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Defined standard design system typographic scale
        'hero': ['3rem', { lineHeight: '1.15', fontWeight: '800' }], // text-5xl
        'title': ['1.875rem', { lineHeight: '1.25', fontWeight: '700' }], // text-3xl
        'subtitle': ['1.25rem', { lineHeight: '1.5', fontWeight: '500' }], // text-xl
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // text-base
        'meta': ['0.875rem', { lineHeight: '1.43', fontWeight: '400' }], // text-sm
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-secondary': '0 0 20px rgba(139, 92, 246, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
