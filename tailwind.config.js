/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          ink: '#0a0a0a',
          paper: '#faf9f7',
          warm: '#f5f0eb',
          accent: '#e85d3a',
          muted: '#9c9589',
          border: '#e8e4de',
          surface: '#ffffff',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04)',
        'panel': '0 0 0 1px rgba(0,0,0,0.04), 0 8px 40px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
