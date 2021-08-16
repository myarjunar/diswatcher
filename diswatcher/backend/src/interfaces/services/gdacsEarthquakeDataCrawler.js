const cron = require('node-cron');

const config = require('../../../config');
const logger = require('../../helpers/logger');
const models = require('../../models');
const queueDriver = require('../../drivers/amqpClient');
const httpDriver = require('../../drivers/http');

const { DataStreamerBusiness } = require('../../domains/dataStreamer');

const dataStreamerBiz = new DataStreamerBusiness(models.sequelize, models.disasters, httpDriver, queueDriver);

let isRunning = false;

const scheduler = cron.schedule(
  '*/5 * * * * *',
  async () => {
    if (isRunning) return;

    isRunning = true;

    logger.info('Starting GDACS EQ data crawler', 'gdacs-earthquake-data-crawler-start');

    try {
      const { status, data } = await dataStreamerBiz.populateGdacsEarthquakeData();

      if (status) {
        logger.info('Success', 'gdacs-earthquake-data-crawler-success');
      } else {
        logger.info(data, 'scheduled-batch-disbursement-processor-fail');
      }
    } catch (err) {
      logger.error(err.message, 'gdacs-earthquake-data-crawler-error');
    }

    isRunning = false;
  },
  { scheduled: false },
);

if (config.get('NODE_ENV') !== 'test') scheduler.start();

module.exports = scheduler;
