/* eslint-disable consistent-return */
const assert = require('assert');
const request = require('supertest');
const app = require('../../src/interfaces/api/index');

describe('GET /health', () => {
  it('should return healthy', (done) => {
    request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /text/)
      .then((response) => {
        assert.equal(response.text, 'Healthy');
        done();
      });
  });
});
