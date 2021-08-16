const config = require('nconf');
const path = require('path');

require('dotenv').load();

config.use('memory');
config.argv().env();

const environment = config.get('NODE_ENV') || 'development';
const configPath = path.resolve(__dirname, `./config.${environment}.json`);
config.file(configPath);

module.exports = config;
