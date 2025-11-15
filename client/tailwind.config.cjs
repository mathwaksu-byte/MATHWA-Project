/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,jsx,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
      colors: {
        royalBlue: '#1b3b9c',
        golden: '#f5b301',
      },
      backgroundImage: {
        // Site-wide default: Emerald Teal
        'brand-gradient': [
          'radial-gradient(1200px 700px at 8% 0%, rgba(0,128,128,0.44), transparent 65%)',
          'radial-gradient(1100px 640px at 92% 100%, rgba(27,59,156,0.35), transparent 70%)',
          'radial-gradient(900px 520px at 40% 45%, rgba(41,171,226,0.30), transparent 72%)'
        ].join(', '),
        // Kept for fallback if needed
        'page-gradient': 'linear-gradient(180deg, rgba(245,247,255,0.9) 0%, rgba(255,255,255,1) 100%), radial-gradient(1200px 600px at 15% 10%, rgba(30,64,175,0.20), transparent), radial-gradient(1400px 700px at 85% 90%, rgba(59,130,246,0.18), transparent)'
      },
      boxShadow: {
        glow: '0 0 20px rgba(59,130,246,0.35)'
      }
    },
  },
  plugins: [],
}
