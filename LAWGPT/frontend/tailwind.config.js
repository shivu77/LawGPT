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
        primary: {
          text: '#111827', // gray-900
          textSecondary: '#6b7280', // gray-500
          border: '#d1d5db', // gray-300
        },
        background: '#ffffff', // white
        foreground: '#111827', // For text content
        muted: {
          DEFAULT: '#f3f4f6', // gray-100
          foreground: '#6b7280', // gray-500
        },
        border: '#d1d5db', // gray-300
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Press Start 2P', 'Pixel Operator', 'monospace'], // For logos/display titles
        mono: ['Roboto Mono', 'IBM Plex Mono', 'monospace'], // For numbers/metrics
        code: ['JetBrains Mono', 'Roboto Mono', 'monospace'], // For code tabs/technical text
        robo: ['Orbitron', 'sans-serif'], // Futuristic/robotic font
        fantasy: ['Exo 2', 'Rajdhani', 'sans-serif'], // Fantasy/Sci-Fi font (Star Wars style)
        serif: ['Playfair Display', 'Times New Roman', 'serif'], // Elegant serif font
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 4px 10px rgba(0,0,0,0.05)',
        cardHover: '0 6px 14px rgba(0,0,0,0.08)',
      },
      spacing: {
        'gap': '24px',
      },
      maxWidth: {
        'container': '1320px',
        'hero': '720px',
      },
      lineHeight: {
        'tight': '1.1',
      },
      letterSpacing: {
        'label': '0.1em',
        'display': '0.05em', // Slightly expanded for uppercase labels
        'wide': '0.05em', // For uppercase text
      },
    },
  },
  plugins: [],
}

