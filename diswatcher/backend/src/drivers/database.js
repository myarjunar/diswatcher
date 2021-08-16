const Sequelize = require('sequelize');
const process = require('process');

const config = require('../../config');

const Conn = new Sequelize(
  config.get('DATABASE:database'),
  config.get('DATABASE:user'),
  config.get('DATABASE:password'),
  {
    host: config.get('DATABASE:host'),
    port: config.get('DATABASE:port'),
    dialect: config.get('DATABASE:driver'),
  },
);
const { DataTypes, Model } = Sequelize;

Conn.authenticate()
  .then(() => {
    process.stdout.write('Connection has been established successfully. \n');
  })
  .catch((err) => {
    process.stdout.write(`Unable to connect to the database: ${err} \n`);
  });

module.exports = {
  Conn,
  DataTypes,
  Model,
  Sequelize,
};
