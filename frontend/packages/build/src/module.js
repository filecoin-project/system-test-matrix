const babelLoaderOptions = {
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: '.cache',
  },
}

module.exports = {
  base: {
    rules: [
      {
        ...babelLoaderOptions,
        test: /\.m?jsx?$/,
      },
      {
        ...babelLoaderOptions,
        test: /\.tsx?$/,
      },
      {
        test: /\.(woff|woff2|ttf|eot|otf)$/,
        use: 'file-loader?name=fonts/[name].[ext]',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader'],
      },
    ],
  },
  production: {
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
  development: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
}
