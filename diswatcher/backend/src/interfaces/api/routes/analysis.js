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

  router.get('/area-fraction', jsonParser, async (req, res) => {
    logger.info(req.query, 'get-landuse-building-area-fraction-request');

    const { data } = await dataVizBiz.calculateBuildingLanduseFraction(req.query);

    logger.info(data, 'get-landuse-building-area-fraction-response');

    res.send(data);
  });

  return router;
};
