const path = require('path');

module.exports = {  
  mode: "production",
  devtool: "none",
  entry: "./compiled/js/index.js",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../compiled')
  },
  resolve: {
      modules: [
          'node_modules',
          path.resolve(__dirname, 'src')
      ]
  }
};
