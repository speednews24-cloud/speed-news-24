export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { red: '#e50914', black: '#090909', ink: '#171717', paper: '#ffffff' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Noto Sans Devanagari', 'Arial', 'sans-serif']
      },
      boxShadow: {
        news: '0 16px 50px rgba(0,0,0,0.14)'
      }
    }
  },
  plugins: []
};
