const logger = require('../helpers/logger');

module.exports = {
  publishToTransactionQueue: async (payload) => {
    logger.info(payload, 'publish-to-transaction-queue');

    return true;
  },
};
