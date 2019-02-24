const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PUBLIC_PATH = path.join(__dirname, 'public')
const PUBLIC_SCRIPTS_PATH = path.resolve(PUBLIC_PATH, 'scripts')

module.exports = {
  entry: './src/components/index.js',
  mode: 'development',
  watch: true,
  output: {
    path: path.resolve(__dirname, './public/scripts'),
    publicPath: '/scripts/',
    filename: 'index.js'
  },
  devServer: {
    port: 9000,
    proxy: {
      '*': {
        target: 'http://localhost:4000/',
        secure: false
      }
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(PUBLIC_SCRIPTS_PATH),
  ],
}
