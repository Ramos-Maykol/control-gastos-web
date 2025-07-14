/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ¡IMPORTANTE! Asegúrate de que esta línea esté correcta para escanear tus archivos React.
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define la fuente Inter para usarla con `font-inter`
      },
      keyframes: { // Aquí definimos las animaciones directamente en Tailwind
        'gradient-shift': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(-10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'blob': { // Animación para los círculos de fondo
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        // --- NUEVAS ANIMACIONES AÑADIDAS ---
        'slide-in-up': { // Para modales que aparecen desde abajo
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-once': { // Para el icono de completado de metas
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: { // Aquí asignamos nombres a las animaciones definidas arriba
        'gradient-shift': 'gradient-shift 10s ease infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'blob': 'blob 7s infinite cubic-bezier(0.6, 0.01, 0.4, 1)',
        // --- NUEVAS ANIMACIONES AÑADIDAS ---
        'slide-in-up': 'slide-in-up 0.3s ease-out forwards',
        'bounce-once': 'bounce-once 0.8s ease-out 1', // '1' significa que se ejecuta una sola vez
      },
    },
  },
  plugins: [],
}
