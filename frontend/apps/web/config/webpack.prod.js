/* eslint-disable */
require('dotenv').config()
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const {
  moduleRules,
  pluginsRules,
  optimizationRules,
} = require('@filecoin/build')

const base = require('./webpack.base')
const { ANALYZE } = process.env

const plugins = [...pluginsRules.production]

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: moduleRules.production.rules,
  },
  optimization: { ...optimizationRules, usedExports: true },
  plugins: ANALYZE ? [...plugins, new BundleAnalyzerPlugin()] : plugins,
})
