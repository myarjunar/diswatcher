const _ = require('lodash');

const geojsonParser = () => {
  class GeoJSONParser {
    static toGeoJSON(jsonData) {
      if (_.isEmpty(jsonData[0])) return jsonData;

      const geojsonFeatures = jsonData.map((json) => {
        const properties = _.cloneDeep(json);
        delete properties.geometry;

        return {
          type: "Feature",
          properties: [properties],
          geometry: json.geometry
        }
      });

      return {
        type: "FeatureCollection",
        features: geojsonFeatures
      }
    }
  }

  return GeoJSONParser;
};

module.exports = geojsonParser();
