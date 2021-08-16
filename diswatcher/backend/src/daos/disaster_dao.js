class DisasterDao {
  constructor(sequelize, model) {
    this.sequelize = sequelize;
    this.model = model;
  }

  async save(dataObj, sqlOptions = {}) {
    return this.model.create(dataObj, sqlOptions);
  }

  async update(id, updateData, sqlOptions = {}) {
    const result = await this.model.update(updateData, {
      where: { id },
      returning: true,
      ...sqlOptions,
    });

    return result;
  }

  async findAll() {
    return this.model.findAll();
  }

  async findById(id) {
    const result = await this.model.findOne({
      where: { id },
      raw: true,
    });

    return result;
  }

  async findByBbox(bboxObj) {
    const bboxQuery = `
      SELECT * FROM disasters
      WHERE st_intersects(disasters.geometry, 'SRID=4326;POLYGON((
        ${bboxObj.xMin} ${bboxObj.yMin},
        ${bboxObj.xMin} ${bboxObj.yMax},
        ${bboxObj.xMax} ${bboxObj.yMin},
        ${bboxObj.xMax} ${bboxObj.yMax}
      ))');
    `;
    const result = await this.sequelize.query(bboxQuery);
    
    return result[0];
  }

  async findByBoundary(geometry) {
    const boundaryQuery = `
      SELECT * FROM disasters
      WHERE st_intersects(disasters.geometry, '${geometry}');
    `;
    const result = await this.sequelize.query(boundaryQuery);
    
    return result[0];
  }

  async findLatestEarthquake() {
    const result = await this.model.findOne({
      where: { type: 'earthquake' },
      order: [[ 'event_id', 'DESC' ]],
      raw: true,
    });

    return result;
  }

  async saveEarthquakes(earthquakes) {
    return this.model.bulkCreate(earthquakes);
  }
}

module.exports = {
  DisasterDao,
};
