import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing Pepper palette
        bg: '#FAF8F5',
        fg: '#1A1816',
        muted: '#6B6560',
        accent: '#C47D5E',
        card: '#F3F0EC',
        border: '#E5E0DA',
        linen: '#F5F2ED',
        warm: '#EDE8E1',
        charcoal: '#2A2622',

        // shadcn system colors
        background: '#FAF8F5',
        foreground: '#1A1816',
        primary: '#C47D5E',
        'primary-foreground': '#FAF8F5',
        secondary: '#EDE8E1',
        'secondary-foreground': '#1A1816',
        destructive: '#DC2626',
        'destructive-foreground': '#FFFFFF',
        'card-foreground': '#1A1816',
        'muted-foreground': '#6B6560',
        'accent-foreground': '#FAF8F5',
        popover: '#FAF8F5',
        'popover-foreground': '#1A1816',
        input: '#E5E0DA',
        ring: '#C47D5E',
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
  plugins: [tailwindcssAnimate],
}
