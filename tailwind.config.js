/** Tailwind build config (used by the Tailwind CLI to generate tailwind.css) */
module.exports = {
  content: ['./index.html', './404.html', './main.js', './orokin-bg.js'],
  theme: {
    extend: {
      colors: {
        darkBg: '#11151c',
        cardBg: '#1b222c',
        accent: '#ff6a00',
        accentHover: '#cc5500'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif']
      }
    }
  }
};
