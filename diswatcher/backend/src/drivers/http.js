const axios = require('axios');
const https = require('https');

const http = () => {
  class Http {
    async get(args={}) { // eslint-disable-line
      const { endpoint, requestHeaders } = args;
      const { data } = await axios.request({
        method: 'get',
        url: endpoint,
        headers: requestHeaders,
      });

      return data;
    }

    async post(args={}) { // eslint-disable-line
      const httpsAgent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

      const { endpoint, requestHeaders, payload } = args;
      const { data } = await axios.request({
        method: 'post',
        url: endpoint,
        headers: requestHeaders,
        data: payload,
        httpsAgent,
      });

      return data;
    }
  }

  return new Http();
};

module.exports = http();
