/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8F5',
        fg: '#1A1816',
        muted: '#6B6560',
        accent: '#C47D5E',
        card: '#F3F0EC',
        border: '#E5E0DA',
        linen: '#F5F2ED',
        warm: '#EDE8E1',
        charcoal: '#2A2622',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(-5px) translateX(-5px)' },
          '75%': { transform: 'translateY(-15px) translateX(3px)' },
        },
      },
    },
  },
  plugins: [],
}
