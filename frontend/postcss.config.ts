// postcss.config.js

module.exports = {
  plugins: [
    require('@tailwindcss/postcss'), // Ensure this is properly referenced
    require('autoprefixer'),         // Autoprefixer plugin for better browser compatibility
  ],
};
