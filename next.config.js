module.exports = {
  turbopack: {
    rules: {
      '*.txt': { loaders: ['./my-loader.js'], as: '*.js' },
    },
  },
};
