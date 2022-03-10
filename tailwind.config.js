module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Lato', 'sans-serif'],
        body: ['Noto sans', 'sans-serif'],
        extra: ['Patua One', 'cursive'],
      },
      colors: {
        current: 'currentColor',
        canadaBlue: '#1C578A',
        canadaDarkBlue: '#26374A',
      },
      keyframes: {
        'pulsate-fwd': {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.02)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        'pulsate-fwd': 'pulsate-fwd 1s ease-in-out infinite both',
      },
      backgroundImage: () => ({
        'footer-parliament-image': 'url(../public/landscape.png)',
        // 'splash-page': 'url(../public/sp-bg-1.jpg)',
      }),
      boxShadow: {
        card: '0px 2px 8px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
