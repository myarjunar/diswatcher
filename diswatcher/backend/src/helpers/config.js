const config = require('nconf');

config.use('memory');
config.argv().env();

module.exports = config;
