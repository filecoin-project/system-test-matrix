const CompressionPlugin = require('compression-webpack-plugin')

const compressionOptions = {
  algorithm: 'gzip',
  compressionOptions: { level: 9 },
  minRatio: 1,
}

module.exports = new CompressionPlugin(compressionOptions)
