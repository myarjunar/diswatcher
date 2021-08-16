const _ = require('lodash');

const logger = require('../helpers/logger');
const gdacsParser = require('../helpers/gdacsParser');
const xmlParser = require('../helpers/xmlParser');
const { DisasterDao } = require('../daos/disaster_dao');

class DataStreamerBusiness {
  constructor(dbConn, disasterModel, httpDriver, queueDriver) {
    this.disasterDao = new DisasterDao(dbConn, disasterModel);
    this.http = httpDriver;
    this.queue = queueDriver
  }

  async populateGdacsEarthquakeData() {
    const latestEarthquake = await this.disasterDao.findLatestEarthquake();
    const earthquakeData = !_.isEmpty(latestEarthquake) ? latestEarthquake : {};

    const gdacsRssXml = await this.http.get({
      endpoint: 'https://gdacs.org/xml/rss_eq_5.5_3m.xml'
    });
    
    const gdacsRssObj = xmlParser.parse(gdacsRssXml);
    const transformedGdacsEqs = gdacsParser.transformEearthquakes(gdacsRssObj, earthquakeData.event_id);

    let results = [];
    if (transformedGdacsEqs.length > 0) {
      results = await this.disasterDao.saveEarthquakes(transformedGdacsEqs);
      logger.info(`Successfully saved ${results.length} new EQ data`);
    } else {
      logger.info(`There is no new EQ data`);
    }

    return {
      status: true,
      data: results
    };
  }
}

module.exports = {
  DataStreamerBusiness
};
