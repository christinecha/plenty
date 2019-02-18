const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/components/index.js',
  mode: 'production',
  watch: true,
  output: {
    path: path.resolve(__dirname, './public/scripts'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ],
  }
}
