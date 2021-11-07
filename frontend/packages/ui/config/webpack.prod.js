/* eslint-disable */
require('dotenv').config()
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { pluginsRules, optimizationRules } = require('@filecoin/build')

const base = require('./webpack.base')
const { ANALYZE } = process.env

const plugins = [...pluginsRules.components]

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer', 'cssnano'],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer', 'cssnano'],
              },
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  optimization: { ...optimizationRules, usedExports: true },
  plugins: ANALYZE ? [...plugins, new BundleAnalyzerPlugin()] : plugins,
})
