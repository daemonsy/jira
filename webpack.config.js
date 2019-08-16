const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const environment = process.env.NODE_ENV || 'development';
const extensionDirectory = path.resolve(
  __dirname,
  environment === 'production' ? './dist' : './build'
);
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const inProduction = process.env.NODE_ENV === 'production';

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
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: 'last 10 Chrome versions'
            }
          }
        ]
      ]
    }
  }
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

if (!inProduction) {
  plugins.push(
    new ChromeExtensionReloader({
      reloadPage: true,
      entries: {
        contentScript: 'github',
        background: 'background'
      }
    })
  );
}

module.exports = {
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
    github: './src/github.js',
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
