/* eslint-disable global-require */
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const app = express();
const swaggerDocument = require('../../../docs/openapi.json');
const logger = require('../../helpers/logger');

const port = process.env.PORT || 8010;

async function init() {
  app.use(cors());
  app.use(helmet());

  require('./routes/index')(app);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(port, () =>
    logger.info(`App started and listening on port ${port}`),
  );
}

init();

module.exports = app;
