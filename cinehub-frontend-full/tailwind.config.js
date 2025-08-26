/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { background:'#0B0B0F', foreground:'#E5E5E5', primary:'#E50914', muted:'#9BA3AF' },
      boxShadow: { card:'0 8px 24px rgba(0,0,0,0.35)' }
    },
  },
  plugins: [],
}
