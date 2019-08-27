const webpack = require('webpack');
const { inProduction, environment } = require('./environment');
const targetExtensionDirectory = require('./target-extension-directory');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

console.log(`Running webpack in ${environment} mode`);

module.exports = targetName => {
  const extensionDirectory = targetExtensionDirectory(targetName);

  const backgroundPage = new HtmlWebpackPlugin({
    title: null,
    chunks: ['background'],
    filename: `${extensionDirectory}/background.html`
  });

  const popupPage = new HtmlWebpackPlugin({
    title: 'Jira',
    chunks: ['popup'],
    filename: `${extensionDirectory}/popup.html`
  });

  const optionsPage = new HtmlWebpackPlugin({
    title: 'Jira',
    chunks: ['options'],
    template: './src/options.html',
    filename: `${extensionDirectory}/options.html`
  });

  const cssRule = {
    test: /\.scss$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
  };

  const plugins = [
    backgroundPage,
    popupPage,
    optionsPage,
    new CopyWebpackPlugin([
      { from: './static/manifest.json', to: extensionDirectory },
      {
        from: `./static/images/logos/${environment}/jira*.png`,
        to: extensionDirectory,
        flatten: true
      }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment)
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ];

  return {
    mode: environment,
    devtool: false,
    optimization: {
      minimize: inProduction,
      minimizer: [
        new TerserPlugin({ sourceMap: true }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    stats: {
      children: false,
      modules: false
    },
    entry: {
      popup: './src/popup.jsx',
      background: './src/background.js',
      options: './src/options.js'
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: {
      contentBase: extensionDirectory,
      compress: true,
      port: 9000
    },
    output: {
      path: extensionDirectory,
      filename: '[name].js'
    },
    module: {
      rules: [cssRule]
    },
    plugins
  };
};
