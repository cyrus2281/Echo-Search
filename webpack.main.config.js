const webpack = require('webpack')
const package = require('./package.json')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PACKAGE': JSON.stringify({
        version: package.version,
        author: package.author,
        homepage: package.homepage,
        buyMeACoffee: package.buyMeACoffee,
      }),
    }),
  ]
};
