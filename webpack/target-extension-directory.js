const path = require('path');
const { inProduction } = require('./environment');

module.exports = targetName =>
  path.resolve(__dirname, inProduction ? '../dist' : '../build', targetName);
