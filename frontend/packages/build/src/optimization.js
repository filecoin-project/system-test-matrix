module.exports = {
  runtimeChunk: {
    name: 'webpack-runtime',
  },
  splitChunks: {
    chunks: 'all',
    minSize: 0,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
      },
    },
  },
}