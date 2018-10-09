const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const environment = process.env.NODE_ENV || 'development';
const extensionDirectory = path.resolve(__dirname, environment === 'production' ? './dist' : './build');

console.log(`Running webpack in ${environment} mode`);

const inProduction = process.env.NODE_ENV === 'production';

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

const jsRule = {
  test: /\.js$|jsx|mjs$/,
  exclude: [path.resolve(__dirname, 'node_modules')],
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          modules: false,
          targets: {
            browsers: 'last 10 Chrome versions',
          },
        }]
      ],
      plugins: [require('babel-plugin-transform-react-jsx')]
    }
  },
}

const plugins = [
  backgroundPage,
  popupPage,
  optionsPage,
  new CopyWebpackPlugin([
    { from: './static/manifest.json', to: extensionDirectory },
    { from: './static/images/jira*.png', to: extensionDirectory, flatten: true }
  ]),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(environment || 'development')
  }),
  new MiniCssExtractPlugin({
    filename: "[name].css"
  })
];

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: false,
  optimization: {
    minimize: inProduction,
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
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
    extensions: ['.js', '.jsx', '.mjs']
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
    rules: [jsRule, cssRule]
  },
  plugins
};
