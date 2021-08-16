const _ = require('lodash');
const moment = require('moment');

const { BuildingDao } = require('../daos/building_dao');
const { LanduseDao } = require('../daos/landuse_dao');
const { DisasterDao } = require('../daos/disaster_dao');
const logger = require('../helpers/logger');
const geojsonParser = require('../helpers/geojsonParser');

class DataVisualizationBusiness {
  constructor(
    dbConn,
    buildingModel,
    landuseModel,
    disasterModel,
    queueDriver
  ) {
    this.buildingDao = new BuildingDao(dbConn, buildingModel);
    this.landuseDao = new LanduseDao(dbConn, landuseModel);
    this.disasterDao = new DisasterDao(dbConn, disasterModel);
    this.queueDriver = queueDriver;
    this.sequelize = dbConn;
  }

  async getBuildings(filterObj) {
    try {
      const { x_min: xMin, y_min: yMin, x_max: xMax, y_max: yMax } = filterObj;
      const boundaryObj = { xMin, yMin, xMax, yMax};
      const dbResult = await this.buildingDao.findByBbox(boundaryObj);

      if (!_.isEmpty(dbResult)) {
        return {
          status: true,
          data: geojsonParser.toGeoJSON(dbResult)
        }
      }

      return {
        status: true,
        data: dbResult,
      };
    } catch (err) {
      logger.error(err, 'get-buildings-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async getBuildingById(id) {
    try {
      const dbResult = await this.buildingDao.findById(id);

      if (!_.isEmpty(dbResult)) {
        return {
          status: true,
          data: geojsonParser.toGeoJSON([dbResult])
        }
      }

      return {
        status: true,
        data: dbResult,
      };
    } catch (err) {
      logger.error(err, 'get-building-by-id-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async getBuildingsByBoundary(filterObj) {
    try {
      const { geometry } = filterObj;
      const dbResult = await this.buildingDao.findByBoundary(geometry);

      if (!_.isEmpty(dbResult)) {
        return {
          status: true,
          data: geojsonParser.toGeoJSON(dbResult)
        }
      }

      return {
        status: true,
        data: dbResult,
      };
    } catch (err) {
      logger.error(err, 'get-buildings-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async getLanduseById(id) {
    try {
      const dbResult = await this.landuseDao.findById(id);

      if (!_.isEmpty(dbResult)) {
        return {
          status: true,
          data: geojsonParser.toGeoJSON([dbResult])
        }
      }

      return {
        status: true,
        data: dbResult,
      };
    } catch (err) {
      logger.error(err, 'get-landuse-by-id-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async getLandusagesByBoundary(filterObj) {
    try {
      const { geometry } = filterObj;
      const dbResult = await this.landuseDao.findByBoundary(geometry);

      if (!_.isEmpty(dbResult)) {
        return {
          status: true,
          data: geojsonParser.toGeoJSON(dbResult)
        }
      }

      return {
        status: true,
        data: dbResult,
      };
    } catch (err) {
      logger.error(err, 'get-landusages-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async getDisasterById(id) {
    try {
      const dbResult = await this.disasterDao.findById(id);

      if (!_.isEmpty(dbResult)) {
        return {
          status: true,
          data: geojsonParser.toGeoJSON([dbResult])
        }
      }

      return {
        status: true,
        data: dbResult,
      };
    } catch (err) {
      logger.error(err, 'get-landuse-by-id-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async getDisastersByBoundary(filterObj) {
    try {
      let dbResult;
      const { geometry } = filterObj;

      if (!_.isEmpty(geometry)) {
        dbResult = await this.disasterDao.findByBoundary(geometry);
      } else {
        dbResult = await this.disasterDao.findAll();
      }

      if (!_.isEmpty(dbResult)) {
        return {
          status: true,
          data: geojsonParser.toGeoJSON(dbResult)
        }
      }

      return {
        status: true,
        data: dbResult,
      };
    } catch (err) {
      logger.error(err, 'get-landusages-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async calculateBuildingLanduseFraction(filterObj) {
    try {
      const { geometry } = filterObj;
      const buildingResult = await this.buildingDao.intersection(geometry);
      const landuseResult = await this.landuseDao.intersection(geometry);

      let buildingGeoJSON;
      let landuseGeoJSON;

      if (!_.isEmpty(buildingResult)) {
        buildingGeoJSON = geojsonParser.toGeoJSON(buildingResult)
      }

      if (!_.isEmpty(landuseResult)) {
        landuseGeoJSON = geojsonParser.toGeoJSON(landuseResult)
      }

      const result = {
        buildings: buildingGeoJSON || buildingResult,
        landusages: landuseGeoJSON || landuseResult,
      };

      return {
        status: true,
        data: result,
      };
    } catch (err) {
      logger.error(err, 'get-landusages-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async process(id) {
    try {
      logger.info({ id }, 'process-batch-disbursement');

      const {
        status,
        message,
        error_code: errorCode,
      } = await this.routingService.batchDisburse(id);

      if (!status) {
        logger.error(
          { id, message, errorCode },
          'process-batch-disbursement-error',
        );

        return {
          status: false,
          data: {
            error_code: errorCode,
            message,
          },
        };
      }

      return {
        status: true,
      };
    } catch (err) {
      logger.error(err, 'process-batch-disbursement-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }

  async processTodayBatchDisbursement() {
    try {
      const today = new Date(
        moment.tz(this.config.timezone).format('YYYY-MM-DD'),
      );
      const batchDisbursements = await this.dao.getByStatusAndScheduleDateAndCurrency(
        'APPROVED',
        today,
        this.config.currency,
      );

      logger.info(batchDisbursements, 'batch-disbursements-output');

      if (_.isEmpty(batchDisbursements))
        return {
          status: false,
          data: {
            message: 'No scheduled batch disbursement found for today',
          },
        };

      await Promise.all(
        batchDisbursements.map(async (batchDisbursement) => {
          const { status, data } = await this.process(batchDisbursement.id);

          const updateObj = { scheduler_status: 'SUCCESS' };
          if (!status) {
            updateObj.scheduler_status = 'FAILED';
            updateObj.failure_code = data.error_code;
          }

          await this.dao.update(batchDisbursement.id, updateObj);

          return true;
        }),
      );

      return {
        status: true,
      };
    } catch (err) {
      logger.error(err, 'process-today-batch-disbursement-error');

      return {
        status: false,
        data: {
          error_code: 'SERVER_ERROR',
          message: err.message,
        },
      };
    }
  }
}

module.exports = {
  DataVisualizationBusiness,
};
