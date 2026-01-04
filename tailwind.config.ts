import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 8-bit Neon Palette
        'neon-lime': '#00FF41',
        'neon-orange': '#FF6B00',
        'hot-pink': '#FF10F0',
        'cyber-blue': '#00D9FF',
        'neon-yellow': '#FFFF00',
        'deep-purple': '#1A0033',
        'dark-navy': '#0A0E27',
        'charcoal': '#1C1C1C',

        // Avatar Skin Tones
        'skin-porcelain': '#FFE0BD',
        'skin-beige': '#F1C27D',
        'skin-tan': '#C68642',
        'skin-bronze': '#8D5524',
        'skin-brown': '#5C3317',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'mono': ['"DM Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'neon-sm': '0 0 5px currentColor, 0 0 10px currentColor',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
