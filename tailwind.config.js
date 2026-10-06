/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        katana: {
          black: '#050204',
          coal: '#0a0608',
          ash: '#14090c',
          crimson: '#c8102e',
          blood: '#8b0a1a',
          ember: '#e63946',
          gold: '#d4af37',
          silver: '#c0c0c0',
          bone: '#e8e2d5',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        cinematic: ['"Cinzel"', 'serif'],
        body: ['"Rajdhani"', 'sans-serif'],
        rap: ['"Bebas Neue"', 'sans-serif'],
      },
      animation: {
        'smoke-drift': 'smokeDrift 20s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'rain': 'rain linear infinite',
        'float-up': 'floatUp linear infinite',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
      },
      keyframes: {
        smokeDrift: {
          '0%,100%': { transform: 'translate(0,0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translate(30px,-20px) scale(1.2)', opacity: '0.6' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '41%': { opacity: '1' },
          '42%': { opacity: '0.3' },
          '43%': { opacity: '1' },
          '45%': { opacity: '0.4' },
          '46%': { opacity: '1' },
        },
        glowPulse: {
          '0%,100%': { textShadow: '0 0 10px rgba(200,16,46,0.5), 0 0 20px rgba(200,16,46,0.3)' },
          '50%': { textShadow: '0 0 20px rgba(200,16,46,0.8), 0 0 40px rgba(200,16,46,0.5)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(-10vh) scale(1)', opacity: '0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        heartbeat: {
          '0%,100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.15)' },
          '20%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.12)' },
          '40%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
