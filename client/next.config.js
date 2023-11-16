const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    // 'filename' is specific to 'asset/resource' type only, but incompatible with 'asset/inline',
    // see https://webpack.js.org/guides/asset-modules/#custom-output-filename.
    // Here we rename generator['asset'] into generator['asset/resource'] to avoid conflicts with inline assets.
    if (config.module.generator?.asset?.filename) {
      if (!config.module.generator['asset/resource']) {
        config.module.generator['asset/resource'] = config.module.generator.asset
      }
      delete config.module.generator.asset
    }
    config.module.rules.push(
      {
        // this part is for css
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }],
      },
      {
        // this part is for less
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      });
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/[contenthash].css',
      })
    );
    return config;
  },
};