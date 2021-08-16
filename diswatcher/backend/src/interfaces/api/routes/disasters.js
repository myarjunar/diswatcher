/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('../../../helpers/logger');
const models = require('../../../models');
const {
  DataVisualizationBusiness,
} = require('../../../domains/dataVisualization');
const queueDriver = require('../../../drivers/amqpClient');

const jsonParser = bodyParser.json();

module.exports = () => {
  const router = express.Router();
  const dataVizBiz = new DataVisualizationBusiness(
    models.sequelize,
    models.osm_buildings,
    models.osm_landusages,
    models.disasters,
    queueDriver,
  );

  router.get('/', jsonParser, async (req, res) => {
    logger.info(req.query, 'get-all-disasters-request');

    const { data } = await dataVizBiz.getDisastersByBoundary(req.query);

    logger.info(data, 'get-all-disasters-response');

    res.send(data);
  });

  router.get('/:id', jsonParser, async (req, res) => {
    logger.info(req.params, 'get-disaster-by-id-request');

    const { data } = await dataVizBiz.getDisasterById(req.params);

    logger.info(data, 'get-disaster-by-id-response');

    res.send(data);
  });

  return router;
};
