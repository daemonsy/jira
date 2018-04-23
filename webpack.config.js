const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const environment = process.env.NODE_ENV || 'development';
const extensionDirectory = path.resolve(__dirname, environment === 'production' ? './dist' : './build');

console.log(`Running webpack in ${environment} mode`);

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

const cssRule = {
  test: /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader']
  })
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
            browsers: 'last 5 Chrome versions',
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
  new CopyWebpackPlugin([
    { from: './static/manifest.json', to: extensionDirectory },
    { from: './static/images/jira*.png', to: extensionDirectory, flatten: true }
  ]),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(environment || 'development')
  }),
  new ExtractTextPlugin('[name].css')
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new BabelMinifyWebpackPlugin({
    removeDebugger: true,
    removeConsole: true
  }, { comments: false }));
}

module.exports = {
  devtool: false,
  stats: {
    children: false,
    modules: false
  },
  entry: {
    popup: './src/popup.jsx',
    background: './src/background.js'
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
