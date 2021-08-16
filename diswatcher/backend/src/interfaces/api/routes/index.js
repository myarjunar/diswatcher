/* eslint-disable */
const changeCase = require('change-case');
const routes = require('require-dir')();

module.exports = (app) => {
  Object.keys(routes).forEach((routeName) => {
    app.use(
      `/${changeCase.paramCase(routeName)}`,
      require(`./${routeName}`)(),
    );
  });
};
