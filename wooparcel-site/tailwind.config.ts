import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        obsidian: '#0B0C0E',
        'elevated-1': '#0F1113',
        'elevated-2': '#14161A',
        'elevated-3': '#1A1D22',

        // Accent colors
        woop: {
          DEFAULT: '#D77A00',
          light: '#E8943A',
          glow: '#FFC57A',
          dark: '#B86A00',
        },
        cyan: {
          DEFAULT: '#4ECDC4',
          light: '#7EDDDA',
          dark: '#3ABBB3',
        },

        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#BFC6CC',
        'text-muted': '#6B7280',
        'text-faint': '#4B5563',

        // Semantic
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',

        // Borders
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          light: 'rgba(255, 255, 255, 0.1)',
          accent: 'rgba(215, 122, 0, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-hero': ['64px', { lineHeight: '1.1', fontWeight: '700' }],
        'display-h1': ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        'display-h2': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'display-h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-large': ['20px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-default': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-default': ['13px', { lineHeight: '1', fontWeight: '600' }],
        'label-badge': ['12px', { lineHeight: '1', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(215, 122, 0, 0.15)',
        'button': '0 4px 20px rgba(215, 122, 0, 0.3)',
        'button-hover': '0 8px 32px rgba(215, 122, 0, 0.4)',
        'glow': '0 0 60px rgba(215, 122, 0, 0.3)',
        'glow-lg': '0 0 100px rgba(215, 122, 0, 0.4)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'fast': '180ms',
        'normal': '280ms',
        'slow': '420ms',
        'slower': '600ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fadeUp 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 60px rgba(215, 122, 0, 0.2)' },
          '50%': { boxShadow: '0 0 100px rgba(215, 122, 0, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-woop': 'linear-gradient(135deg, #D77A00 0%, #B86A00 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(215, 122, 0, 0.15) 0%, transparent 70%)',
        'gradient-hero': 'radial-gradient(ellipse at 50% 0%, rgba(215, 122, 0, 0.08) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}

export default config
