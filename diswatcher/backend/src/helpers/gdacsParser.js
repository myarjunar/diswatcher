const gdacsParser = () => {
  class GdacsParser {
    static transformEearthquakes(gdacsData, lastEventId) {
      let { item: items } = gdacsData.rss.channel;
      const newData = [];

      if (typeof(lastEventId) === 'number') {
        items = items.filter((item) => item['gdacs:eventid'] > lastEventId)
      };

      if (items.length > 0) {
        items.forEach((item) => {
          newData.push({
            type: 'earthquake',
            source: 'gdacs',
            external_id: item.guid,
            name: item.title,
            description: item.description,
            link: item.link,
            timestamp: item.pubDate,
            event_id: item['gdacs:eventid'],
            severity: item['gdacs:severity'],
            geometry: {
              type: 'Point',
              coordinates: [item['georss:point'].split(' ')[1], item['georss:point'].split(' ')[0]]
            },
          });
        });
      }

      return newData;
    }
  }

  return GdacsParser;
};

module.exports = gdacsParser();
