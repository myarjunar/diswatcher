const assert = require('assert');
const sinon = require('sinon');

const queueDriver = require('../../../src/drivers/amqpClient');
const httpDriver = require('../../../src/drivers/http');
const { DataStreamerBusiness } = require('../../../src/domains/dataStreamer');

describe('DataStreamerBusiness', () => {
  afterEach(() => sinon.restore());

  it('should get earthquake data from GDACS', async () => {
    const dbConnStub = { query: sinon.stub().resolves(undefined) };
    const modelStub = { findOne: sinon.stub().resolves(undefined) };
    const dataStreamer = new DataStreamerBusiness(dbConnStub, modelStub, httpDriver, queueDriver);

    const result = await dataStreamer.populateGdacsEarthquakeData();

    assert.ok(result[0]);
  });
});
