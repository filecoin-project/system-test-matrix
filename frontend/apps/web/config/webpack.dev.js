/* eslint-disable */
require('dotenv').config()
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

const { moduleRules, pluginsRules } = require('@filecoin/build')

const { PORT = 8080 } = process.env

module.exports = merge(base, {
  target: 'web',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    port: PORT,
    historyApiFallback: true,
    devMiddleware: {
      stats: 'none',
    },
    static: {
      directory: './dist',
    },
    client: {
      logging: 'info',
    },
  },

  module: {
    rules: moduleRules.development.rules,
  },

  plugins: pluginsRules.development,
})
