const Dotenv = require('dotenv-webpack')
const HtmlWebpack = require('html-webpack-plugin')
const CopyWebpack = require('copy-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const ForkTsChecker = require('fork-ts-checker-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const compressionPlugin = require('./compression')

const { API_ENDPOINT } = process.env

exports.buildBaseRules = ({ htmlOptions = {}, copyPatterns = [] } = {}) => [
  new Dotenv(),
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/,
    include: /src/,
    failOnError: true,
    allowAsyncCycles: false,
    cwd: process.cwd(),
  }),
  new HtmlWebpack({
    template: './src/index.html',
    ...htmlOptions,
  }),
  new CopyWebpack({
    patterns: [
      {
        from: 'src/public',
      },
      ...copyPatterns,
    ],
  }),
]

exports.buildBaseRulesComponents = () => [
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/,
    include: /src/,
    failOnError: true,
    allowAsyncCycles: false,
    cwd: process.cwd(),
  }),
]

exports.development = [
  new ForkTsChecker({
    typescript: {
      diagnosticOptions: {
        semantic: true,
        syntactic: true,
      },
    },
  }),
]

exports.components = [
  compressionPlugin,
  new CleanWebpackPlugin(),
  new ForkTsChecker({
    typescript: {
      logger: {
        infrastructure: 'silent',
        issues: 'silent',
      },
      diagnosticOptions: {
        semantic: true,
        syntactic: true,
      },
    },
  }),
]

exports.production = [
  compressionPlugin,
  new CleanWebpackPlugin(),
  new ForkTsChecker({
    typescript: {
      logger: {
        infrastructure: 'silent',
        issues: 'silent',
      },
      diagnosticOptions: {
        semantic: true,
        syntactic: true,
      },
    },
  }),
  new WorkboxPlugin.GenerateSW({
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true,
    exclude: [/index.html/],
    runtimeCaching: [
      { urlPattern: new RegExp('/'), handler: 'NetworkFirst' },
      {
        urlPattern: new RegExp(API_ENDPOINT),
        handler: 'NetworkFirst',
      },
    ],
  }),
]
