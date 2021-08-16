const config = require('./index');

const environment = config.get('NODE_ENV') || 'development';

module.exports = {
  [environment]: {
    database: config.get('DATABASE:database'),
    password: config.get('DATABASE:password'),
    username: config.get('DATABASE:user'),
    host: config.get('DATABASE:host'),
    port: config.get('DATABASE:port'),
    dialect: config.get('DATABASE:driver'),
  },
};
