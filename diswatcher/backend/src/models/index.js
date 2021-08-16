const fs = require('fs');
const path = require('path');

const { Conn, Sequelize } = require('../drivers/database');

const basename = path.basename(module.filename);
const db = {};

const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
  );

if (files.length > 0) {
  files.forEach((file) => {
    const model = Conn.import(path.join(__dirname, file));
    db[model.name] = model;
  });
}
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = Conn;
db.Sequelize = Sequelize;

module.exports = db;
