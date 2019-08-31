const path = require('path');
const { inProduction } = require('./environment');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const merge = require('webpack-merge');

const baseConfig = require('./base.js');
const plugins = [];

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
              browsers: 'last 10 Chrome versions'
            }
          }
        ]
      ]
    }
  }
};

// if (!inProduction) {
//   plugins.push(
//     new ChromeExtensionReloader({
//       reloadPage: true,
//       entries: {
//         background: 'background'
//       }
//     })
//   );
// }

module.exports = merge(baseConfig('chrome'), {
  module: {
    rules: [jsRule]
  },
  plugins
});
