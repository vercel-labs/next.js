const path = require('path');
module.exports = {
  plugins: [
    require('tailwindcss')(require('./tailwind.config.js')),
    require('autoprefixer'),
  ],
};
