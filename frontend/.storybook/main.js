module.exports = {
  reactOptions: {
    fastRefresh: true,
    strictMode: true,
  },
  stories: [
    '../packages/**/*.stories.@(js|mdx|tsx|ts|md)',
    '../apps/**/*.stories.@(js|mdx|tsx|ts|md)',
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
    '@storybook/addon-essentials',
    '@storybook/addon-controls',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-measure',
    'storybook-addon-outline',
    '@storybook/addon-viewport',
  ],
  core: {
    builder: 'webpack4',
  },
  features: {
    postcss: false,
    modernInlineRender: true,
  },
  webpackFinal: async config => {
    // styles
    config.module.rules.push({
      test: /\.less$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: { modules: false } },
        { loader: 'less-loader', options: { javascriptEnabled: true } },
      ],
    })
    config.module.rules.push({
      test: /\.scss$/,
      loaders: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            // Prefer `dart-sass`
            implementation: require('sass'),
          },
        },
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
}
