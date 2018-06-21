const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const resolve = dir => path.join(__dirname, '..', dir)

module.exports = merge(baseConfig, {
  entry: './examples/main.js',
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    open: true
  }
})