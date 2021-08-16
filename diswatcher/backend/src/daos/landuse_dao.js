class LanduseDao {
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

  async findAll(page, limit) {
    const result = await this.model.findAll({
      offset: (page - 1) * limit,
      limit,
    });

    return result;
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
      SELECT * FROM osm_landusages
      WHERE st_intersects(osm_landusages.geometry, 'SRID=4326;POLYGON((
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
      SELECT * FROM osm_landusages
      WHERE st_intersects(osm_landusages.geometry, '${geometry}');
    `;
    const result = await this.sequelize.query(boundaryQuery);
    
    return result[0];
  }

  async intersection(geometry) {
    const intersectionQuery = `
      SELECT st_intersection(osm_landusages.geometry, '${geometry}') as geometry, st_area(geometry) as area
      FROM osm_landusages
      WHERE st_intersects(osm_landusages.geometry, '${geometry}');
    `;
    const result = await this.sequelize.query(intersectionQuery);
    
    return result[0];
  }
}

module.exports = {
  LanduseDao,
};
