const path = require('path');

module.exports = {
  mode: "production",
  devtool: "none",
  entry: "./compiled/js/index.js",
  watch: true,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../compiled')
  }
};
