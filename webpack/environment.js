const inProduction = process.env.NODE_ENV === 'production';
const environment = process.env.NODE_ENV || 'development';

module.exports = {
  inProduction,
  environment
};
