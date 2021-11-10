/* eslint-disable */
require('dotenv').config()
const path = require('path')

const { moduleRules, resolveRules, pluginsRules } = require('@filecoin/build')

module.exports = {
  entry: {
    main: './src/main.tsx',
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },

  module: {
    rules: moduleRules.base.rules,
  },

  resolve: {
    ...resolveRules,
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },

  plugins: [...pluginsRules.buildBaseRules()],
}
