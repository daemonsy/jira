const path = require('path');
const merge = require('webpack-merge');

const baseConfig = require('./base');

const jsRule = {
  test: /\.js$|jsx/,
  exclude: [path.resolve(__dirname, '..', 'node_modules')],
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
              browsers: 'last 10 Firefox versions'
            },
            corejs: 3,
            useBuiltIns: 'usage',
            shippedProposals: true,
            exclude: ['@babel/plugin-transform-regenerator']
          }
        ]
      ]
    }
  }
};

module.exports = merge(baseConfig('firefox'), {
  module: {
    rules: [jsRule]
  }
});
